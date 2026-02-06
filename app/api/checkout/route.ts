import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

/** Convierte precio en COP a centavos EUR para Stripe (demo: 4000 COP ≈ 1 EUR) */
const COP_TO_EUR_CENTS = 100 / 4000; // 25000 COP -> 625 cents

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión para pagar" }, { status: 401 });
  }

  let body: { items?: { eventId: string; title: string; priceCents: number }[]; method?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const items = body.items;
  const method = body.method;

  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
  }

  if (method === "paypal") {
    // Simulación PayPal (solo front): crea entradas como PAID
    try {
      for (const item of items) {
        const amountCents = item.priceCents ?? 0;
        await prisma.ticket.upsert({
          where: { userId_eventId: { userId: session.user.id, eventId: item.eventId } },
          create: {
            userId: session.user.id,
            eventId: item.eventId,
            amountCents,
            currency: "usd",
            status: "PAID",
          },
          update: { amountCents, currency: "usd", status: "PAID" },
        });
      }
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error("PayPal checkout error:", e);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }
  }

  if (method === "nequi") {
    const ebanxKey = process.env.EBANX_INTEGRATION_KEY;
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    if (ebanxKey) {
      // Nequi real vía EBANX
      const { createNequiPayment } = await import("@/lib/ebanx");
      const totalCents = items.reduce((s, i) => s + (i.priceCents ?? 0), 0);
      const merchantPaymentCode = `nequi-${session.user.id}-${Date.now()}`;
      const result = await createNequiPayment(
        {
          integrationKey: ebanxKey,
          merchantPaymentCode,
          amountTotal: totalCents, // En COP (ej. 25000 = 25.000 COP)
          currencyCode: "COP",
          customerName: session.user.name || session.user.email || "Cliente",
          customerEmail: session.user.email || "",
          redirectUrl: `${baseUrl}/events/tickets?nequi=1`,
        },
        process.env.EBANX_MODE !== "production"
      );
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Error al crear pago Nequi" }, { status: 500 });
      }
      await prisma.pendingNequiPayment.create({
        data: {
          merchantPaymentCode,
          userId: session.user.id,
          itemsJson: JSON.stringify(items.map((i) => ({ eventId: i.eventId, priceCents: i.priceCents ?? 0 }))),
          totalCents,
        },
      });
      return NextResponse.json({
        success: true,
        nequiReal: true,
        redirectUrl: result.redirectUrl,
        qrCodeValue: result.qrCodeValue,
      });
    }

    // Sin EBANX: simulación (MVP)
    try {
      for (const item of items) {
        const amountCents = item.priceCents ?? 0;
        await prisma.ticket.upsert({
          where: { userId_eventId: { userId: session.user.id, eventId: item.eventId } },
          create: {
            userId: session.user.id,
            eventId: item.eventId,
            amountCents,
            currency: "cop",
            status: "PAID",
          },
          update: { amountCents, currency: "cop", status: "PAID" },
        });
      }
      return NextResponse.json({ success: true });
    } catch (e) {
      console.error("Nequi checkout error:", e);
      return NextResponse.json({ error: "Error al procesar el pago" }, { status: 500 });
    }
  }

  if (method === "stripe" && stripe) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const lineItems = items.map((item) => {
      const amountCents = item.priceCents ?? 0;
      const amountStripe = Math.max(1, Math.round(amountCents * COP_TO_EUR_CENTS));
      return {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: amountStripe,
          product_data: { name: item.title },
        },
      };
    });
    const totalCents = items.reduce((s, i) => s + (i.priceCents ?? 0), 0);
    const totalStripe = Math.max(1, Math.round(totalCents * COP_TO_EUR_CENTS));

    try {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: lineItems,
        success_url: `${baseUrl}/events/tickets?stripe=1`,
        cancel_url: `${baseUrl}/cart`,
        client_reference_id: session.user.id,
        metadata: {
          userId: session.user.id,
          eventIds: JSON.stringify(items.map((i) => i.eventId)),
          amounts: JSON.stringify(items.map((i) => i.priceCents ?? 0)),
        },
      });
      return NextResponse.json({ url: checkoutSession.url });
    } catch (err) {
      console.error("Stripe checkout error:", err);
      return NextResponse.json({ error: "No se pudo crear la sesión de pago" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Método de pago no válido" }, { status: 400 });
}
