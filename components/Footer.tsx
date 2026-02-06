"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-underground-border bg-underground-card mt-auto">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-3 md:gap-12">
          <div className="md:col-span-1">
            <Link href="/" className="font-bold text-xl text-underground-fg uppercase tracking-tight hover:text-underground-accent transition">
              Underground
            </Link>
            <p className="text-underground-muted text-sm mt-3 max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h3 className="text-underground-fg font-semibold text-sm uppercase tracking-wide mb-3">{t("footer.platform")}</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-underground-muted hover:text-underground-fg text-sm transition">{t("footer.discover")}</Link></li>
              <li><Link href="/events/new" className="text-underground-muted hover:text-underground-fg text-sm transition">{t("footer.submitEvent")}</Link></li>
              <li><Link href="/events" className="text-underground-muted hover:text-underground-fg text-sm transition">{t("footer.venues")}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-underground-fg font-semibold text-sm uppercase tracking-wide mb-3">{t("footer.support")}</h3>
            <ul className="space-y-2">
              <li><Link href="/events" className="text-underground-muted hover:text-underground-fg text-sm transition">{t("footer.faq")}</Link></li>
              <li><Link href="/events" className="text-underground-muted hover:text-underground-fg text-sm transition">{t("footer.privacy")}</Link></li>
              <li><Link href="/events" className="text-underground-muted hover:text-underground-fg text-sm transition">{t("footer.terms")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-underground-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-underground-muted text-xs">
            © {new Date().getFullYear()} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-underground-muted hover:text-underground-fg transition" aria-label="Share">🔗</a>
            <a href="#" className="text-underground-muted hover:text-underground-fg transition" aria-label="Social">🛜</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
