"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      setError("Email o contraseña incorrectos");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold text-white mb-6">Entrar</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-underground-danger text-sm bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {error}
          </p>
        )}
        <div>
          <label htmlFor="email" className="block text-sm text-zinc-400 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm text-zinc-400 mb-1">Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-underground-accent text-white py-2 rounded font-medium hover:bg-purple-600"
        >
          Entrar
        </button>
      </form>
      <p className="mt-4 text-underground-muted text-sm">
        ¿No tienes cuenta?{" "}
        <Link href="/auth/register" className="text-underground-accent hover:underline">
          Registrarse
        </Link>
      </p>
    </div>
  );
}
