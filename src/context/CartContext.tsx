
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  size: string;
  msrp: number;
  itemNumber: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, 'quantity'>, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => { totalMSRP: number; totalUnits: number; estimatedTotal: number; unitPrice: number; statusMessage: string };
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
  let unitPrice: number;
  let message = "Estimated total confirmed.";

  if (totalMSRP < 1000) {
    unitPrice = 0;
    message = "Minimum purchase of $1,000 not met. Please add more items to your cart.";
  } else if (totalMSRP >= 1000 && totalMSRP < 3000) {
    unitPrice = 3.95;
  } else if (totalMSRP >= 3000 && totalMSRP < 5000) {
    unitPrice = 3.25;
  } else if (totalMSRP >= 5000 && totalMSRP < 10000) {
    unitPrice = 2.80;
  } else if (totalMSRP >= 10000) {
    unitPrice = 2.40;
  } else {
    unitPrice = 0;
  }

  const finalTotal = totalUnits * unitPrice;
  return { unitPrice, finalTotal, message };
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
    
    const { unitPrice, finalTotal, message } = getTieredPricing(totalMSRP, totalUnits);
    
    return {
      totalMSRP,
      totalUnits,
      estimatedTotal: finalTotal,
      unitPrice,
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
