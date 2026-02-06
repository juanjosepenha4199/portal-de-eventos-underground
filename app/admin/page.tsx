import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AdminEvents } from "@/components/AdminEvents";
import { AdminSectionTitle } from "@/components/AdminSectionTitle";
import { AdminUsers } from "@/components/AdminUsers";
import { PageTitle } from "@/components/PageTitle";

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
      <PageTitle translationKey="admin.panelTitle" />

      <section>
        <AdminSectionTitle translationKey="admin.users" />
        <AdminUsers users={users} />
      </section>

      <section>
        <AdminSectionTitle translationKey="admin.events" />
        <AdminEvents events={events} />
      </section>
    </div>
  );
}
