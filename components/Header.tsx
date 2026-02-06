"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { useTranslation } from "@/lib/i18n/context";
import { useCart } from "@/lib/cart-context";
import type { Locale } from "@/lib/i18n/messages";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

const LOCALES: { value: Locale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "es", label: "ES" },
  { value: "pt", label: "PT" },
  { value: "fr", label: "FR" },
];

export function Header() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { t, locale, setLocale } = useTranslation();
  const { count: cartCount } = useCart();

  return (
    <header className="border-b border-underground-border bg-underground-card/95 backdrop-blur sticky top-0 z-50 shadow-neon-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-14 md:h-16">
        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          className="p-2 text-underground-fg hover:text-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple rounded lg:hidden"
          aria-label={menuOpen ? t("nav.menuOpen") : t("nav.menuClose")}
        >
          {menuOpen ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
        <Link href="/events" className="hidden lg:block text-underground-muted hover:text-underground-fg text-sm">{t("nav.events")}</Link>

        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 font-bold text-xl md:text-2xl text-underground-fg tracking-tight uppercase hover:text-neon-purple transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-purple focus-visible:outline-offset-2 rounded"
        >
          Underground
        </Link>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-underground-muted hover:text-underground-accent rounded focus:outline-none focus:ring-2 focus:ring-underground-accent"
            aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")}
          >
            {theme === "dark" ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setLangOpen((o) => !o)}
              className="px-2 py-1 text-underground-muted hover:text-underground-fg text-sm font-medium rounded focus:outline-none focus:ring-2 focus:ring-underground-accent"
              aria-expanded={langOpen}
              aria-haspopup="true"
            >
              {LOCALES.find((l) => l.value === locale)?.label ?? locale.toUpperCase()}
            </button>
            {langOpen && (
              <>
                <div className="fixed inset-0 z-10" aria-hidden onClick={() => setLangOpen(false)} />
                <ul className="absolute right-0 top-full mt-1 py-1 bg-underground-card border border-underground-border rounded-lg shadow-lg z-20 min-w-[4rem]">
                  {LOCALES.map((l) => (
                    <li key={l.value}>
                      <button
                        type="button"
                        onClick={() => { setLocale(l.value); setLangOpen(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-sm ${locale === l.value ? "text-underground-accent font-medium" : "text-underground-muted hover:text-underground-fg"}`}
                      >
                        {l.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <Link
            href="/cart"
            className="relative p-2 text-underground-fg hover:text-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple rounded"
            aria-label={t("nav.cart")}
          >
            <CartIcon className="w-6 h-6" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-neon-purple text-white text-xs font-bold min-w-[1.25rem] h-5 flex items-center justify-center rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <Link
            href={session ? "/events/favorites" : "/auth/login"}
            className="p-2 text-underground-fg hover:text-underground-accent focus:outline-none focus:ring-2 focus:ring-underground-accent rounded"
            aria-label={session ? t("nav.favoritesLabel") : t("nav.loginLabel")}
          >
            <UserIcon className="w-6 h-6" />
          </Link>
          {status === "loading" ? (
            <span className="text-underground-muted text-sm px-2">...</span>
          ) : session ? (
            <div className="hidden sm:flex items-center gap-2">
              {session.user?.role === "ADMIN" && (
                <Link href="/admin" className="text-underground-muted hover:text-underground-accent text-sm">
                  {t("nav.admin")}
                </Link>
              )}
              {["ORGANIZER", "ADMIN"].includes(session.user?.role ?? "") && (
                <Link href="/events/my" className="text-underground-muted hover:text-underground-fg text-sm">
                  {t("nav.myEvents")}
                </Link>
              )}
              <Link href="/events/tickets" className="text-underground-muted hover:text-underground-fg text-sm">
                {t("nav.tickets")}
              </Link>
              <span className="text-underground-muted text-sm max-w-[120px] truncate">{session.user?.name}</span>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-underground-muted hover:text-underground-fg text-sm"
              >
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/auth/login" className="text-underground-muted hover:text-underground-fg text-sm">
                {t("nav.login")}
              </Link>
              <Link
                href="/auth/register"
                className="bg-neon-purple text-underground-fg px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-neon-magenta hover:shadow-neon-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-neon-cyan focus-visible:outline-offset-2"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-underground-border bg-underground-card px-4 py-4">
          <nav className="flex flex-col gap-2">
            <Link href="/events" className="text-underground-fg hover:text-underground-accent py-2" onClick={() => setMenuOpen(false)}>
              {t("nav.events")}
            </Link>
            <Link href="/cart" className="text-underground-fg hover:text-underground-accent py-2" onClick={() => setMenuOpen(false)}>
              {t("nav.cart")} {cartCount > 0 ? `(${cartCount})` : ""}
            </Link>
            {session && (
              <>
                {session.user?.role === "ADMIN" && (
                  <Link href="/admin" className="text-underground-muted hover:text-underground-accent py-2" onClick={() => setMenuOpen(false)}>
                    {t("nav.admin")}
                  </Link>
                )}
                {["ORGANIZER", "ADMIN"].includes(session.user?.role ?? "") && (
                  <Link href="/events/my" className="text-underground-muted hover:text-underground-fg py-2" onClick={() => setMenuOpen(false)}>
                    {t("nav.myEvents")}
                  </Link>
                )}
                <Link href="/events/favorites" className="text-underground-muted hover:text-underground-fg py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.favorites")}
                </Link>
                <Link href="/events/tickets" className="text-underground-muted hover:text-underground-fg py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.tickets")}
                </Link>
                <span className="text-underground-muted text-sm py-2">{session.user?.name}</span>
                <button
                  type="button"
                  onClick={() => { signOut({ callbackUrl: "/" }); setMenuOpen(false); }}
                  className="text-left text-underground-muted hover:text-underground-fg py-2"
                >
                  {t("nav.logout")}
                </button>
              </>
            )}
            {!session && status !== "loading" && (
              <>
                <Link href="/auth/login" className="text-underground-muted hover:text-underground-fg py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.login")}
                </Link>
                <Link href="/auth/register" className="text-underground-accent py-2" onClick={() => setMenuOpen(false)}>
                  {t("nav.register")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
