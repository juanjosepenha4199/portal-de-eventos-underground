import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bodySchema = z.object({ eventId: z.string().min(1) });

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "eventId requerido" }, { status: 400 });
    }
    const event = await prisma.event.findUnique({ where: { id: parsed.data.eventId } });
    if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

    await prisma.favorite.upsert({
      where: {
        userId_eventId: { userId: session.user.id, eventId: parsed.data.eventId },
      },
      create: { userId: session.user.id, eventId: parsed.data.eventId },
      update: {},
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Favorite add error:", e);
    return NextResponse.json({ error: "Error al guardar" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      event: { include: { organizer: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favorites.map((f) => f.event));
}
