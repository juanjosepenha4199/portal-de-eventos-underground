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

export default async function HomePage({
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
      <section className="text-center py-8">
        <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
          Underground
        </h1>
        <p className="text-underground-muted text-lg">
          Tu portal de eventos alternativos, culturales e independientes
        </p>
      </section>

      <Suspense fallback={<div className="rounded-lg border border-underground-border bg-underground-card p-4 h-20" />}>
        <EventFilters />
      </Suspense>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-white">Próximos eventos</h2>
        {events.length === 0 ? (
          <p className="text-underground-muted py-8 text-center">
            No hay eventos publicados aún.
            {session?.user?.role && ["ORGANIZER", "ADMIN"].includes(session.user.role) && (
              <> <Link href="/events/new" className="text-underground-accent hover:underline">Crear uno</Link></>
            )}
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <li key={event.id}>
                <EventCard event={event} showOrganizer />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
