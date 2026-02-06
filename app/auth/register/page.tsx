"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

const MIN_FOLLOWERS = 500;

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [registerAsSeller, setRegisterAsSeller] = useState(false);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [idDocumentNumber, setIdDocumentNumber] = useState("");
  const [idDocumentUrl, setIdDocumentUrl] = useState("");
  const [phone, setPhone] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function getError(err: unknown): string {
    if (typeof err === "string") return err;
    if (err && typeof err === "object" && "error" in err) {
      const e = (err as { error: unknown }).error;
      if (typeof e === "string") return e;
      if (e && typeof e === "object" && typeof (e as Record<string, unknown>).message === "string")
        return (e as { message: string }).message;
    }
    return t("auth.registerError");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    if (registerAsSeller) {
      const err: Record<string, string> = {};
      const fol = parseInt(instagramFollowers, 10);
      if (!instagramHandle.trim()) err.instagramHandle = t("seller.instagramHandle");
      if (Number.isNaN(fol) || fol < MIN_FOLLOWERS) err.instagramFollowers = minFollowersText;
      if (!idDocumentNumber.trim()) err.idDocumentNumber = t("seller.idDocumentNumber");
      if (!termsAccepted) err.terms = t("seller.termsRequired");
      if (Object.keys(err).length > 0) {
        setFieldErrors(err);
        setError(t("auth.registerError"));
        return;
      }
    }

    const body: Record<string, unknown> = {
      email,
      password,
      name: name || undefined,
      registerAsSeller,
    };
    if (registerAsSeller) {
      body.sellerApplication = {
        instagramHandle: instagramHandle.trim(),
        instagramFollowers: parseInt(instagramFollowers, 10) || 0,
        idDocumentNumber: idDocumentNumber.trim(),
        idDocumentUrl: idDocumentUrl.trim() || undefined,
        phone: phone.trim() || undefined,
      };
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const msg = data.error;
      if (typeof msg === "object" && msg !== null && !Array.isArray(msg)) {
        const errs: Record<string, string> = {};
        for (const [k, v] of Object.entries(msg)) {
          errs[k] = Array.isArray(v) ? (v[0] as string) : String(v);
        }
        setFieldErrors(errs);
        setError(t("auth.registerError"));
      } else {
        setError(typeof msg === "string" ? msg : getError(data));
      }
      return;
    }
    if (registerAsSeller) {
      setError("");
      setFieldErrors({});
      router.push("/auth/login?seller=pending");
      router.refresh();
      return;
    }
    router.push("/auth/login");
    router.refresh();
  }

  const minFollowersText = t("seller.minFollowers").replace("{min}", String(MIN_FOLLOWERS));

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold text-underground-fg mb-2">{t("auth.register")}</h1>
      <p className="text-underground-muted text-sm mb-6">
        {t("auth.noAccount")} Elige si quieres registrarte como asistente o como vendedor para publicar eventos.
      </p>

      {/* Toggle Cliente / Vendedor */}
      <div className="flex rounded-lg border border-underground-border bg-underground-card p-1 mb-6" role="group" aria-label="Tipo de cuenta">
        <button
          type="button"
          onClick={() => setRegisterAsSeller(false)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${!registerAsSeller ? "bg-neon-purple text-white" : "text-underground-muted hover:text-underground-fg"}`}
        >
          {t("auth.registerAsClient")}
        </button>
        <button
          type="button"
          onClick={() => setRegisterAsSeller(true)}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${registerAsSeller ? "bg-neon-purple text-white" : "text-underground-muted hover:text-underground-fg"}`}
        >
          {t("auth.registerAsSeller")}
        </button>
      </div>

      {registerAsSeller && (
        <div className="mb-6 p-4 rounded-lg border border-neon-purple/40 bg-neon-purple/5">
          <h2 className="font-semibold text-underground-fg mb-1">{t("seller.title")}</h2>
          <p className="text-underground-muted text-sm mb-3">{t("seller.subtitle")}</p>
          <ul className="text-sm text-underground-muted list-disc list-inside space-y-1">
            <li>{minFollowersText}</li>
            <li>{t("seller.idDocumentNumber")}</li>
            <li>{t("seller.termsAccept")}</li>
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p role="alert" className="text-underground-danger text-sm bg-underground-danger/10 border border-underground-danger/40 rounded-lg px-3 py-2 flex items-center gap-2" aria-live="assertive">
            <span aria-hidden>⚠</span>
            {error}
          </p>
        )}

        <div>
          <label htmlFor="name" className="block text-sm text-underground-muted mb-1">{t("auth.nameOptional")}</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-underground-muted mb-1">{t("auth.email")}</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-underground-muted mb-1">{t("auth.passwordMin")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          />
        </div>

        {registerAsSeller && (
          <>
            <div>
              <label htmlFor="instagramHandle" className="block text-sm text-underground-muted mb-1">{t("seller.instagramHandle")}</label>
              <input
                id="instagramHandle"
                type="text"
                value={instagramHandle}
                onChange={(e) => setInstagramHandle(e.target.value)}
                placeholder={t("seller.instagramHandlePlaceholder")}
                className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
              {fieldErrors.instagramHandle && <p className="text-underground-danger text-xs mt-1">{fieldErrors.instagramHandle}</p>}
            </div>
            <div>
              <label htmlFor="instagramFollowers" className="block text-sm text-underground-muted mb-1">{t("seller.instagramFollowers")}</label>
              <input
                id="instagramFollowers"
                type="number"
                min={MIN_FOLLOWERS}
                value={instagramFollowers}
                onChange={(e) => setInstagramFollowers(e.target.value)}
                className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
              <p className="text-underground-muted text-xs mt-1">{minFollowersText}</p>
              {fieldErrors.instagramFollowers && <p className="text-underground-danger text-xs mt-1">{fieldErrors.instagramFollowers}</p>}
            </div>
            <div>
              <label htmlFor="idDocumentNumber" className="block text-sm text-underground-muted mb-1">{t("seller.idDocumentNumber")}</label>
              <input
                id="idDocumentNumber"
                type="text"
                value={idDocumentNumber}
                onChange={(e) => setIdDocumentNumber(e.target.value)}
                placeholder={t("seller.idDocumentNumberPlaceholder")}
                className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
              {fieldErrors.idDocumentNumber && <p className="text-underground-danger text-xs mt-1">{fieldErrors.idDocumentNumber}</p>}
            </div>
            <div>
              <label htmlFor="idDocumentUrl" className="block text-sm text-underground-muted mb-1">{t("seller.idDocumentUrl")}</label>
              <input
                id="idDocumentUrl"
                type="url"
                value={idDocumentUrl}
                onChange={(e) => setIdDocumentUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm text-underground-muted mb-1">{t("seller.phone")}</label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple"
              />
            </div>
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 rounded border-underground-border text-neon-purple focus:ring-neon-purple"
              />
              <label htmlFor="terms" className="text-sm text-underground-muted">
                {t("seller.termsAccept")}
              </label>
            </div>
            {fieldErrors.terms && <p className="text-underground-danger text-xs">{fieldErrors.terms}</p>}
            {registerAsSeller && (
              <p className="text-neon-cyan/90 text-sm">
                {t("auth.sellerRequiresApproval")}
              </p>
            )}
          </>
        )}

        <button
          type="submit"
          className="w-full bg-neon-purple text-white py-2 rounded-lg font-medium hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2 disabled:opacity-60"
        >
          {t("auth.register")}
        </button>
      </form>
      <p className="mt-4 text-underground-muted text-sm">
        {t("auth.hasAccount")}{" "}
        <Link href="/auth/login" className="text-underground-accent hover:underline">
          {t("auth.login")}
        </Link>
      </p>
    </div>
  );
}
