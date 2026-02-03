import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FavoriteButton } from "@/components/FavoriteButton";
import { DeleteEventButton } from "@/components/DeleteEventButton";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  const event = await prisma.event.findUnique({
    where: { id },
    include: { organizer: { select: { id: true, name: true } } },
  });

  if (!event) notFound();

  let isFavorite = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: id } },
    });
    isFavorite = !!fav;
  }

  const canEdit =
    session?.user &&
    (session.user.role === "ADMIN" || event.organizerId === session.user.id);
  const dateStr = new Date(event.dateTime).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
            Sin imagen
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-white">{event.title}</h1>
              <p className="text-underground-muted mt-1">{event.category}</p>
              {event.status === "CANCELLED" && (
                <span className="inline-block mt-2 bg-underground-danger text-white text-sm px-2 py-1 rounded">
                  Cancelado
                </span>
              )}
            </div>
            {session?.user && (
              <FavoriteButton eventId={event.id} initialChecked={isFavorite} />
            )}
          </div>
          <p className="mt-4 text-zinc-300 whitespace-pre-wrap">{event.description}</p>
          <dl className="mt-6 grid gap-2 text-sm">
            <div>
              <dt className="text-underground-muted">Fecha y hora</dt>
              <dd className="text-white">{dateStr}</dd>
            </div>
            <div>
              <dt className="text-underground-muted">Ubicación</dt>
              <dd className="text-white">{event.location}</dd>
            </div>
            {event.organizer?.name && (
              <div>
                <dt className="text-underground-muted">Organizador</dt>
                <dd className="text-underground-accent">{event.organizer.name}</dd>
              </div>
            )}
          </dl>
          {canEdit && (
            <div className="mt-6 flex gap-2">
              <Link
                href={`/events/${event.id}/edit`}
                className="bg-underground-accent text-white px-4 py-2 rounded text-sm font-medium hover:bg-purple-600"
              >
                Editar
              </Link>
              <DeleteEventButton eventId={event.id} />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
