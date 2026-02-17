"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (res?.error) {
      setError(t("auth.loginError"));
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  const sellerPending = searchParams.get("seller") === "pending";

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold text-underground-fg mb-6">{t("auth.login")}</h1>
      {sellerPending && (
        <p className="mb-4 text-sm text-neon-cyan bg-neon-cyan/10 border border-neon-cyan/40 rounded-lg px-3 py-2">
          {t("auth.sellerRequiresApproval")}
        </p>
      )}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/", redirect: true })}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 border border-underground-border rounded-lg px-4 py-2.5 font-medium hover:bg-gray-50 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
        >
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t("auth.loginWithGoogle")}
        </button>
        <p className="text-center text-underground-muted text-sm">{t("auth.orDivider")}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        {error && (
          <p role="alert" className="text-underground-danger text-sm bg-underground-danger/10 border border-underground-danger/40 rounded-lg px-3 py-2 flex items-center gap-2" aria-live="assertive">
            <span aria-hidden>⚠</span>
            {error}
          </p>
        )}
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
          <label htmlFor="password" className="block text-sm text-underground-muted mb-1">{t("auth.password")}</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-neon-purple text-white py-2 rounded-lg font-medium hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2 disabled:opacity-60"
        >
          {t("auth.login")}
        </button>
      </form>
      <p className="mt-4 text-underground-muted text-sm">
        {t("auth.noAccount")}{" "}
        <Link href="/auth/register" className="text-underground-accent hover:underline">
          {t("auth.register")}
        </Link>
      </p>
    </div>
  );
}
