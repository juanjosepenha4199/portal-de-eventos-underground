import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions, prisma, stripe } from "@portal/backend";

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

  if (method === "stripe") {
    if (!stripe) {
      return NextResponse.json({ error: "Pagos con tarjeta no disponibles" }, { status: 503 });
    }
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
