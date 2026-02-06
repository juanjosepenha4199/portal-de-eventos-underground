"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name: name || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : t("auth.registerError"));
      return;
    }
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold text-underground-fg mb-6">{t("auth.register")}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-underground-danger text-sm bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
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
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-underground-accent"
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
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-underground-accent"
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
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-underground-accent text-white py-2 rounded-lg font-medium hover:opacity-90"
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
