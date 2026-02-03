import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminEvents } from "@/components/AdminEvents";
import { AdminUsers } from "@/components/AdminUsers";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || session.user.role !== "ADMIN") redirect("/");

  const events = await prisma.event.findMany({
    include: { organizer: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-white">Panel de administración</h1>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Usuarios registrados</h2>
        <AdminUsers users={users} />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-white mb-4">Todos los eventos</h2>
        <AdminEvents events={events} />
      </section>
    </div>
  );
}
