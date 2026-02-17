"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

const CATEGORY_KEYS: { value: string; key: string }[] = [
  { value: "", key: "filters.all" },
  { value: "música", key: "filters.music" },
  { value: "arte", key: "filters.art" },
  { value: "cultura", key: "filters.culture" },
  { value: "teatro", key: "filters.theater" },
  { value: "cine", key: "filters.cinema" },
  { value: "literatura", key: "filters.literature" },
  { value: "festival", key: "filters.festival" },
  { value: "otro", key: "filters.other" },
];

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category") ?? "";
  const { t } = useTranslation();

  function selectCategory(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("category", value);
    else params.delete("category");
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <section className="mb-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h2 className="text-lg font-semibold text-underground-fg">{t("filters.browseCategories")}</h2>
        <Link
          href="/"
          className="text-underground-accent hover:underline text-sm font-medium"
        >
          {t("filters.viewAll")}
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_KEYS.map(({ value, key }) => (
          <button
            key={value || "all"}
            type="button"
            onClick={() => selectCategory(value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition border focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2 ${
              category === value
                ? "bg-neon-purple/20 border-neon-purple text-underground-fg shadow-neon-sm"
                : "bg-underground-card border-underground-border text-underground-muted hover:text-underground-fg hover:border-underground-muted"
            }`}
          >
            {t(key)}
          </button>
        ))}
      </div>
    </section>
  );
}
