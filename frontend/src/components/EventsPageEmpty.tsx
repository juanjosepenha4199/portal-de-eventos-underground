"use client";

import { useTranslation } from "@/lib/i18n/context";

export function EventsPageEmpty({ messageKey }: { messageKey: string }) {
  const { t } = useTranslation();
  return <p className="text-underground-muted py-8 text-center">{t(messageKey)}</p>;
}
