"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  "",
  "música",
  "arte",
  "cultura",
  "teatro",
  "cine",
  "literatura",
  "festival",
  "otro",
];

export function EventFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category") ?? "";
  const from = searchParams.get("from") ?? "";
  const to = searchParams.get("to") ?? "";

  const updateFilters = useCallback(
    (updates: { category?: string; from?: string; to?: string }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (updates.category !== undefined) (updates.category ? params.set("category", updates.category) : params.delete("category"));
      if (updates.from !== undefined) (updates.from ? params.set("from", updates.from) : params.delete("from"));
      if (updates.to !== undefined) (updates.to ? params.set("to", updates.to) : params.delete("to"));
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  return (
    <section className="rounded-lg border border-underground-border bg-underground-card p-4">
      <h3 className="text-sm font-medium text-zinc-400 mb-3">Filtros</h3>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label htmlFor="filter-category" className="block text-xs text-zinc-500 mb-1">Categoría</label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => updateFilters({ category: e.target.value })}
            className="bg-underground-bg border border-underground-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-underground-accent"
          >
            {CATEGORIES.map((c) => (
              <option key={c || "all"} value={c}>{c || "Todas"}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="filter-from" className="block text-xs text-zinc-500 mb-1">Desde</label>
          <input
            id="filter-from"
            type="date"
            value={from}
            onChange={(e) => updateFilters({ from: e.target.value })}
            className="bg-underground-bg border border-underground-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
        <div>
          <label htmlFor="filter-to" className="block text-xs text-zinc-500 mb-1">Hasta</label>
          <input
            id="filter-to"
            type="date"
            value={to}
            onChange={(e) => updateFilters({ to: e.target.value })}
            className="bg-underground-bg border border-underground-border rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-underground-accent"
          />
        </div>
        {(category || from || to) && (
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-underground-muted hover:text-white text-sm"
          >
            Limpiar filtros
          </button>
        )}
      </div>
    </section>
  );
}
