import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions, prisma } from "@portal/backend";
import { AttendeesPageContent } from "./AttendeesPageContent";

export const dynamic = "force-dynamic";

export default async function EventAttendeesPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) notFound();
  const role = session.user.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") notFound();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, organizerId: true },
  });

  if (!event) notFound();
  if (role === "ORGANIZER" && event.organizerId !== session.user.id) notFound();

  const tickets = await prisma.ticket.findMany({
    where: { eventId, status: "PAID" },
    include: { user: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-4xl mx-auto">
      <AttendeesPageContent eventTitle={event.title} eventId={event.id} tickets={tickets} />
    </div>
  );
}
