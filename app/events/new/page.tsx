import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { EventForm } from "@/components/EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/auth/login");
  const role = session.user.role;
  if (role !== "ORGANIZER" && role !== "ADMIN") redirect("/events");

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Crear evento</h1>
      <EventForm />
    </div>
  );
}
