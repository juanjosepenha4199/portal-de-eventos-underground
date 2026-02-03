"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function FavoriteButton({
  eventId,
  initialChecked,
}: {
  eventId: string;
  initialChecked: boolean;
}) {
  const router = useRouter();
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

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded text-sm font-medium border transition ${
        checked
          ? "bg-underground-accent/20 border-underground-accent text-underground-accent"
          : "border-underground-border text-zinc-400 hover:border-underground-accent/50 hover:text-white"
      }`}
    >
      {checked ? "Guardado" : "Guardar"}
    </button>
  );
}
