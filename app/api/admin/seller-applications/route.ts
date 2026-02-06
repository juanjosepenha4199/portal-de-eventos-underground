import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const list = await prisma.sellerApplication.findMany({
    where: { status: "PENDING" },
    include: { user: { select: { id: true, email: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(list);
}
