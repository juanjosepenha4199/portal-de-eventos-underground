import Link from "next/link";
import type { Event } from "@prisma/client";

type EventWithOrganizer = Event & { organizer?: { name: string | null } };

interface EventCardProps {
  event: EventWithOrganizer;
  showOrganizer?: boolean;
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function EventCard({ event, showOrganizer }: EventCardProps) {
  const href = `/events/${event.id}`;
  const hasImage = event.image && event.image.trim().length > 0;

  return (
    <Link
      href={href}
      className="block rounded-lg border border-underground-border bg-underground-card overflow-hidden hover:border-underground-accent/50 transition"
    >
      <div className="aspect-video bg-underground-border relative flex items-center justify-center">
        {hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.image!}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <span className="text-underground-muted text-sm">Sin imagen</span>
        )}
        {event.status === "CANCELLED" && (
          <span className="absolute top-2 right-2 bg-underground-danger text-white text-xs px-2 py-1 rounded">
            Cancelado
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-white truncate">{event.title}</h3>
        <p className="text-underground-muted text-sm mt-1">{formatDate(event.dateTime)}</p>
        <p className="text-zinc-400 text-sm mt-1 truncate">{event.location}</p>
        {showOrganizer && event.organizer?.name && (
          <p className="text-underground-accent/80 text-xs mt-2">{event.organizer.name}</p>
        )}
      </div>
    </Link>
  );
}
