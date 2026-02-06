import Stripe from "stripe";

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-11-20.acacia",
      typescript: true,
    })
  : (null as unknown as Stripe);

/** Parsea el precio del evento a céntimos para Stripe. "FREE", "25", "25.00", "€25" -> 0 o 2500 */
export function parsePriceToCents(price: string | null | undefined): number | null {
  if (!price || typeof price !== "string") return null;
  const trimmed = price.trim().toUpperCase();
  if (trimmed === "" || trimmed === "FREE" || trimmed === "GRATIS" || trimmed === "GRATUITO") return 0;
  const numStr = price.replace(/[^\d.,]/g, "").replace(",", ".");
  const num = parseFloat(numStr);
  if (Number.isNaN(num) || num < 0) return null;
  return Math.round(num * 100); // euros -> céntimos
}

export function isPaidEvent(
  price: string | null | undefined,
  priceCents?: number | null
): boolean {
  if (priceCents != null && priceCents > 0) return true;
  const cents = parsePriceToCents(price);
  return cents != null && cents > 0;
}

/** Valor del evento en centavos (para carrito/pago). Prioriza priceCents. */
export function getEventAmountCents(
  price: string | null | undefined,
  priceCents?: number | null
): number {
  if (priceCents != null && priceCents >= 0) return priceCents;
  const parsed = parsePriceToCents(price);
  return parsed != null ? parsed : 0;
}
