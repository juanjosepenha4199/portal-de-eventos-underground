import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const EBANX_QUERY_URL = process.env.EBANX_MODE === "production"
  ? "https://api.ebanx.com/ws/query"
  : "https://sandbox.ebanx.com/ws/query";

/**
 * Webhook de EBANX: notificación de cambio de estado del pago.
 * Configura esta URL en el Dashboard EBANX: Account Settings > Integrations > Notification URL
 * Ej: https://tudominio.com/api/webhooks/ebanx
 *
 * EBANX envía operation=payment_status_change&notification_type=update&hash_codes=HASH
 * Respondemos 200 enseguida y procesamos en segundo plano (query + crear tickets).
 */
export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let hashCodes: string[] = [];
    let notificationType = "";
    let operation = "";

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await request.text();
      const params = new URLSearchParams(text);
      operation = params.get("operation") || "";
      notificationType = params.get("notification_type") || "";
      const hashParam = params.get("hash_codes") || "";
      hashCodes = hashParam.split(",").map((h) => h.trim()).filter(Boolean);
    } else {
      const body = await request.json().catch(() => ({}));
      operation = body.operation || "";
      notificationType = body.notification_type || "";
      const h = body.hash_codes;
      hashCodes = Array.isArray(h) ? h : (typeof h === "string" ? h.split(",").map((s) => s.trim()) : []);
    }

    // Responder 200 de inmediato para no provocar reintentos
    if (operation !== "payment_status_change" || notificationType !== "update" || hashCodes.length === 0) {
      return NextResponse.json({ received: true });
    }

    const integrationKey = process.env.EBANX_INTEGRATION_KEY;
    if (!integrationKey) {
      return NextResponse.json({ received: true });
    }

    // Consultar cada pago y si está confirmado (CO), crear tickets
    for (const hash of hashCodes) {
      try {
        const queryRes = await fetch(EBANX_QUERY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ integration_key: integrationKey, hash }),
        });
        const queryData = await queryRes.json().catch(() => ({}));
        const payment = queryData.payment;
        if (!payment || payment.status !== "CO") continue;

        const merchantCode = payment.merchant_payment_code;
        const pending = await prisma.pendingNequiPayment.findUnique({
          where: { merchantPaymentCode: merchantCode },
        });
        if (!pending) continue;

        const items: { eventId: string; priceCents: number }[] = JSON.parse(pending.itemsJson);
        for (const item of items) {
          await prisma.ticket.upsert({
            where: { userId_eventId: { userId: pending.userId, eventId: item.eventId } },
            create: {
              userId: pending.userId,
              eventId: item.eventId,
              amountCents: item.priceCents,
              currency: "cop",
              status: "PAID",
            },
            update: { amountCents: item.priceCents, currency: "cop", status: "PAID" },
          });
        }
        await prisma.pendingNequiPayment.delete({ where: { id: pending.id } });
      } catch (e) {
        console.error("EBANX webhook process hash error:", hash, e);
      }
    }

    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("EBANX webhook error:", e);
    return NextResponse.json({ received: true });
  }
}
