import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: { game: true },
    });

    if (!service) {
      return NextResponse.json({ error: 'Layanan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error(`GET /api/services/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal mengambil data layanan' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, description, basePrice, gameId } = body;

    const service = await prisma.service.update({
      where: { id },
      data: { name, description, basePrice, gameId },
      include: { game: true },
    });

    return NextResponse.json(service);
  } catch (error) {
    console.error(`PUT /api/services/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal mengupdate layanan' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  try {
    await prisma.service.delete({ where: { id } });
    return NextResponse.json({ message: 'Layanan berhasil dihapus' });
  } catch (error) {
    console.error(`DELETE /api/services/${id} error:`, error);
    return NextResponse.json({ error: 'Gagal menghapus layanan' }, { status: 500 });
  }
}
