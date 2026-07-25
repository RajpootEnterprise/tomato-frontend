import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { getCart, getCartTotal, addToCart as apiAdd, updateCartItem, removeCartItem, clearCart as apiClear } from '../api/cart';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      setCartTotal(0);
      setCartCount(0);
      return;
    }
    try {
      setLoading(true);
      const [cartRes, totalRes] = await Promise.all([getCart(), getCartTotal()]);
      const items = cartRes.data?.data ?? [];
      const total = totalRes.data?.data?.total ?? 0;
      setCartItems(items);
      setCartTotal(total);
      setCartCount(items.reduce((sum, i) => sum + i.quantity, 0));
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addItem = useCallback(async (menuItemId) => {
    const res = await apiAdd(menuItemId, 1);
    const updatedItem = res.data?.data;
    if (updatedItem) {
      setCartItems((prev) => {
        const exists = prev.find((i) => i.id === updatedItem.id);
        if (exists) {
          return prev.map((i) => (i.id === updatedItem.id ? updatedItem : i));
        }
        return [...prev, updatedItem];
      });
      setCartCount((c) => c + 1);
      setCartTotal((t) => t + updatedItem.price);
    }
    return updatedItem;
  }, []);

  const updateItem = useCallback(async (cartItemId, quantity) => {
    const res = await updateCartItem(cartItemId, quantity);
    const updatedItem = res.data?.data;
    if (quantity === 0 || updatedItem === null) {
      // Item removed
      setCartItems((prev) => {
        const removed = prev.find((i) => i.id === cartItemId);
        if (removed) {
          setCartCount((c) => Math.max(0, c - removed.quantity));
          setCartTotal((t) => Math.max(0, t - removed.price * removed.quantity));
        }
        return prev.filter((i) => i.id !== cartItemId);
      });
    } else if (updatedItem) {
      setCartItems((prev) =>
        prev.map((i) => {
          if (i.id === cartItemId) {
            const diff = updatedItem.quantity - i.quantity;
            setCartCount((c) => c + diff);
            setCartTotal((t) => t + diff * i.price);
            return updatedItem;
          }
          return i;
        })
      );
    }
  }, []);

  const removeItem = useCallback(async (cartItemId) => {
    await removeCartItem(cartItemId);
    setCartItems((prev) => {
      const removed = prev.find((i) => i.id === cartItemId);
      if (removed) {
        setCartCount((c) => Math.max(0, c - removed.quantity));
        setCartTotal((t) => Math.max(0, t - removed.price * removed.quantity));
      }
      return prev.filter((i) => i.id !== cartItemId);
    });
  }, []);

  const clearCartState = useCallback(async () => {
    await apiClear();
    setCartItems([]);
    setCartTotal(0);
    setCartCount(0);
  }, []);

  const getItemInCart = useCallback(
    (menuItemId) => cartItems.find((i) => i.menuItemId === menuItemId),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartCount,
        loading,
        fetchCart,
        addItem,
        updateItem,
        removeItem,
        clearCartState,
        getItemInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
