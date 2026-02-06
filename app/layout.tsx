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
      <body className={`${inter.variable} font-sans antialiased min-h-screen bg-underground-bg text-underground-fg`}>
        <ThemeScript />
        <Providers>
          <Header />
          <main className="container mx-auto px-4 py-6 md:py-8 min-h-[calc(100vh-3.5rem)] flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
