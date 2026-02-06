"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function CreateEventLink() {
  const { t } = useTranslation();
  return (
    <p className="text-center text-underground-muted">
      <Link href="/events/new" className="text-underground-accent hover:underline">
        {t("home.createEvent")}
      </Link>
    </p>
  );
}
