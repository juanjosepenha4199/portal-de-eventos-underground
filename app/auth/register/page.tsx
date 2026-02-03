"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
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
      setError(data.error ?? "Error al registrar");
      return;
    }
    router.push("/auth/login");
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto py-12">
      <h1 className="text-2xl font-bold text-white mb-6">Registrarse</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <p className="text-underground-danger text-sm bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </p>
        )}
        <div>
          <label htmlFor="name" className="block text-sm text-zinc-400 mb-1">Nombre (opcional)</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
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
          <label htmlFor="password" className="block text-sm text-zinc-400 mb-1">Contraseña (mín. 6)</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-underground-card border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-underground-accent text-white py-2 rounded font-medium hover:bg-purple-600"
        >
          Registrarse
        </button>
      </form>
      <p className="mt-4 text-underground-muted text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link href="/auth/login" className="text-underground-accent hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
