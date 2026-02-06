import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { EventsPageEmpty } from "@/components/EventsPageEmpty";
import { PageTitle } from "@/components/PageTitle";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      event: { include: { organizer: { select: { name: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const events = favorites.map((f) => f.event);

  return (
    <div className="space-y-6">
      <PageTitle translationKey="events.favorites" />
      {events.length === 0 ? (
        <EventsPageEmpty messageKey="events.favoritesEmpty" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <li key={event.id}>
              <EventCard event={event} showOrganizer />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
