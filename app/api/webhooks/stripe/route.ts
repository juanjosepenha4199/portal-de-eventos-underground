import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!webhookSecret || !stripe) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: `Webhook signature failed: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error("Webhook missing metadata userId", session.id);
      return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
    }

    const eventIdsRaw = session.metadata?.eventIds;
    const amountsRaw = session.metadata?.amounts;
    const currency = (session.currency ?? "eur").toLowerCase();
    const amountTotal = session.amount_total ?? 0;

    let eventIds: string[];
    let amounts: number[];
    if (eventIdsRaw) {
      try {
        eventIds = JSON.parse(eventIdsRaw) as string[];
        amounts = amountsRaw ? (JSON.parse(amountsRaw) as number[]) : eventIds.map(() => Math.floor(amountTotal / eventIds.length));
      } catch {
        return NextResponse.json({ error: "Invalid metadata" }, { status: 400 });
      }
    } else {
      const eventId = session.metadata?.eventId;
      if (!eventId) return NextResponse.json({ error: "Missing metadata" }, { status: 400 });
      eventIds = [eventId];
      amounts = [amountTotal];
    }

    try {
      for (let i = 0; i < eventIds.length; i++) {
        const eventId = eventIds[i];
        const amountCents = amounts[i] ?? amountTotal;
        await prisma.ticket.upsert({
          where: { userId_eventId: { userId, eventId } },
          create: {
            userId,
            eventId,
            amountCents,
            currency,
            stripeSessionId: session.id,
            status: "PAID",
          },
          update: { amountCents, currency, stripeSessionId: session.id, status: "PAID" },
        });
      }
    } catch (e) {
      console.error("Error saving tickets after webhook:", e);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
