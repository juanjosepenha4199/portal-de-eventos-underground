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
  const params = (typeof searchParams === "object" && searchParams !== null ? searchParams : {}) as SearchParams;
  let session: Awaited<ReturnType<typeof getServerSession>> = null;
  let events: Awaited<ReturnType<typeof prisma.event.findMany>> = [];
  let isFavoriteFeatured = false;

  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error("HomePage getServerSession:", e);
  }

  try {
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

    events = await prisma.event.findMany({
      where,
      include: { organizer: { select: { name: true } } },
      orderBy: { dateTime: "asc" },
    });
  } catch (e) {
    console.error("HomePage prisma.event.findMany:", e);
    return (
      <div className="rounded-lg border border-underground-danger/40 bg-underground-danger/10 p-6 text-center space-y-3">
        <p className="text-underground-danger font-medium">Error al cargar los eventos</p>
        <p className="text-underground-muted text-sm">
          Comprueba que la base de datos esté disponible y que hayas ejecutado <code className="bg-underground-card px-1 rounded">npx prisma generate</code>.
          Cierra otras ventanas que usen la base de datos (Prisma Studio, otra terminal con <code className="bg-underground-card px-1 rounded">npm run dev</code>).
        </p>
        <Link href="/" className="inline-block text-neon-cyan hover:underline">Recargar</Link>
      </div>
    );
  }

  const featuredEvent = events[0] ?? null;
  if (session?.user?.id && featuredEvent) {
    try {
      const fav = await prisma.favorite.findUnique({
        where: { userId_eventId: { userId: session.user.id, eventId: featuredEvent.id } },
      });
      isFavoriteFeatured = !!fav;
    } catch {
      // ignore
    }
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
