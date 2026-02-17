import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeScript } from "@/components/ThemeScript";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Underground – Portal de Eventos",
  description: "Eventos underground, alternativos, culturales e independientes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased min-h-screen text-underground-fg flex flex-col`}>
        <ThemeScript />
        <Providers>
          <a href="#main-content" className="skip-link">
            Saltar al contenido
          </a>
          <Header />
          <main id="main-content" className="container mx-auto px-4 py-6 md:py-8 flex-1 flex flex-col min-h-0" role="main" style={{ backgroundColor: "var(--underground-bg)" }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
