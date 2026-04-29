import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      include: { services: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error('GET /api/games error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data game' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Nama dan slug wajib diisi' }, { status: 400 });
    }

    const existing = await prisma.game.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 409 });
    }

    const game = await prisma.game.create({
      data: { name, slug, description, imageUrl },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('POST /api/games error:', error);
    return NextResponse.json({ error: 'Gagal menambah game' }, { status: 500 });
  }
}
