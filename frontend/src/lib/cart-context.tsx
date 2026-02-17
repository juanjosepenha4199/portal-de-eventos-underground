"use client";

import { createContext, useContext, useCallback, useState, useEffect } from "react";

const CART_STORAGE_KEY = "underground-cart";

export type CartItem = {
  eventId: string;
  title: string;
  price: string;
  priceCents: number;
  image: string | null;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (eventId: string) => void;
  clearCart: () => void;
  hasItem: (eventId: string) => boolean;
  totalCents: number;
  count: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {}
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) saveCart(items);
  }, [mounted, items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      if (prev.some((i) => i.eventId === item.eventId)) return prev;
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((eventId: string) => {
    setItems((prev) => prev.filter((i) => i.eventId !== eventId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const hasItem = useCallback(
    (eventId: string) => items.some((i) => i.eventId === eventId),
    [items]
  );

  const totalCents = items.reduce((sum, i) => sum + i.priceCents, 0);
  const count = items.length;

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, hasItem, totalCents, count }}
    >
      {children}
    </CartContext.Provider>
  );
}
