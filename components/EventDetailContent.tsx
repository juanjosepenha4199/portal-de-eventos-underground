"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DeleteEventButton } from "@/components/DeleteEventButton";

type EventDetailContentProps = {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    dateTime: Date;
    location: string;
    image: string | null;
    price: string | null;
    status: string;
    organizer?: { name: string | null } | null;
  };
  dateStr: string;
  canEdit: boolean;
  isFavorite: boolean;
};

export function EventDetailContent({ event, dateStr, canEdit, isFavorite }: EventDetailContentProps) {
  const { t } = useTranslation();

  return (
    <article className="max-w-3xl mx-auto">
      <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden">
        {event.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image}
            alt={event.title}
            className="w-full aspect-video object-cover"
          />
        ) : (
          <div className="w-full aspect-video bg-underground-border flex items-center justify-center text-underground-muted">
            {t("card.noImage")}
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-underground-fg">{event.title}</h1>
              <p className="text-underground-muted mt-1">{event.category}</p>
              {event.status === "CANCELLED" && (
                <span className="inline-block mt-2 bg-underground-danger text-white text-sm px-2 py-1 rounded">
                  {t("event.cancelled")}
                </span>
              )}
            </div>
            <FavoriteButton eventId={event.id} initialChecked={isFavorite} />
          </div>
          <p className="mt-4 text-underground-muted whitespace-pre-wrap">{event.description}</p>
          <dl className="mt-6 grid gap-2 text-sm">
            <div>
              <dt className="text-underground-muted">{t("event.dateTime")}</dt>
              <dd className="text-underground-fg">{dateStr}</dd>
            </div>
            <div>
              <dt className="text-underground-muted">{t("event.location")}</dt>
              <dd className="text-underground-fg">{event.location}</dd>
            </div>
            {event.price != null && event.price.trim() !== "" && (
              <div>
                <dt className="text-underground-muted">{t("event.price")}</dt>
                <dd className="text-underground-accent font-medium">{event.price}</dd>
              </div>
            )}
            {event.organizer?.name && (
              <div>
                <dt className="text-underground-muted">{t("event.organizer")}</dt>
                <dd className="text-underground-accent">{event.organizer.name}</dd>
              </div>
            )}
          </dl>
          {canEdit && (
            <div className="mt-6 flex gap-2">
              <Link
                href={`/events/${event.id}/edit`}
                className="bg-underground-accent text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90"
              >
                {t("event.edit")}
              </Link>
              <DeleteEventButton eventId={event.id} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
