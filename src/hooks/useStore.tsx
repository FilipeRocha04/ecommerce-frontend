import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, Vehicle } from "@/types";
import { PRODUCTS, getProduct } from "@/mocks/products";
import { MY_VEHICLES, fitmentKey } from "@/mocks/vehicles";
import { track } from "@/services/tracking";
import type { Channel } from "@/types";

const KEY = "autoparts:state:v1";

interface PersistedState {
  cart: CartItem[];
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  favorites: string[];
  coupon: string | null;
}

interface StoreValue extends PersistedState {
  cartProducts: { product: Product; quantity: number }[];
  cartCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  addToCart: (productId: string, quantity?: number, channel?: Channel) => void;
  removeFromCart: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  setVehicle: (v: Vehicle | null) => void;
  addVehicle: (v: Vehicle) => void;
  removeVehicle: (id: string) => void;
  makePrimary: (id: string) => void;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  isCompatible: (product: Product) => boolean | null;
}

const initial: PersistedState = {
  cart: [],
  vehicle: null,
  vehicles: MY_VEHICLES,
  favorites: ["pastilha-bosch-diant", "oleo-mobil-5w30"],
  coupon: null,
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...(JSON.parse(raw) as PersistedState) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const addToCart = useCallback((productId: string, quantity = 1, channel: Channel = "web") => {
    setState((s) => {
      const existing = s.cart.find((i) => i.productId === productId);
      const cart = existing
        ? s.cart.map((i) =>
            i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i,
          )
        : [...s.cart, { productId, quantity }];
      return { ...s, cart };
    });
    track(
      channel === "assistant" ? "assistant_add_to_cart" : "product_added_to_cart",
      { productId, quantity },
      channel,
    );
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setState((s) => ({ ...s, cart: s.cart.filter((i) => i.productId !== productId) }));
    track("product_removed_from_cart", { productId });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setState((s) => ({
      ...s,
      cart: s.cart
        .map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i))
        .filter((i) => i.quantity > 0),
    }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [], coupon: null })), []);

  const applyCoupon = useCallback((code: string) => {
    const valid = code.trim().toUpperCase() === "AUTO10";
    setState((s) => ({ ...s, coupon: valid ? "AUTO10" : null }));
    return valid;
  }, []);

  const setVehicle = useCallback((v: Vehicle | null) => {
    setState((s) => ({ ...s, vehicle: v }));
    if (v)
      track("vehicle_selected", { brand: v.brand, model: v.model, year: v.year, engine: v.engine });
  }, []);

  const addVehicle = useCallback((v: Vehicle) => {
    setState((s) => ({ ...s, vehicles: [...s.vehicles, v], vehicle: v }));
    track("vehicle_selected", { brand: v.brand, model: v.model, year: v.year, engine: v.engine });
  }, []);

  const removeVehicle = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      vehicles: s.vehicles.filter((v) => v.id !== id),
      vehicle: s.vehicle?.id === id ? null : s.vehicle,
    }));
  }, []);

  const makePrimary = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      vehicles: s.vehicles.map((v) => ({ ...v, primary: v.id === id })),
      vehicle: s.vehicles.find((v) => v.id === id) ?? s.vehicle,
    }));
  }, []);

  const toggleFavorite = useCallback((productId: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(productId)
        ? s.favorites.filter((f) => f !== productId)
        : [...s.favorites, productId],
    }));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const cartProducts = state.cart
      .map((i) => ({ product: getProduct(i.productId), quantity: i.quantity }))
      .filter((i): i is { product: Product; quantity: number } => Boolean(i.product));
    const subtotal = cartProducts.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const shipping = subtotal === 0 || subtotal >= 299 ? 0 : 24.9;
    const discount = state.coupon ? subtotal * 0.1 : 0;

    return {
      ...state,
      cartProducts,
      cartCount: state.cart.reduce((a, i) => a + i.quantity, 0),
      subtotal,
      shipping,
      discount,
      total: subtotal + shipping - discount,
      addToCart,
      removeFromCart,
      setQuantity,
      clearCart,
      applyCoupon,
      setVehicle,
      addVehicle,
      removeVehicle,
      makePrimary,
      toggleFavorite,
      isFavorite: (id: string) => state.favorites.includes(id),
      isCompatible: (product: Product) => {
        if (!state.vehicle) return null;
        return product.fitment.includes(fitmentKey(state.vehicle));
      },
    };
  }, [
    state,
    addToCart,
    removeFromCart,
    setQuantity,
    clearCart,
    applyCoupon,
    setVehicle,
    addVehicle,
    removeVehicle,
    makePrimary,
    toggleFavorite,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de StoreProvider");
  return ctx;
}

export const ALL_PRODUCTS = PRODUCTS;
