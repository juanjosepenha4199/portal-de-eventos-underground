"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/i18n/context";

const PAYPAL_BLUE = "#003087";

type PayPalCheckoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  totalFormatted: string;
  onConfirm: () => Promise<void>;
};

export function PayPalCheckoutModal({
  isOpen,
  onClose,
  totalFormatted,
  onConfirm,
}: PayPalCheckoutModalProps) {
  const { t } = useTranslation();
  const [step, setStep] = useState<"login" | "review">("login");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  async function handlePay() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="paypal-modal-title">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden text-gray-900">
        {/* Header estilo PayPal */}
        <div className="p-5 border-b border-gray-200" style={{ backgroundColor: PAYPAL_BLUE }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-8 h-8" aria-hidden>
                <path fill="#fff" d="M7.076 21.337H2.47a.562.562 0 0 1-.553-.646L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.54 0 4.578.529 5.998 1.527 1.42.997 2.317 2.409 2.317 4.267 0 1.858-.897 3.27-2.317 4.268-1.42.998-3.458 1.527-5.998 1.527H9.384l-.598 3.628-.004.023-.013.076-.002.012-.01.06-.003.02-.01.053-.003.015-.008.04-.003.012-.007.034-.002.01-.006.028-.002.007-.005.02-.002.006-.004.014-.002.005-.002.008-.001.003-.001.004h-.001l-.784 4.758a.562.562 0 0 1-.553.477z" />
                <path fill="#fff" d="M23.472 7.895c-.745-1.057-2.158-1.586-4.014-1.586H9.384l-.598 3.628-.004.023-.013.076-.002.012-.01.06-.003.02-.01.053-.003.015-.008.04-.003.012-.007.034-.002.01-.006.028-.002.007-.005.02-.002.006-.004.014-.002.005-.002.008-.001.003-.001.004h-.001l-.784 4.758a.562.562 0 0 1-.553.477H2.47a.562.562 0 0 1-.553-.646L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.54 0 4.578.529 5.998 1.527 1.42.997 2.317 2.409 2.317 4.267 0 .752-.145 1.448-.435 2.086 1.263.248 2.297.848 3.055 1.77.745.906 1.123 2.04 1.123 3.368 0 1.328-.378 2.462-1.123 3.368-.758.922-1.792 1.522-3.055 1.77.29.638.435 1.334.435 2.086 0 1.858-.897 3.27-2.317 4.268-1.42.998-3.458 1.527-5.998 1.527H9.384l-.598 3.628a.562.562 0 0 1-.553.477H4.778l-.784 4.758a.562.562 0 0 1-.553.477H.641a.562.562 0 0 1-.553-.646L2.11 21.099c.082-.518.53-.9 1.054-.9h4.606c.266 0 .49.194.538.455l.784-4.758h3.055a.562.562 0 0 0 .553-.477l.598-3.628h7.46c2.54 0 4.578-.529 5.998-1.527 1.42-.998 2.317-2.41 2.317-4.267 0-.752-.145-1.448-.435-2.086 1.263-.248 2.297-.848 3.055-1.77.745-.906 1.123-2.04 1.123-3.368 0-1.328.378-2.462 1.123-3.368z" />
              </svg>
              <span className="text-white font-semibold text-lg">PayPal</span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/90 hover:text-white p-1 rounded"
              aria-label={t("cart.close")}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <h2 id="paypal-modal-title" className="text-xl font-semibold text-gray-800 mb-4">
            {step === "login" ? t("paypal.logIn") : t("paypal.reviewPay")}
          </h2>

          {step === "login" ? (
            <>
              <p className="text-gray-600 text-sm mb-4">{t("paypal.loginSubtext")}</p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="paypal-email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("paypal.email")}
                  </label>
                  <input
                    id="paypal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:ring-[#009cde] text-gray-900"
                  />
                </div>
                <div>
                  <label htmlFor="paypal-password" className="block text-sm font-medium text-gray-700 mb-1">
                    {t("paypal.password")}
                  </label>
                  <input
                    id="paypal-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 text-gray-900"
                  />
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("review")}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: PAYPAL_BLUE }}
                >
                  {t("paypal.next")}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t("form.cancel")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-center text-gray-800">
                  <span className="font-medium">{t("cart.total")}</span>
                  <span className="text-lg font-bold" style={{ color: PAYPAL_BLUE }}>{totalFormatted}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">{t("paypal.securePay")}</p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg font-semibold text-white transition hover:opacity-90 disabled:opacity-70"
                  style={{ backgroundColor: PAYPAL_BLUE }}
                >
                  {loading ? t("paypal.processing") : t("paypal.payNow")}
                </button>
                <button
                  type="button"
                  onClick={() => setStep("login")}
                  className="px-4 py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  {t("paypal.back")}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">{t("paypal.demoNotice")}</p>
        </div>
      </div>
    </div>
  );
}
