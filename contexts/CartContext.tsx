"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  quantity: number;
  color?: string;
  size?: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const addingItemsRef = useRef<Map<string, number>>(null);
  
  // Initialiseer de Map als deze nog niet bestaat
  if (!addingItemsRef.current) {
    addingItemsRef.current = new Map();
  }

  // Laad cart uit localStorage bij mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Error loading cart from localStorage:', e);
      }
    }
  }, []);

  // Sla cart op in localStorage bij wijziging
  useEffect(() => {
    localStorage.setItem('shopping-cart', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    // Zorg ervoor dat de ref altijd een Map is
    if (!(addingItemsRef.current instanceof Map)) {
      addingItemsRef.current = new Map();
    }
    
    // Maak een unieke key voor dit item (id + color + size)
    const itemKey = `${newItem.id}-${newItem.color || 'no-color'}-${newItem.size || 'no-size'}`;
    
    // Gebruik een timestamp om dubbele calls binnen dezelfde milliseconde te voorkomen
    const now = Date.now();
    const lastAddTime = addingItemsRef.current.get(itemKey) || 0;
    
    // Als dit item binnen de laatste 500ms al is toegevoegd, negeer deze call
    if (now - lastAddTime < 500) {
      return; // Voorkom dubbele toevoeging
    }
    
    // Markeer als bezig met huidige timestamp
    addingItemsRef.current.set(itemKey, now);
    
    setItems((currentItems) => {
      // Check of item met dezelfde id, kleur en maat al bestaat
      const existingItemIndex = currentItems.findIndex(
        (item) => 
          item.id === newItem.id && 
          item.color === newItem.color && 
          item.size === newItem.size
      );

      if (existingItemIndex > -1) {
        // Update bestaand item - verhoog quantity met exact de opgegeven quantity
        const updated = [...currentItems];
        const quantityToAdd = newItem.quantity || 1;
        updated[existingItemIndex] = {
          ...updated[existingItemIndex],
          quantity: updated[existingItemIndex].quantity + quantityToAdd
        };
        
        return updated;
      } else {
        // Voeg nieuw item toe
        const newCartItem = { ...newItem, quantity: newItem.quantity || 1 };
        return [...currentItems, newCartItem];
      }
    });
    
    // Verwijder de markering na 500ms
    setTimeout(() => {
      if (addingItemsRef.current) {
        addingItemsRef.current.delete(itemKey);
      }
    }, 500);
  };

  const removeItem = (id: string, color?: string, size?: string) => {
    setItems((currentItems) => 
      currentItems.filter(
        (item) => 
          !(item.id === id && item.color === color && item.size === size)
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeItem(id, color, size);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id && item.color === color && item.size === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}


