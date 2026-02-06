"use client";

import Link from "next/link";
import type { Event } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/context";

type EventWithOrganizer = Event & {
  organizer: { name: string | null; email: string } | null;
};

export function AdminEvents({ events }: { events: EventWithOrganizer[] }) {
  const { t } = useTranslation();

  async function deleteEvent(id: string) {
    if (!confirm(t("event.deleteConfirm"))) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      window.location.reload();
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? t("event.deleteError"));
    }
  }

  return (
    <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-underground-bg text-underground-muted">
            <tr>
              <th className="px-4 py-3">{t("form.title")}</th>
              <th className="px-4 py-3">{t("form.category")}</th>
              <th className="px-4 py-3">{t("admin.date")}</th>
              <th className="px-4 py-3">{t("form.status")}</th>
              <th className="px-4 py-3">{t("event.organizer")}</th>
              <th className="px-4 py-3">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="text-underground-fg divide-y divide-underground-border">
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
        <p className="px-4 py-6 text-underground-muted text-center">{t("admin.noEvents")}</p>
      )}
    </div>
  );
}
