"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/context";

const CATEGORIES = ["música", "arte", "cultura", "teatro", "cine", "literatura", "festival", "otro"];

type Initial = {
  title: string;
  description: string;
  category: string;
  dateTime: string;
  location: string;
  image: string;
  price: string;
  priceCents?: number | null;
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
  const { t } = useTranslation();
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
      price: "",
      priceCents: null,
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
        priceCents: form.priceCents != null ? form.priceCents : null,
      };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error?.title?.[0] ?? data.error ?? t("form.saveError"));
        return;
      }
      router.push(eventId ? `/events/${eventId}` : "/events");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-underground-border bg-underground-card p-6 shadow-neon-sm">
      {error && (
        <p role="alert" className="text-underground-danger text-sm bg-underground-danger/10 border border-underground-danger/40 rounded-lg px-3 py-2 flex items-center gap-2" aria-live="assertive">
          <span aria-hidden>⚠</span>
          {error}
        </p>
      )}
      <div>
        <label htmlFor="title" className="block text-sm text-underground-muted mb-1">{t("form.title")}</label>
        <input
          id="title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm text-underground-muted mb-1">{t("form.description")}</label>
        <textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          required
          rows={4}
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
        />
      </div>
      <div>
        <label htmlFor="category" className="block text-sm text-underground-muted mb-1">{t("form.category")}</label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
        >
          <option value="">{t("form.selectCategory")}</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="dateTime" className="block text-sm text-underground-muted mb-1">{t("form.dateTime")}</label>
        <input
          id="dateTime"
          type="datetime-local"
          value={form.dateTime}
          onChange={(e) => setForm((f) => ({ ...f, dateTime: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm text-underground-muted mb-1">{t("form.location")}</label>
        <input
          id="location"
          value={form.location}
          onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          required
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
        />
      </div>
      <div>
        <label htmlFor="image" className="block text-sm text-underground-muted mb-1">{t("form.imageUrl")}</label>
        <input
          id="image"
          type="url"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          placeholder={t("form.imagePlaceholder")}
          className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
        />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label htmlFor="price" className="block text-sm text-underground-muted mb-1">{t("form.price")}</label>
          <input
            id="price"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            placeholder={t("form.pricePlaceholder")}
            className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          />
        </div>
        <div>
          <label htmlFor="priceCents" className="block text-sm text-underground-muted mb-1">{t("form.priceCents")}</label>
          <input
            id="priceCents"
            type="number"
            min={0}
            value={form.priceCents ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, priceCents: e.target.value === "" ? null : Number(e.target.value) }))}
            placeholder="0"
            className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          />
        </div>
      </div>
      {eventId && initial?.status && (
        <div>
          <label htmlFor="status" className="block text-sm text-underground-muted mb-1">{t("form.status")}</label>
          <select
            id="status"
            value={form.status ?? "ACTIVE"}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            className="w-full bg-underground-bg border border-underground-border rounded px-3 py-2 text-underground-fg focus:outline-none focus:ring-2 focus:ring-neon-purple focus:border-neon-purple/50"
          >
            <option value="ACTIVE">{t("form.statusActive")}</option>
            <option value="CANCELLED">{t("form.statusCancelled")}</option>
          </select>
        </div>
      )}
      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="bg-neon-purple text-white px-4 py-2 rounded-lg font-medium hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2 disabled:opacity-50"
        >
          {loading ? t("form.saving") : eventId ? t("form.save") : t("form.create")}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="border border-underground-border text-underground-muted px-4 py-2 rounded-lg font-medium hover:text-underground-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2"
        >
          {t("form.cancel")}
        </button>
      </div>
    </form>
  );
}
