"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DeleteEventButton } from "@/components/DeleteEventButton";
import { BuyTicketButton } from "@/components/BuyTicketButton";
import { AddToCartButton } from "@/components/AddToCartButton";

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
    priceCents?: number | null;
    status: string;
    organizer?: { name: string | null } | null;
  };
  dateStr: string;
  canEdit: boolean;
  isFavorite: boolean;
  hasTicket?: boolean;
  isPaidEvent?: boolean;
  isLoggedIn?: boolean;
  purchased?: boolean;
};

export function EventDetailContent({
  event,
  dateStr,
  canEdit,
  isFavorite,
  hasTicket = false,
  isPaidEvent = false,
  isLoggedIn = false,
  purchased = false,
}: EventDetailContentProps) {
  const { t } = useTranslation();

  return (
    <article className="max-w-3xl mx-auto">
      <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden shadow-neon-sm">
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
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <BuyTicketButton
              eventId={event.id}
              hasTicket={!!hasTicket}
              isPaidEvent={isPaidEvent}
              isLoggedIn={isLoggedIn}
            />
            {isPaidEvent && !hasTicket && (
              <AddToCartButton
                eventId={event.id}
                title={event.title}
                price={event.price ?? ""}
                priceCents={event.priceCents ?? 0}
                image={event.image}
              />
            )}
          </div>
          {purchased && (
            <p role="status" className="mt-3 text-neon-cyan text-sm font-medium">
              {t("ticket.purchasedSuccess")}
            </p>
          )}
          {canEdit && (
            <div className="mt-6 flex gap-2">
              <Link
                href={`/events/${event.id}/edit`}
                className="bg-neon-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
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
