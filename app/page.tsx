import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateEventLink } from "@/components/CreateEventLink";
import { EventFilters } from "@/components/EventFilters";
import { FeaturedHero } from "@/components/FeaturedHero";
import { UpcomingEvents } from "@/components/UpcomingEvents";

export const dynamic = "force-dynamic";

type SearchParams = { category?: string; from?: string; to?: string };

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = searchParams ?? {};
  const session = await getServerSession(authOptions);

  const where: Prisma.EventWhereInput = { status: "ACTIVE" };
  if (params.category) where.category = params.category;
  if (params.from || params.to) {
    where.dateTime = {};
    if (params.from) (where.dateTime as { gte?: Date }).gte = new Date(params.from);
    if (params.to) {
      const toDate = new Date(params.to);
      toDate.setHours(23, 59, 59, 999);
      (where.dateTime as { lte?: Date }).lte = toDate;
    }
  }

  const events = await prisma.event.findMany({
    where,
    include: { organizer: { select: { name: true } } },
    orderBy: { dateTime: "asc" },
  });

  const featuredEvent = events[0] ?? null;
  let isFavoriteFeatured = false;
  if (session?.user?.id && featuredEvent) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: featuredEvent.id } },
    });
    isFavoriteFeatured = !!fav;
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <FeaturedHero
        event={featuredEvent ? { id: featuredEvent.id, title: featuredEvent.title, description: featuredEvent.description, location: featuredEvent.location, image: featuredEvent.image } : null}
        isFavorite={isFavoriteFeatured}
      />

      <Suspense fallback={<div className="h-24" />}>
        <EventFilters />
      </Suspense>

      <UpcomingEvents events={events} />

      {events.length === 0 && session?.user?.role && ["ORGANIZER", "ADMIN"].includes(session.user.role) && (
        <CreateEventLink />
      )}
    </div>
  );
}
