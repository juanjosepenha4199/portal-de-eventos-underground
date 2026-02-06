"use client";

import { useState } from "react";
import type { Event as PrismaEvent } from "@prisma/client";
import { EventCard } from "@/components/EventCard";
import { useTranslation } from "@/lib/i18n/context";

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  );
}

type EventWithOrganizer = PrismaEvent & { organizer?: { name: string | null } };

const INITIAL_COUNT = 8;
const LOAD_MORE_COUNT = 8;

export function UpcomingEvents({ events }: { events: EventWithOrganizer[] }) {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const visible = events.slice(0, visibleCount);
  const hasMore = visibleCount < events.length;

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-underground-fg">{t("upcoming.title")}</h2>
        <div className="flex rounded-lg overflow-hidden border border-underground-border" role="group" aria-label={t("upcoming.viewMode")}>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-0 ${viewMode === "grid" ? "bg-neon-purple/30 text-underground-fg" : "bg-underground-card text-underground-muted hover:text-underground-fg"}`}
            aria-label={t("upcoming.viewGrid")}
            aria-pressed={viewMode === "grid"}
          >
            <GridIcon className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 border-l border-underground-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-0 ${viewMode === "list" ? "bg-neon-purple/30 text-underground-fg" : "bg-underground-card text-underground-muted hover:text-underground-fg"}`}
            aria-label={t("upcoming.viewList")}
            aria-pressed={viewMode === "list"}
          >
            <ListIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-underground-muted py-12 text-center">
          {t("upcoming.noEvents")}
        </p>
      ) : viewMode === "grid" ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((event) => (
            <li key={event.id}>
              <EventCard event={event} showOrganizer variant="grid" />
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid gap-4">
          {visible.map((event) => (
            <li key={event.id}>
              <EventCard event={event} showOrganizer variant="list" />
            </li>
          ))}
        </ul>
      )}

      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => Math.min(c + LOAD_MORE_COUNT, events.length))}
            className="px-6 py-3 rounded-lg border border-underground-border text-underground-fg text-sm font-medium hover:bg-neon-purple/10 hover:border-neon-purple/50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2"
          >
            {t("upcoming.loadMore")}
          </button>
        </div>
      )}
    </section>
  );
}
