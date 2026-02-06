import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { EventsPageEmpty } from "@/components/EventsPageEmpty";
import { MyEventsPageHeader } from "@/components/MyEventsPageHeader";

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
      <MyEventsPageHeader isAdmin={role === "ADMIN"} />
      {events.length === 0 ? (
        <EventsPageEmpty messageKey="events.myEventsEmpty" />
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
