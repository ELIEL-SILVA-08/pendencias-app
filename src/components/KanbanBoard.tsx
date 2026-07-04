"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowRight, ArrowLeft, Trash2, Edit2, AlertCircle } from "lucide-react";

type Task = {
  id: string;
  titulo: string;
  descricao: string | null;
  status: "PENDENTE" | "EM_ANDAMENTO" | "CONCLUIDO";
  urgencia: "BAIXA" | "MEDIA" | "ALTA" | "CRITICA";
  desenvolvedor: string | null;
  criadoEm: string;
};

const URGENCIA_COLORS = {
  BAIXA: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  MEDIA: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  ALTA: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CRITICA: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line
    fetchTasks();
  }, []);

  const handleStatusChange = async (task: Task, newStatus: Task["status"]) => {
    // Optimistic update
    setTasks(tasks.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    await fetch(`/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, status: newStatus }),
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar?")) return;
    setTasks(tasks.filter(t => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      titulo: formData.get("titulo"),
      descricao: formData.get("descricao"),
      urgencia: formData.get("urgencia"),
      desenvolvedor: formData.get("desenvolvedor"),
      status: formData.get("status") || "PENDENTE",
    };

    if (editingTask) {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } else {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      setTasks([created, ...tasks]);
    }
    closeModal();
  };

  const openModal = (task?: Task) => {
    setEditingTask(task || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const renderColumn = (title: string, status: Task["status"]) => {
    const colTasks = tasks.filter(t => t.status === status);
    return (
      <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <h3 className="font-bold text-slate-100">{title}</h3>
          <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded-full">{colTasks.length}</span>
        </div>
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          {colTasks.map(task => (
            <div key={task.id} className="bg-slate-800/50 border border-slate-700 hover:border-slate-600 transition-all rounded-xl p-4 flex flex-col gap-3 group">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-semibold text-slate-100 text-sm leading-tight">{task.titulo}</h4>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <button onClick={() => openModal(task)} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="p-1.5 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-lg transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
              
              {task.descricao && <p className="text-xs text-slate-400 line-clamp-2">{task.descricao}</p>}
              
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-700/50">
                <div className="flex flex-col gap-1.5">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-bold w-fit ${URGENCIA_COLORS[task.urgencia]}`}>
                    <AlertCircle size={10} /> {task.urgencia}
                  </span>
                  {task.desenvolvedor && (
                    <span className="text-[10px] text-indigo-300 font-medium bg-indigo-500/10 px-2 py-0.5 rounded w-fit">
                      @{task.desenvolvedor}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  {status !== "PENDENTE" && (
                    <button onClick={() => handleStatusChange(task, status === "CONCLUIDO" ? "EM_ANDAMENTO" : "PENDENTE")} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                      <ArrowLeft size={14} />
                    </button>
                  )}
                  {status !== "CONCLUIDO" && (
                    <button onClick={() => handleStatusChange(task, status === "PENDENTE" ? "EM_ANDAMENTO" : "CONCLUIDO")} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                      <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {colTasks.length === 0 && (
            <div className="h-full min-h-[100px] flex items-center justify-center text-slate-600 text-sm font-medium border-2 border-dashed border-slate-800 rounded-xl">
              Nenhuma tarefa
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col max-w-[1600px] mx-auto w-full">
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Backlog GestorEduc
          </h1>
          <p className="text-slate-400 text-sm mt-1">Gerenciamento de pendências e melhorias contínuas.</p>
        </div>
        <button onClick={() => openModal()} className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={18} /> Nova Pendência
        </button>
      </header>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-indigo-400 font-bold animate-pulse">Carregando backlog...</div>
      ) : (
        <div className="flex-1 flex flex-col sm:flex-row gap-6 items-stretch">
          {renderColumn("Pendente", "PENDENTE")}
          {renderColumn("Em Andamento", "EM_ANDAMENTO")}
          {renderColumn("Concluído", "CONCLUIDO")}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">{editingTask ? "Editar Pendência" : "Nova Pendência"}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors">X</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">TÍTULO</label>
                <input required name="titulo" defaultValue={editingTask?.titulo} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all" placeholder="Resumo do que precisa ser feito..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">DESCRIÇÃO (OPCIONAL)</label>
                <textarea name="descricao" defaultValue={editingTask?.descricao || ""} rows={3} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none" placeholder="Detalhes da pendência..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">URGÊNCIA</label>
                  <select name="urgencia" defaultValue={editingTask?.urgencia || "MEDIA"} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="CRITICA">Crítica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">DESENVOLVEDOR</label>
                  <input name="desenvolvedor" defaultValue={editingTask?.desenvolvedor || ""} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all" placeholder="Nome do dev..." />
                </div>
              </div>
              {editingTask && (
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">STATUS</label>
                  <select name="status" defaultValue={editingTask.status} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all appearance-none cursor-pointer">
                    <option value="PENDENTE">Pendente</option>
                    <option value="EM_ANDAMENTO">Em Andamento</option>
                    <option value="CONCLUIDO">Concluído</option>
                  </select>
                </div>
              )}
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl font-bold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Cancelar</button>
                <button type="submit" className="px-5 py-2.5 rounded-xl font-bold bg-indigo-500 hover:bg-indigo-400 text-white transition-colors shadow-lg shadow-indigo-500/20 active:scale-95">Salvar Tarefa</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
