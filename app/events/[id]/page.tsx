import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventDetailContent } from "@/components/EventDetailContent";

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
    <EventDetailContent
      event={event}
      dateStr={dateStr}
      canEdit={!!canEdit}
      isFavorite={isFavorite}
    />
  );
}
