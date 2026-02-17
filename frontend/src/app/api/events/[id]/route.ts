import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma, eventSchema } from "@portal/backend";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { organizer: { select: { id: true, name: true, email: true } } },
  });
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  return NextResponse.json(event);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

  const isAdmin = session.user.role === "ADMIN";
  const isOrganizer = event.organizerId === session.user.id;
  if (!isAdmin && !isOrganizer) {
    return NextResponse.json({ error: "No puedes editar este evento" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const parsed = eventSchema.partial().safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const data: Record<string, unknown> = { ...parsed.data };
    if (data.dateTime) data.dateTime = new Date(data.dateTime as string);
    if (data.image === "") data.image = null;
    if (data.price === "") data.price = null;
    if (data.priceCents === "" || data.priceCents === undefined) data.priceCents = null;

    const updated = await prisma.event.update({
      where: { id },
      data: data as Parameters<typeof prisma.event.update>[0]["data"],
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error("Update event error:", e);
    return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = params;
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

  const isAdmin = session.user.role === "ADMIN";
  const isOrganizer = event.organizerId === session.user.id;
  if (!isAdmin && !isOrganizer) {
    return NextResponse.json({ error: "No puedes eliminar este evento" }, { status: 403 });
  }

  await prisma.event.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
