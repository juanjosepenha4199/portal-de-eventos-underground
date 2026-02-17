import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, prisma, isPaidEvent } from "@portal/backend";
import { EventDetailContent } from "@/components/EventDetailContent";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ purchased?: string }>;
}) {
  const { id } = await params;
  const { purchased: purchasedParam } = await searchParams;
  const session = await getServerSession(authOptions);
  const event = await prisma.event.findUnique({
    where: { id },
    include: { organizer: { select: { id: true, name: true } } },
  });

  if (!event) notFound();

  let isFavorite = false;
  let hasTicket = false;
  if (session?.user?.id) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_eventId: { userId: session.user.id, eventId: id } },
    });
    isFavorite = !!fav;
    if (typeof prisma.ticket?.findUnique === "function") {
      const ticket = await prisma.ticket.findUnique({
        where: { userId_eventId: { userId: session.user.id, eventId: id } },
      });
      hasTicket = ticket?.status === "PAID";
    }
  }

  const canEdit =
    session?.user &&
    (session.user.role === "ADMIN" || event.organizerId === session.user.id);
  const attendeesCount = canEdit
    ? await prisma.ticket.count({ where: { eventId: id, status: "PAID" } })
    : 0;
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
      attendeesCount={attendeesCount}
      isFavorite={isFavorite}
      hasTicket={hasTicket}
      isPaidEvent={isPaidEvent(event.price, event.priceCents)}
      isLoggedIn={!!session?.user}
      purchased={purchasedParam === "1"}
    />
  );
}
