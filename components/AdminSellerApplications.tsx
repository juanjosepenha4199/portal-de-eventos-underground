"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/i18n/context";

type SellerApplicationRow = {
  id: string;
  userId: string;
  instagramHandle: string;
  instagramFollowers: number;
  idDocumentNumber: string;
  idDocumentUrl: string | null;
  phone: string | null;
  status: string;
  createdAt: string;
  user: { id: string; email: string; name: string | null };
};

export function AdminSellerApplications() {
  const { t } = useTranslation();
  const [list, setList] = useState<SellerApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  async function fetchList() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seller-applications");
      if (res.ok) {
        const data = await res.json();
        setList(data);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, []);

  async function handleApprove(id: string) {
    setActing(id);
    try {
      const res = await fetch(`/api/admin/seller-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      if (res.ok) {
        await fetchList();
      }
    } finally {
      setActing(null);
    }
  }

  async function handleReject(id: string) {
    const reason = typeof window !== "undefined" ? window.prompt(t("admin.rejectionReason")) : null;
    setActing(id);
    try {
      const res = await fetch(`/api/admin/seller-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", rejectionReason: reason ?? undefined }),
      });
      if (res.ok) {
        await fetchList();
      }
    } finally {
      setActing(null);
    }
  }

  if (loading) {
    return <p className="text-underground-muted py-4">{t("form.saving")}</p>;
  }

  if (list.length === 0) {
    return (
      <div className="rounded-lg border border-underground-border bg-underground-card p-6">
        <p className="text-underground-muted text-center">{t("admin.noSellerApplications")}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-underground-bg text-underground-muted">
            <tr>
              <th className="px-4 py-3">{t("auth.email")}</th>
              <th className="px-4 py-3">{t("auth.name")}</th>
              <th className="px-4 py-3">{t("seller.instagramHandle")}</th>
              <th className="px-4 py-3">{t("seller.instagramFollowers")}</th>
              <th className="px-4 py-3">{t("seller.idDocumentNumber")}</th>
              <th className="px-4 py-3">{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody className="text-underground-fg divide-y divide-underground-border">
            {list.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3">{row.user.email}</td>
                <td className="px-4 py-3">{row.user.name ?? "—"}</td>
                <td className="px-4 py-3">{row.instagramHandle}</td>
                <td className="px-4 py-3">{row.instagramFollowers}</td>
                <td className="px-4 py-3">{row.idDocumentNumber}</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleApprove(row.id)}
                    disabled={!!acting}
                    className="px-3 py-1.5 rounded bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 disabled:opacity-50 text-sm font-medium"
                  >
                    {t("admin.approve")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReject(row.id)}
                    disabled={!!acting}
                    className="px-3 py-1.5 rounded bg-underground-danger/20 text-underground-danger hover:bg-underground-danger/30 disabled:opacity-50 text-sm font-medium"
                  >
                    {t("admin.reject")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
