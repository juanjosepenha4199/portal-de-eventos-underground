"use client";

import { useTranslation } from "@/lib/i18n/context";

export function PageTitle({ translationKey }: { translationKey: string }) {
  const { t } = useTranslation();
  return <h1 className="text-2xl font-bold text-underground-fg mb-6">{t(translationKey)}</h1>;
}
