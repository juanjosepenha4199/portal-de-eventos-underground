/**
 * Cliente EBANX para pagos con Nequi (Colombia).
 * Documentación: https://docs.ebanx.com/docs/payments/guides/accept-payments/api/colombia/nequi/
 */

const EBANX_SANDBOX = "https://sandbox.ebanx.com/ws";
const EBANX_PRODUCTION = "https://api.ebanx.com/ws";

export type EbanxNequiPaymentParams = {
  integrationKey: string;
  merchantPaymentCode: string;
  amountTotal: number; // en COP (ej. 25000)
  currencyCode: "COP";
  customerName: string;
  customerEmail: string;
  customerPhone?: string; // recomendado para push en Nequi
  redirectUrl: string;
};

export type EbanxNequiPaymentResponse = {
  success: boolean;
  redirectUrl?: string;
  qrCodeValue?: string;
  hash?: string;
  error?: string;
};

export async function createNequiPayment(
  params: EbanxNequiPaymentParams,
  useSandbox: boolean = true
): Promise<EbanxNequiPaymentResponse> {
  const baseUrl = useSandbox ? EBANX_SANDBOX : EBANX_PRODUCTION;
  const res = await fetch(`${baseUrl}/direct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      integration_key: params.integrationKey,
      payment: {
        payment_type_code: "nequi",
        country: "co",
        amount_total: params.amountTotal,
        currency_code: params.currencyCode,
        merchant_payment_code: params.merchantPaymentCode,
        name: params.customerName,
        email: params.customerEmail,
        phone_number: params.customerPhone || undefined,
        redirect_url: params.redirectUrl,
      },
    }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      error: data?.status_message || data?.message || "Error al crear el pago",
    };
  }

  const payment = data.payment;
  if (!payment) {
    return { success: false, error: "Respuesta inválida de EBANX" };
  }

  return {
    success: data.status === "SUCCESS",
    redirectUrl: payment.redirect_url,
    qrCodeValue: payment.ewallet?.qr_code_value,
    hash: payment.hash,
    error: data.status !== "SUCCESS" ? data.status_message : undefined,
  };
}
