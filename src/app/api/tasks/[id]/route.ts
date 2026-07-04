import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const json = await request.json();
    const task = await prisma.backlogTask.update({
      where: { id: params.id },
      data: {
        titulo: json.titulo,
        descricao: json.descricao,
        status: json.status,
        urgencia: json.urgencia,
        desenvolvedor: json.desenvolvedor,
      },
    });
    return NextResponse.json(task);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar tarefa' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.backlogTask.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar tarefa' }, { status: 500 });
  }
}
