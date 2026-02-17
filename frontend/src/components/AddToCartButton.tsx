"use client";

import { useCart } from "@/lib/cart-context";
import { useTranslation } from "@/lib/i18n/context";

type AddToCartButtonProps = {
  eventId: string;
  title: string;
  price: string;
  priceCents: number;
  image: string | null;
  variant?: "button" | "icon";
};

export function AddToCartButton({
  eventId,
  title,
  price,
  priceCents,
  image,
  variant = "button",
}: AddToCartButtonProps) {
  const { addItem, hasItem } = useCart();
  const { t } = useTranslation();
  const inCart = hasItem(eventId);

  function handleAdd() {
    addItem({ eventId, title, price, priceCents, image });
  }

  if (inCart) {
    return (
      <span className="text-neon-purple/80 text-sm font-medium">
        ✓ {t("cart.addToCart")}
      </span>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleAdd}
        className="p-2 rounded-lg border border-underground-border text-underground-muted hover:border-neon-purple hover:text-neon-purple transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2"
        aria-label={t("cart.addToCart")}
        title={t("cart.addToCart")}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="inline-flex items-center gap-2 border border-neon-purple text-neon-purple font-medium px-4 py-2 rounded-lg hover:bg-neon-purple/10 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
    >
      <span aria-hidden>🛒</span>
      {t("cart.addToCart")}
    </button>
  );
}
