"use client";

import Link from "next/link";
import type { Event, User } from "@prisma/client";

type EventWithOrganizer = Event & {
  organizer: { name: string | null; email: string } | null;
};

export function AdminEvents({ events }: { events: EventWithOrganizer[] }) {
  async function deleteEvent(id: string) {
    if (!confirm("¿Eliminar este evento?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? "Error al eliminar");
    }
  }

  return (
    <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-underground-bg text-zinc-400">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Organizador</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-white divide-y divide-underground-border">
            {events.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3">
                  <Link href={`/events/${e.id}`} className="text-underground-accent hover:underline truncate max-w-[200px] block">
                    {e.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{e.category}</td>
                <td className="px-4 py-3 text-underground-muted">
                  {new Date(e.dateTime).toLocaleDateString("es-ES")}
                </td>
                <td className="px-4 py-3">
                  <span className={e.status === "CANCELLED" ? "text-underground-danger" : "text-green-500"}>
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-underground-muted">
                  {e.organizer?.name ?? e.organizer?.email ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/events/${e.id}/edit`} className="text-underground-accent hover:underline mr-2">
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => deleteEvent(e.id)}
                    className="text-underground-danger hover:underline"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {events.length === 0 && (
        <p className="px-4 py-6 text-underground-muted text-center">No hay eventos.</p>
      )}
    </div>
  );
}
