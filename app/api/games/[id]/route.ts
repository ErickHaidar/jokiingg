import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const game = await prisma.game.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error(`GET /api/games/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal mengambil data game' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl } = body;

    if (slug) {
      const existing = await prisma.game.findUnique({ where: { slug } });
      if (existing && existing.id !== id) {
        return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
      }
    }

    const game = await prisma.game.update({
      where: { id },
      data: { name, slug, description, imageUrl },
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error(`PUT /api/games/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal mengupdate game' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.game.delete({ where: { id } });
    return NextResponse.json({ message: 'Game berhasil dihapus' });
  } catch (error) {
    console.error(`DELETE /api/games/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal menghapus game' }, { status: 500 });
  }
}
