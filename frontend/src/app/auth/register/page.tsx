"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl: "/" })}
        className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-underground-border rounded-lg px-4 py-2.5 font-medium hover:bg-gray-50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2 mb-6"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {t("auth.registerWithGoogle")}
      </button>
      <p className="text-center text-underground-muted text-sm mb-6">{t("auth.orDivider")}</p>

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
