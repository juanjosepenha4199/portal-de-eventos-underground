import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe, getEventAmountCents } from "@/lib/stripe";

const COP_TO_EUR_CENTS = 100 / 4000;

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Debes iniciar sesión para comprar una entrada" }, { status: 401 });
  }

  const { id: eventId } = await params;
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { id: true, title: true, description: true, image: true, price: true, priceCents: true, status: true },
  });

  if (!event) {
    return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });
  }
  if (event.status === "CANCELLED") {
    return NextResponse.json({ error: "Este evento está cancelado" }, { status: 400 });
  }

  const amountCents = getEventAmountCents(event.price, event.priceCents);
  if (amountCents <= 0) {
    return NextResponse.json({ error: "Este evento es gratuito; no requiere compra de entrada" }, { status: 400 });
  }

  const existing = await prisma.ticket.findUnique({
    where: { userId_eventId: { userId: session.user.id, eventId } },
  });
  if (existing?.status === "PAID") {
    return NextResponse.json({ error: "Ya tienes una entrada para este evento" }, { status: 400 });
  }

  if (!stripe) {
    return NextResponse.json(
      { error: "Pasarela de pagos no configurada" },
      { status: 503 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: Math.max(1, Math.round(amountCents * COP_TO_EUR_CENTS)),
            product_data: {
              name: event.title,
              description: event.description?.slice(0, 500) ?? undefined,
              images: event.image ? [event.image] : undefined,
            },
          },
        },
      ],
      success_url: `${baseUrl}/events/${eventId}?purchased=1`,
      cancel_url: `${baseUrl}/events/${eventId}`,
      client_reference_id: session.user.id,
      metadata: {
        eventId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "No se pudo crear la sesión de pago" },
      { status: 500 }
    );
  }
}
