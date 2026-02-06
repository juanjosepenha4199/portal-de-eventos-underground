"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

function BookmarkIcon({ filled, className }: { filled: boolean; className?: string }) {
  return (
    <svg className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  );
}

export function FavoriteButton({
  eventId,
  initialChecked,
  variant = "text",
}: {
  eventId: string;
  initialChecked: boolean;
  variant?: "text" | "icon";
}) {
  const router = useRouter();
  const { t } = useTranslation();
  const [checked, setChecked] = useState(initialChecked);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    try {
      if (checked) {
        await fetch(`/api/favorites/${eventId}`, { method: "DELETE" });
        setChecked(false);
      } else {
        await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventId }),
        });
        setChecked(true);
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  const baseClass = "rounded-lg border transition inline-flex items-center justify-center";
  const checkedClass = checked
    ? "bg-neon-purple/20 border-neon-purple text-neon-purple"
    : "border-underground-border bg-underground-card text-underground-muted hover:border-neon-purple/50 hover:text-underground-fg";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        aria-busy={loading}
        aria-label={loading ? (checked ? t("favorite.removing") : t("favorite.adding")) : (checked ? t("favorite.remove") : t("favorite.add"))}
        className={`${baseClass} ${checkedClass} p-2.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2 disabled:opacity-70`}
      >
        {loading ? <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden /> : <BookmarkIcon filled={checked} className="w-5 h-5" />}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      aria-busy={loading}
      className={`${baseClass} ${checkedClass} px-3 py-1.5 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2 disabled:opacity-70`}
    >
      {loading ? t("favorite.saving") : (checked ? t("favorite.saved") : t("favorite.save"))}
    </button>
  );
}
