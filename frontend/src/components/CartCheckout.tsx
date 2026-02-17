"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { useTranslation } from "@/lib/i18n/context";
import { PayPalCheckoutModal } from "@/components/PayPalCheckoutModal";
import type { CartItem } from "@/lib/cart-context";

function formatPayPalTotal(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(cents / 100);
}

export function CartCheckout({
  items,
  totalCents,
}: {
  items: CartItem[];
  totalCents: number;
}) {
  const { t } = useTranslation();
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState<"stripe" | null>(null);
  const [error, setError] = useState("");
  const [paypalOpen, setPaypalOpen] = useState(false);

  async function payWithStripe() {
    setError("");
    setLoading("stripe");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ eventId: i.eventId, title: i.title, priceCents: i.priceCents })),
          method: "stripe",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? t("ticket.checkoutError"));
        return;
      }
      if (data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      }
      setError(t("ticket.checkoutError"));
    } finally {
      setLoading(null);
    }
  }

  async function payWithPayPal() {
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ eventId: i.eventId, title: i.title, priceCents: i.priceCents })),
        method: "paypal",
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? t("ticket.checkoutError"));
      return;
    }
    if (data.success) {
      clearCart();
      setPaypalOpen(false);
      router.push("/events/tickets?paypal=1");
      router.refresh();
    } else {
      setError(t("ticket.checkoutError"));
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <p role="alert" className="text-underground-danger text-sm">
          {error}
        </p>
      )}

      {/* Botón PayPal (estilo oficial) */}
      <button
        type="button"
        onClick={() => setPaypalOpen(true)}
        disabled={!!loading}
        className="w-full py-3.5 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-md"
        style={{ backgroundColor: "#003087" }}
      >
        <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden>
          <path fill="currentColor" d="M7.076 21.337H2.47a.562.562 0 0 1-.553-.646L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.54 0 4.578.529 5.998 1.527 1.42.997 2.317 2.409 2.317 4.267 0 1.858-.897 3.27-2.317 4.268-1.42.998-3.458 1.527-5.998 1.527H9.384l-.598 3.628-.004.023-.013.076-.002.012-.01.06-.003.02-.01.053-.003.015-.008.04-.003.012-.007.034-.002.01-.006.028-.002.007-.005.02-.002.006-.004.014-.002.005-.002.008-.001.003-.001.004h-.001l-.784 4.758a.562.562 0 0 1-.553.477z" />
        </svg>
        {t("cart.payWithPayPal")}
      </button>

      <button
        type="button"
        onClick={payWithStripe}
        disabled={!!loading}
        className="w-full py-3 rounded-lg font-medium border-2 border-neon-purple text-neon-purple hover:bg-neon-purple/10 transition disabled:opacity-50"
      >
        {loading === "stripe" ? "…" : t("cart.payWithCard")}
      </button>

      <PayPalCheckoutModal
        isOpen={paypalOpen}
        onClose={() => setPaypalOpen(false)}
        totalFormatted={formatPayPalTotal(totalCents)}
        onConfirm={payWithPayPal}
      />
    </div>
  );
}
