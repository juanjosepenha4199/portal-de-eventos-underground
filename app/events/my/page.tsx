import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";

export const dynamic = "force-dynamic";

export default async function MyEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");
  const role = session.user.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") redirect("/events");

  const events = await prisma.event.findMany({
    where: role === "ADMIN" ? {} : { organizerId: session.user.id },
    include: { organizer: { select: { name: true } } },
    orderBy: { dateTime: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          {role === "ADMIN" ? "Todos los eventos" : "Mis eventos"}
        </h1>
        <Link
          href="/events/new"
          className="bg-underground-accent text-white px-4 py-2 rounded font-medium hover:bg-purple-600"
        >
          Crear evento
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="text-underground-muted py-8">No hay eventos.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} showOrganizer={role === "ADMIN"} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
