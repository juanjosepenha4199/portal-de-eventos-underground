import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");

  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) notFound();

  const isAdmin = session.user.role === "ADMIN";
  const isOrganizer = event.organizerId === session.user.id;
  if (!isAdmin && !isOrganizer) redirect("/events");

  const d = new Date(event.dateTime);
  const dateTimeLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  const initial = {
    title: event.title,
    description: event.description,
    category: event.category,
    dateTime: dateTimeLocal,
    location: event.location,
    image: event.image ?? "",
    status: event.status,
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Editar evento</h1>
      <EventForm eventId={id} initial={initial} />
    </div>
  );
}
