import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bodySchema = z.object({
  action: z.enum(["approve", "reject"]),
  rejectionReason: z.string().optional(),
});

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { id } = await params;
  let body: unknown;
  try {
    body = await _request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "action debe ser approve o reject" }, { status: 400 });
  }
  const { action, rejectionReason } = parsed.data;

  const application = await prisma.sellerApplication.findUnique({
    where: { id },
    include: { user: true },
  });
  if (!application || application.status !== "PENDING") {
    return NextResponse.json({ error: "Solicitud no encontrada o ya revisada" }, { status: 404 });
  }

  if (action === "approve") {
    await prisma.$transaction([
      prisma.sellerApplication.update({
        where: { id },
        data: { status: "APPROVED", reviewedAt: new Date(), reviewedBy: session.user.id },
      }),
      prisma.user.update({
        where: { id: application.userId },
        data: { role: "ORGANIZER" },
      }),
    ]);
    return NextResponse.json({ ok: true, message: "Vendedor aprobado" });
  }

  await prisma.sellerApplication.update({
    where: { id },
    data: {
      status: "REJECTED",
      reviewedAt: new Date(),
      reviewedBy: session.user.id,
      rejectionReason: rejectionReason ?? null,
    },
  });
  return NextResponse.json({ ok: true, message: "Solicitud rechazada" });
}
