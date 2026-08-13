import {
  createContext,
  useState,
} from "react";

export const CartContext =
  createContext();

export function CartProvider({
  children,
}) {
  const [cartItems, setCartItems] =
    useState([]);

  const normalizeBook = (
    book
  ) => ({
    ...book,
    image:
      book.image ||
      book.imageUrl ||
      "",
  });

  // Add 1 item

  const addToCart = (book) => {
    const normalizedBook =
      normalizeBook(book);

    setCartItems((prev) => {
      const existingBook =
        prev.find(
          (item) =>
            item.id ===
            normalizedBook.id
        );

      if (existingBook) {
        return prev.map((item) =>
          item.id ===
          normalizedBook.id
            ? {
                ...item,
                quantity:
                  item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...normalizedBook,
          quantity: 1,
        },
      ];
    });
  };

  // Add with quantity

  const addToCartWithQuantity = (
    book,
    quantity
  ) => {
    const normalizedBook =
      normalizeBook(book);

    setCartItems((prev) => {
      const existingBook =
        prev.find(
          (item) =>
            item.id ===
            normalizedBook.id
        );

      if (existingBook) {
        return prev.map((item) =>
          item.id ===
          normalizedBook.id
            ? {
                ...item,
                quantity:
                  item.quantity +
                  quantity,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          ...normalizedBook,
          quantity,
        },
      ];
    });
  };

  // Increase

  const increaseQuantity = (
    id
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  };

  // Decrease

  const decreaseQuantity = (
    id
  ) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  // Remove

  const removeFromCart = (
    id
  ) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // Clear

  const clearCart = () => {
    setCartItems([]);
  };

  const totalItems =
    cartItems.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  const totalAmount =
    cartItems.reduce(
      (sum, item) =>
        sum +
        item.price *
          item.quantity,
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,

        addToCart,
        addToCartWithQuantity,

        increaseQuantity,
        decreaseQuantity,

        removeFromCart,
        clearCart,

        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}