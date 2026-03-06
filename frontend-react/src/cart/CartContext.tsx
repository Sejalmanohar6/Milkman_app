import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';

export type ScheduleType = 'DAILY' | 'ALTERNATE' | 'WEEKDAYS' | 'WEEKENDS';
export type PlanType = 'one-time' | 'monthly' | 'yearly';

export type CartItem = {
  productId: number;
  name: string;
  unit: string;
  price: number;
  quantityPerDay: number;
  scheduleType: ScheduleType;
  plan: PlanType;
};

type State = { items: CartItem[] };
type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: number }
  | { type: 'UPDATE'; productId: number; patch: Partial<CartItem> }
  | { type: 'CLEAR' };

const STORAGE_KEY = 'milkman_cart_v1';

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.productId === action.item.productId);
      if (exists) {
        return {
          items: state.items.map(i =>
            i.productId === action.item.productId
              ? { ...i, quantityPerDay: i.quantityPerDay + action.item.quantityPerDay }
              : i
          ),
        };
      }
      return { items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { items: state.items.filter(i => i.productId !== action.productId) };
    case 'UPDATE':
      return {
        items: state.items.map(i => (i.productId === action.productId ? { ...i, ...action.patch } : i)),
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

const CartCtx = createContext<{
  items: CartItem[];
  subtotal: number;
  add: (item: CartItem) => void;
  remove: (productId: number) => void;
  update: (productId: number, patch: Partial<CartItem>) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] }, () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as State;
    } catch {}
    return { items: [] };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * Number(i.quantityPerDay), 0),
    [state.items]
  );

  const value = useMemo(
    () => ({
      items: state.items,
      subtotal,
      add: (item: CartItem) => dispatch({ type: 'ADD', item }),
      remove: (productId: number) => dispatch({ type: 'REMOVE', productId }),
      update: (productId: number, patch: Partial<CartItem>) =>
        dispatch({ type: 'UPDATE', productId, patch }),
      clear: () => dispatch({ type: 'CLEAR' }),
    }),
    [state.items, subtotal]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

