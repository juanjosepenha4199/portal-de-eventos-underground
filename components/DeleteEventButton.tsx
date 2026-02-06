"use client";

import { useTranslation } from "@/lib/i18n/context";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const { t } = useTranslation();

  async function handleDelete() {
    if (!confirm(t("event.deleteConfirm"))) return;
    const res = await fetch(`/api/events/${eventId}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/events";
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data.error ?? t("event.deleteError"));
    }
  }
  return (
    <button
      type="button"
      onClick={handleDelete}
      className="bg-underground-danger/20 text-underground-danger border border-underground-danger/50 px-4 py-2 rounded text-sm font-medium hover:bg-underground-danger/30"
    >
      {t("event.delete")}
    </button>
  );
}
