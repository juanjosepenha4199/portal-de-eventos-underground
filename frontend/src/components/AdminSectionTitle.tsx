"use client";

import { useTranslation } from "@/lib/i18n/context";

export function AdminSectionTitle({ translationKey }: { translationKey: string }) {
  const { t } = useTranslation();
  return <h2 className="text-xl font-semibold text-underground-fg mb-4">{t(translationKey)}</h2>;
}
