import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { EventFilters } from "@/components/EventFilters";

export const dynamic = "force-dynamic";

type SearchParams = { category?: string; from?: string; to?: string };

export default async function EventsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = searchParams ?? {};
  const session = await getServerSession(authOptions);

  const where: Prisma.EventWhereInput = { status: "ACTIVE" };
  if (params.category) where.category = { equals: params.category, mode: "insensitive" };
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Eventos</h1>
        {session?.user?.role && ["ORGANIZER", "ADMIN"].includes(session.user.role) && (
          <Link
            href="/events/new"
            className="bg-underground-accent text-white px-4 py-2 rounded font-medium hover:bg-purple-600"
          >
            Crear evento
          </Link>
        )}
      </div>

      <Suspense fallback={<div className="rounded-lg border border-underground-border bg-underground-card p-4 h-20" />}>
        <EventFilters />
      </Suspense>

      {events.length === 0 ? (
        <p className="text-underground-muted py-8 text-center">No hay eventos con estos filtros.</p>
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
