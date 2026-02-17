"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

type TicketWithUser = {
  id: string;
  createdAt: Date;
  user: { id: string; name: string | null; email: string };
};

export function AttendeesPageContent({
  eventTitle,
  eventId,
  tickets,
}: {
  eventTitle: string;
  eventId: string;
  tickets: TicketWithUser[];
}) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-underground-muted">
        <Link href="/events/my" className="hover:text-neon-cyan underline">
          {t("events.myEvents")}
        </Link>
        <span aria-hidden>/</span>
        <Link href={`/events/${eventId}`} className="hover:text-neon-cyan underline truncate max-w-[200px]">
          {eventTitle}
        </Link>
        <span aria-hidden>/</span>
        <span className="text-underground-fg font-medium">{t("events.attendeesTitle")}</span>
      </div>

      <div className="rounded-xl border border-underground-border bg-underground-card overflow-hidden">
        <div className="p-4 border-b border-underground-border">
          <h1 className="text-xl font-bold text-underground-fg">{eventTitle}</h1>
          <p className="text-underground-muted text-sm mt-1">
            {t("events.attendeesSubtitle")} — {tickets.length} {tickets.length === 1 ? t("events.attendeeOne") : t("events.attendeesCount")}
          </p>
        </div>
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-underground-muted">
            <p>{t("events.attendeesEmpty")}</p>
            <Link
              href={`/events/${eventId}`}
              className="inline-block mt-3 text-neon-cyan hover:underline text-sm font-medium"
            >
              {t("events.attendeesBackToEvent")}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-underground-border bg-underground-bg/50">
                  <th className="text-left py-3 px-4 font-semibold text-underground-fg">
                    {t("events.attendeesName")}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-underground-fg">
                    {t("events.attendeesEmail")}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-underground-fg">
                    {t("events.attendeesDate")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-underground-border/50 hover:bg-underground-bg/30">
                    <td className="py-3 px-4 text-underground-fg">
                      {ticket.user.name?.trim() || t("events.attendeeNoName")}
                    </td>
                    <td className="py-3 px-4 text-underground-muted">{ticket.user.email}</td>
                    <td className="py-3 px-4 text-underground-muted">
                      {new Date(ticket.createdAt).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 border-t border-underground-border flex gap-2">
          <Link
            href={`/events/${eventId}`}
            className="text-sm text-neon-cyan hover:underline font-medium"
          >
            {t("events.attendeesBackToEvent")}
          </Link>
          <span className="text-underground-muted">·</span>
          <Link
            href="/events/my"
            className="text-sm text-neon-cyan hover:underline font-medium"
          >
            {t("events.attendeesBackToMyEvents")}
          </Link>
        </div>
      </div>
    </div>
  );
}
