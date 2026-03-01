import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { Product, Color } from "@/data/products";

export interface CartItem {
  product: Product;
  color: Color;
  size: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, color: Color, size: string) => void;
  removeItem: (productId: string, color: Color, size: string) => void;
  updateQuantity: (productId: string, color: Color, size: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  discount: number;
  setDiscount: (discount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    // Charger le panier depuis localStorage au démarrage
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('labelia-cart');
      if (savedCart) {
        try {
          return JSON.parse(savedCart);
        } catch (error) {
          console.error('Failed to parse cart from localStorage:', error);
        }
      }
    }
    return [];
  });

  const [discount, setDiscount] = useState<number>(0);

  // Sauvegarder le panier dans localStorage à chaque modification
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (items.length > 0) {
        localStorage.setItem('labelia-cart', JSON.stringify(items));
      } else {
        // Toujours supprimer du localStorage quand le panier est vide
        localStorage.removeItem('labelia-cart');
      }
    }
  }, [items]);

  const addItem = useCallback((product: Product, color: Color, size: string) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.product.id === product.id && i.color === color && i.size === size
      );
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id && i.color === color && i.size === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, color, size, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string, color: Color, size: string) => {
    setItems((prev) => prev.filter(
      (i) => !(i.product.id === productId && i.color === color && i.size === size)
    ));
  }, []);

  const updateQuantity = useCallback((productId: string, color: Color, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, color, size);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId && i.color === color && i.size === size
          ? { ...i, quantity }
          : i
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, discount, setDiscount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
