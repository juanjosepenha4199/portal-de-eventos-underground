"use client";

import type { User } from "@prisma/client";
import { useTranslation } from "@/lib/i18n/context";

type UserRow = Pick<User, "id" | "email" | "name" | "role" | "createdAt">;

export function AdminUsers({ users }: { users: UserRow[] }) {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-underground-bg text-underground-muted">
            <tr>
              <th className="px-4 py-3">{t("auth.email")}</th>
              <th className="px-4 py-3">{t("auth.name")}</th>
              <th className="px-4 py-3">{t("admin.role")}</th>
              <th className="px-4 py-3">{t("admin.registered")}</th>
            </tr>
          </thead>
          <tbody className="text-underground-fg divide-y divide-underground-border">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.name ?? "—"}</td>
                <td className="px-4 py-3">{u.role}</td>
                <td className="px-4 py-3 text-underground-muted">
                  {new Date(u.createdAt).toLocaleDateString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users.length === 0 && (
        <p className="px-4 py-6 text-underground-muted text-center">{t("admin.noUsers")}</p>
      )}
    </div>
  );
}
