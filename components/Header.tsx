"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b border-underground-border bg-underground-card/80 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between h-14">
        <Link href="/" className="font-bold text-xl text-white">
          Underground
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/events" className="text-zinc-300 hover:text-white text-sm">
            Eventos
          </Link>
          {status === "loading" ? (
            <span className="text-underground-muted text-sm">...</span>
          ) : session ? (
            <>
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="text-underground-accent hover:text-purple-300 text-sm">
                  Admin
                </Link>
              )}
              {["ORGANIZER", "ADMIN"].includes(session.user?.role ?? "") && (
                <Link href="/events/my" className="text-zinc-300 hover:text-white text-sm">
                  Mis eventos
                </Link>
              )}
              <Link href="/events/favorites" className="text-zinc-300 hover:text-white text-sm">
                Favoritos
              </Link>
              <span className="text-underground-muted text-sm">{session.user?.name}</span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-underground-muted hover:text-white text-sm"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="text-zinc-300 hover:text-white text-sm">
                Entrar
              </Link>
              <Link href="/auth/register" className="bg-underground-accent text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-purple-600">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
