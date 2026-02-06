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
    ? "bg-underground-accent/20 border-underground-accent text-underground-accent"
    : "border-underground-border bg-underground-card text-underground-muted hover:border-underground-muted hover:text-underground-fg";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggle}
        disabled={loading}
        className={`${baseClass} ${checkedClass} p-2.5`}
        aria-label={checked ? t("favorite.remove") : t("favorite.add")}
      >
        <BookmarkIcon filled={checked} className="w-5 h-5" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`${baseClass} ${checkedClass} px-3 py-1.5 text-sm font-medium`}
    >
      {checked ? t("favorite.saved") : t("favorite.save")}
    </button>
  );
}
