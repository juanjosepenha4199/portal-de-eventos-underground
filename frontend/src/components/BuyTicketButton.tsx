"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

type BuyTicketButtonProps = {
  eventId: string;
  hasTicket: boolean;
  isPaidEvent: boolean;
  isLoggedIn: boolean;
};

export function BuyTicketButton({
  eventId,
  hasTicket,
  isPaidEvent,
  isLoggedIn,
}: BuyTicketButtonProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${eventId}/checkout`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("ticket.checkoutError"));
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError(t("ticket.checkoutError"));
    } finally {
      setLoading(false);
    }
  }

  if (!isPaidEvent) {
    return (
      <p className="text-underground-muted text-sm mt-2">
        {t("ticket.freeEvent")}
      </p>
    );
  }

  if (!isLoggedIn) {
    return (
      <Link
        href={`/auth/login?callbackUrl=${encodeURIComponent(`/events/${eventId}`)}`}
        className="inline-flex items-center bg-neon-purple text-white font-medium px-4 py-2 rounded-lg hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
      >
        {t("ticket.loginToBuy")}
      </Link>
    );
  }

  if (hasTicket) {
    return (
      <span className="inline-flex items-center gap-2 bg-neon-purple/20 text-neon-purple border border-neon-purple/50 px-4 py-2 rounded-lg text-sm font-medium">
        <span aria-hidden>✓</span>
        {t("ticket.bought")}
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleBuy}
        disabled={loading}
        aria-busy={loading}
        className="inline-flex items-center justify-center bg-neon-purple text-white font-medium px-5 py-2.5 rounded-lg hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2 disabled:opacity-70"
      >
        {loading ? "…" : t("ticket.buy")}
      </button>
      {error && (
        <p role="alert" className="text-underground-danger text-sm">
          {error}
        </p>
      )}
    </div>
  );
}
