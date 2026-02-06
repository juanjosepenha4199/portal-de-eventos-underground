"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/lib/cart-context";
import { useTranslation } from "@/lib/i18n/context";
import { PageTitle } from "@/components/PageTitle";
import { CartCheckout } from "@/components/CartCheckout";

function formatPrice(cents: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(cents);
}

export default function CartPage() {
  const { data: session, status } = useSession();
  const { items, removeItem, totalCents } = useCart();
  const { t } = useTranslation();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageTitle translationKey="cart.title" />
      {items.length === 0 ? (
        <div className="rounded-xl border border-underground-border bg-underground-card p-8 text-center">
          <p className="text-underground-muted mb-4">{t("cart.empty")}</p>
          <Link
            href="/events"
            className="inline-block bg-neon-purple text-white px-4 py-2 rounded-lg font-medium hover:bg-neon-magenta transition"
          >
            Ver eventos
          </Link>
        </div>
      ) : (
        <>
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.eventId}
                className="flex gap-4 rounded-xl border border-underground-border bg-underground-card p-4"
              >
                <div className="w-20 h-20 flex-shrink-0 bg-underground-border rounded-lg overflow-hidden">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="w-full h-full flex items-center justify-center text-underground-muted text-xs">
                      —
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/events/${item.eventId}`}
                    className="font-medium text-underground-fg hover:text-neon-purple truncate block"
                  >
                    {item.title}
                  </Link>
                  <p className="text-neon-purple font-medium text-sm mt-1">
                    {item.price}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.eventId)}
                  className="text-underground-muted hover:text-underground-danger text-sm p-2"
                  aria-label={t("cart.remove")}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <div className="rounded-xl border border-underground-border bg-underground-card p-6">
            <div className="flex justify-between items-center text-lg font-semibold text-underground-fg mb-4">
              <span>{t("cart.total")}</span>
              <span className="text-neon-purple">{formatPrice(totalCents)}</span>
            </div>
            {status === "loading" ? (
              <p className="text-underground-muted text-sm">Cargando…</p>
            ) : !session ? (
              <Link
                href={`/auth/login?callbackUrl=${encodeURIComponent("/cart")}`}
                className="block w-full text-center bg-neon-purple text-white py-3 rounded-lg font-medium hover:bg-neon-magenta transition"
              >
                {t("cart.loginToCheckout")}
              </Link>
            ) : (
              <CartCheckout items={items} totalCents={totalCents} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
