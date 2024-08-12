"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface ICart {
  name: string;
  description: string;
  _id: string;
  price?: number;
  type: string;
  quantity: number;
  paymentType: string;
}

const Context = createContext<{
  cartItems: ICart[];
  setCartItems: (item: ICart[]) => void;
  addToCart: (item: ICart) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateCartItem: ({ id, quantity }: { id: string; quantity: number }) => void;
  updatePaymentType: ({
    id,
    paymentType,
  }: {
    id: string;
    paymentType: string;
  }) => void;
}>({
  cartItems: [],
  setCartItems: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  updateCartItem: () => {},
  updatePaymentType: () => {},
});

export function CartContext({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<ICart[]>([]);

  // Function to add or update an item in the cart
  const addToCart = (item: ICart) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem._id === item._id
    );

    if (existingItem) {
      // Update the quantity of the existing item
      setCartItems(
        cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem?.quantity + 1 }
            : cartItem
        )
      );
    } else {
      // Add the new item to the cart
      setCartItems([...cartItems, item]);
    }
  };

  // Function to update the quantity of an item in the cart
  const updateCartItem = ({
    id,
    quantity,
  }: {
    id: string;
    quantity: number;
  }) => {
    if (quantity === 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(
      cartItems.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  // Function to update the payment type of an item in the cart
  const updatePaymentType = ({
    id,
    paymentType,
  }: {
    id: string;
    paymentType: string;
  }) => {
    setCartItems(
      cartItems.map((item) =>
        item._id === id ? { ...item, paymentType } : item
      )
    );
  };

  // Function to remove an item from the cart
  const removeFromCart = (id: string) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <Context.Provider
      value={{
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem,
        updatePaymentType,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCartContext() {
  return useContext(Context);
}
