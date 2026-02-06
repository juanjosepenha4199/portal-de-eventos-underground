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
      <form onSubmit={handleSubmit} className="space-y-4">
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
