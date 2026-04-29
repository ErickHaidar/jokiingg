import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameId = searchParams.get('gameId');

    const services = await prisma.service.findMany({
      where: gameId ? { gameId } : undefined,
      include: { game: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Gagal mengambil data layanan' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, basePrice, gameId } = body;

    if (!name || !basePrice || !gameId) {
      return NextResponse.json({ error: 'Nama, harga, dan game wajib diisi' }, { status: 400 });
    }

    const game = await prisma.game.findUnique({ where: { id: gameId } });
    if (!game) {
      return NextResponse.json({ error: 'Game tidak ditemukan' }, { status: 404 });
    }

    const service = await prisma.service.create({
      data: { name, description, basePrice, gameId },
      include: { game: true },
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('POST /api/services error:', error);
    return NextResponse.json({ error: 'Gagal menambah layanan' }, { status: 500 });
  }
}
