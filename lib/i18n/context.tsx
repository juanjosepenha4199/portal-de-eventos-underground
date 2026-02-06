"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { messages, getStoredLocale, setStoredLocale, type Locale } from "./messages";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}

function getMessage(locale: Locale, key: string): string {
  const m = messages[locale];
  return (m && m[key]) ?? messages.en[key] ?? key;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getStoredLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    setStoredLocale(next);
    if (typeof document !== "undefined") document.documentElement.lang = next;
  }, []);

  useEffect(() => {
    if (mounted && typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale, mounted]);

  const t = useCallback(
    (key: string) => getMessage(locale, key),
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}
