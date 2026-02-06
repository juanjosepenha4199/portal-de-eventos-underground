"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function CreateEventLink() {
  const { t } = useTranslation();
  return (
    <p className="text-center text-underground-muted">
      <Link href="/events/new" className="text-neon-purple hover:text-neon-magenta hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2 rounded">
        {t("home.createEvent")}
      </Link>
    </p>
  );
}
