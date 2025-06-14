
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  sku: string;
  quantity: number;
  product_type: string;
  size: string;
  scent: string | null;
  ingredients: string[] | null;
  msrp: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { totalMSRP: number; totalUnits: number; estimatedTotal: number; unitPrice: number; discountPercentage: number; statusMessage: string };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const getTieredPricing = (totalMSRP: number, totalUnits: number) => {
  let estimatedTotal: number;
  let unitPrice: number;
  let discountPercentage: number;
  let message = "Estimated total confirmed.";

  if (totalUnits < 250) {
    estimatedTotal = totalMSRP; // No discount below 250 units
    unitPrice = totalUnits > 0 ? totalMSRP / totalUnits : 0;
    discountPercentage = 0;
    message = `Minimum purchase of 250 units not met. Please add ${250 - totalUnits} more units to your cart.`;
  } else if (totalUnits >= 250 && totalUnits < 900) {
    discountPercentage = 73.5;
    estimatedTotal = totalMSRP * (1 - discountPercentage / 100);
    unitPrice = estimatedTotal / totalUnits;
  } else if (totalUnits >= 900 && totalUnits < 1800) {
    discountPercentage = 78;
    estimatedTotal = totalMSRP * (1 - discountPercentage / 100);
    unitPrice = estimatedTotal / totalUnits;
  } else if (totalUnits >= 1800 && totalUnits < 4000) {
    discountPercentage = 81;
    estimatedTotal = totalMSRP * (1 - discountPercentage / 100);
    unitPrice = estimatedTotal / totalUnits;
  } else { // totalUnits >= 4000
    discountPercentage = 84;
    estimatedTotal = totalMSRP * (1 - discountPercentage / 100);
    unitPrice = estimatedTotal / totalUnits;
  }

  return { unitPrice, finalTotal: estimatedTotal, discountPercentage, message };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, 'quantity'>, quantity: number) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    const totalMSRP = cartItems.reduce((sum, item) => sum + (item.msrp * item.quantity), 0);
    const totalUnits = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const { unitPrice, finalTotal, discountPercentage, message } = getTieredPricing(totalMSRP, totalUnits);

    return {
      totalMSRP,
      totalUnits,
      estimatedTotal: finalTotal,
      unitPrice,
      discountPercentage,
      statusMessage: message
    };
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
};
