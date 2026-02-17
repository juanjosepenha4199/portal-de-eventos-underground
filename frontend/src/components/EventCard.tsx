"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Event } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/context";
import { AddToCartButton } from "@/components/AddToCartButton";

type EventWithOrganizer = Event & { organizer?: { name: string | null } };

interface EventCardProps {
  event: EventWithOrganizer;
  showOrganizer?: boolean;
  variant?: "grid" | "list";
  /** Número de asistentes (entradas pagadas) — se muestra en vista vendedor */
  attendanceCount?: number;
  /** Si true, el número de asistentes es enlace a /events/my/[id]/attendees */
  attendeesLink?: boolean;
}

function formatDateBadge(d: Date) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  }).toUpperCase();
}

function formatDateFull(d: Date) {
  return new Date(d).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max).trim() + "…";
}

export function EventCard({ event, showOrganizer, variant = "grid", attendanceCount, attendeesLink }: EventCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const href = `/events/${event.id}`;
  const attendeesHref = `/events/my/${event.id}/attendees`;
  const hasImage = event.image && event.image.trim().length > 0;
  const descriptionSnippet = truncate(event.description, 80);
  const priceLabel = event.price?.trim() || t("card.viewEvent");

  if (variant === "list") {
    return (
      <Link
        href={href}
        className="flex gap-4 rounded-xl border border-underground-border bg-underground-card overflow-hidden hover:border-neon-purple/50 hover:shadow-neon-sm transition card-neon p-0 sm:flex-row flex-col"
      >
        <div className="relative w-full sm:w-48 h-40 sm:h-32 flex-shrink-0 bg-underground-border">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image!}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-underground-muted text-sm">Sin imagen</span>
          )}
          <span className="absolute top-2 left-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded">
            {formatDateBadge(event.dateTime)}
          </span>
        </div>
        <div className="flex-1 min-w-0 p-4 flex flex-col justify-center">
          <h3 className="font-semibold text-underground-fg truncate">{event.title}</h3>
          <p className="text-underground-muted text-sm mt-1 line-clamp-2">{descriptionSnippet}</p>
          <p className="text-zinc-400 text-sm mt-2 flex items-center gap-1">
            <span aria-hidden>📍</span> {event.location}
          </p>
          {showOrganizer && event.organizer?.name && (
            <p className="text-underground-accent/80 text-xs mt-1">{event.organizer.name}</p>
          )}
          {typeof attendanceCount === "number" && (
            <p className="text-neon-cyan/90 text-xs mt-1 font-medium">
              {t("event.attendees")}:{" "}
              {attendeesLink ? (
                <button
                  type="button"
                  className="hover:underline bg-transparent border-0 p-0 cursor-pointer text-inherit font-inherit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(attendeesHref);
                  }}
                >
                  {attendanceCount}
                </button>
              ) : (
                attendanceCount
              )}
            </p>
          )}
          <p className="text-underground-accent font-medium text-sm mt-2">{priceLabel}</p>
        </div>
      </Link>
    );
  }

  const priceCents = event.priceCents ?? 0;
  const showCart = priceCents > 0;

  return (
    <div className="rounded-xl border border-underground-border bg-underground-card overflow-hidden hover:border-neon-purple/50 hover:shadow-neon-sm transition card-neon">
      <Link href={href} className="block">
        <div className="aspect-[4/3] bg-underground-border relative flex items-center justify-center">
          {hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.image!}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span className="text-underground-muted text-sm">{t("card.noImage")}</span>
          )}
          <span className="absolute top-2 left-2 bg-black/90 text-white text-xs font-medium px-2 py-1 rounded">
            {formatDateBadge(event.dateTime)}
          </span>
          {event.status === "CANCELLED" && (
            <span className="absolute top-2 right-2 bg-underground-danger text-white text-xs px-2 py-1 rounded">
              {t("card.cancelled")}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-underground-fg truncate">{event.title}</h3>
          <p className="text-underground-muted text-sm mt-1 line-clamp-2">{descriptionSnippet}</p>
          <p className="text-zinc-400 text-sm mt-2 flex items-center gap-1 truncate">
            <span aria-hidden>📍</span> {event.location}
          </p>
          {showOrganizer && event.organizer?.name && (
            <p className="text-underground-accent/80 text-xs mt-1">{event.organizer.name}</p>
          )}
          {typeof attendanceCount === "number" && (
            <p className="text-neon-cyan/90 text-xs mt-1 font-medium">
              {t("event.attendees")}:{" "}
              {attendeesLink ? (
                <button
                  type="button"
                  className="hover:underline bg-transparent border-0 p-0 cursor-pointer text-inherit font-inherit"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(attendeesHref);
                  }}
                >
                  {attendanceCount}
                </button>
              ) : (
                attendanceCount
              )}
            </p>
          )}
          {!showCart && <p className="text-underground-accent font-medium text-sm mt-2">{priceLabel}</p>}
        </div>
      </Link>
      {showCart && (
        <div className="px-4 pb-4 flex justify-between items-center gap-2">
          <p className="text-underground-accent font-medium text-sm">{priceLabel}</p>
          <AddToCartButton
            variant="icon"
            eventId={event.id}
            title={event.title}
            price={priceLabel}
            priceCents={priceCents}
            image={event.image}
          />
        </div>
      )}
    </div>
  );
}
