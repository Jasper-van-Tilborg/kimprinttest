"use client";

import { CartProvider } from "../../contexts/CartContext";
import ShoppingCart from "./ShoppingCart";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <ShoppingCart />
    </CartProvider>
  );
}

