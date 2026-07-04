import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const tasks = await prisma.backlogTask.findMany({
      orderBy: { criadoEm: 'desc' },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const task = await prisma.backlogTask.create({
      data: {
        titulo: json.titulo,
        descricao: json.descricao || null,
        status: json.status || 'PENDENTE',
        urgencia: json.urgencia || 'MEDIA',
        desenvolvedor: json.desenvolvedor || null,
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar tarefa' }, { status: 500 });
  }
}
