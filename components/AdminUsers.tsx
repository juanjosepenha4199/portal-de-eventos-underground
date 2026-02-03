import type { User } from "@prisma/client";

type UserRow = Pick<User, "id" | "email" | "name" | "role" | "createdAt">;

export function AdminUsers({ users }: { users: UserRow[] }) {
  return (
    <div className="rounded-lg border border-underground-border bg-underground-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-underground-bg text-zinc-400">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Registro</th>
            </tr>
          </thead>
          <tbody className="text-white divide-y divide-underground-border">
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
        <p className="px-4 py-6 text-underground-muted text-center">No hay usuarios.</p>
      )}
    </div>
  );
}
