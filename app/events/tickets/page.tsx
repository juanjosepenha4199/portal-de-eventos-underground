import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PageTitle } from "@/components/PageTitle";
import { EventsPageEmpty } from "@/components/EventsPageEmpty";

export const dynamic = "force-dynamic";

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

function formatPrice(cents: number, currency: string) {
  const value = (cents / 100).toFixed(2);
  if (currency.toLowerCase() === "eur") return `${value} €`;
  return `${value} ${currency.toUpperCase()}`;
}

export default async function MyTicketsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/events/tickets");

  const tickets = await prisma.ticket.findMany({
    where: { userId: session.user.id, status: "PAID" },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          dateTime: true,
          location: true,
          image: true,
          status: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageTitle translationKey="ticket.myTickets" />
      {tickets.length === 0 ? (
        <EventsPageEmpty messageKey="ticket.noTickets" />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link
                href={`/events/${ticket.event.id}`}
                className="block rounded-xl border border-underground-border bg-underground-card overflow-hidden hover:border-neon-purple/50 hover:shadow-neon-sm transition"
              >
                <div className="aspect-[4/3] bg-underground-border relative flex items-center justify-center">
                  {ticket.event.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={ticket.event.image}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-underground-muted text-sm">Sin imagen</span>
                  )}
                  <span className="absolute top-2 right-2 bg-neon-purple/90 text-white text-xs font-medium px-2 py-1 rounded">
                    Entrada
                  </span>
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-underground-fg truncate">
                    {ticket.event.title}
                  </h2>
                  <p className="text-underground-muted text-sm mt-1">
                    {formatDate(ticket.event.dateTime)}
                  </p>
                  <p className="text-underground-muted text-sm truncate">
                    {ticket.event.location}
                  </p>
                  <p className="text-neon-purple font-medium text-sm mt-2">
                    {formatPrice(ticket.amountCents, ticket.currency)}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
