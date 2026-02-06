import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { eventSchema } from "@/lib/validations/event";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Prisma.EventWhereInput = { status: "ACTIVE" };
  if (category) where.category = category;
  if (from || to) {
    where.dateTime = {};
    if (from) (where.dateTime as { gte?: Date }).gte = new Date(from);
    if (to) {
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);
      (where.dateTime as { lte?: Date }).lte = end;
    }
  }

  const events = await prisma.event.findMany({
    where,
    include: { organizer: { select: { id: true, name: true, email: true } } },
    orderBy: { dateTime: "asc" },
  });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const role = session.user.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") {
    return NextResponse.json({ error: "Solo organizadores o admin pueden crear eventos" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data = {
      ...parsed.data,
      dateTime: new Date(parsed.data.dateTime),
      image: parsed.data.image || null,
      price: parsed.data.price?.trim() || null,
      organizerId: session.user.id,
    };

    const event = await prisma.event.create({ data });
    return NextResponse.json(event, { status: 201 });
  } catch (e) {
    console.error("Create event error:", e);
    return NextResponse.json({ error: "Error al crear evento" }, { status: 500 });
  }
}
