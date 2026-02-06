"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function EventsPageHeader({ showCreateButton = false }: { showCreateButton?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-underground-fg">{t("events.title")}</h1>
      {showCreateButton && (
        <Link
          href="/events/new"
          className="bg-underground-accent text-white px-4 py-2 rounded-lg font-medium hover:opacity-90"
        >
          {t("events.createEvent")}
        </Link>
      )}
    </div>
  );
}
