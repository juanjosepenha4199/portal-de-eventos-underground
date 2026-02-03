"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["música", "arte", "cultura", "teatro", "cine", "literatura", "festival", "otro"];

type Initial = {
  title: string;
  description: string;
  category: string;
  dateTime: string;
  location: string;
  image: string;
  status?: string;
};

export function EventForm({
  eventId,
  initial,
}: {
  eventId?: string;
  initial?: Initial;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Initial>(
    initial ?? {
      title: "",
      description: "",
      category: "",
      dateTime: "",
      location: "",
      image: "",
      status: "ACTIVE",
    }
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const url = eventId ? `/api/events/${eventId}` : "/api/events";
      const method = eventId ? "PATCH" : "POST";
      const body = {
        ...form,
        dateTime: new Date(form.dateTime).toISOString(),
        image: form.image.trim() || undefined,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error?.title?.[0] ?? data.error ?? "Error al guardar");
        return;
      }
      router.push(eventId ? `/events/${eventId}` : "/events");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-underground-border bg-underground-card p-6">
      {error && (
        <p className="text-underground-danger text-sm bg-red-500/10 border border-red-500/30 rounded px-3 py-2">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm text-zinc-400 mb-1">Título</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm text-zinc-400 mb-1">Descripción</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          required
          rows={4}
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm text-zinc-400 mb-1">Categoría</label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
        >
          <option value="">Seleccionar</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dateTime" className="block text-sm text-zinc-400 mb-1">Fecha y hora</label>
        <input
          id="dateTime"
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm text-zinc-400 mb-1">Ubicación</label>
        <input
          id="location"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm text-zinc-400 mb-1">URL de imagen (opcional)</label>
        <input
          id="image"
          type="url"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          placeholder="https://..."
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
        />
      </div>
      {eventId && initial?.status && (
        <div>
          <label htmlFor="status" className="block text-sm text-zinc-400 mb-1">Estado</label>
          <select
            id="status"
            value={form.status ?? "ACTIVE"}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-underground-accent"
          >
            <option value="ACTIVE">Activo</option>
            <option value="CANCELLED">Cancelado</option>
          </select>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-underground-accent text-white px-4 py-2 rounded font-medium hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Guardando…" : eventId ? "Guardar cambios" : "Crear evento"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-underground-border text-zinc-400 px-4 py-2 rounded font-medium hover:text-white"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
