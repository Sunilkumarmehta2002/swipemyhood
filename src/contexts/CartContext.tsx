import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import toast from 'react-hot-toast';

interface CartItem {
  id: string;
  name: string;
  city: string;
  image: string;
  price: number;
  type: 'consultation' | 'tour' | 'relocation_package';
  description: string;
  quantity: number;
}

interface SavedItem {
  id: string;
  name: string;
  city: string;
  image: string;
  description: string;
  savedAt: Date;
}

interface CartState {
  items: CartItem[];
  savedItems: SavedItem[];
  total: number;
  itemCount: number;
}

type CartAction = 
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'SAVE_FOR_LATER'; payload: SavedItem }
  | { type: 'REMOVE_SAVED'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { items: CartItem[]; savedItems: SavedItem[] } };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      let newItems;
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: newItems, total, itemCount };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: newItems, total, itemCount };
    }
    
    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return { ...state, items: newItems, total, itemCount };
    }
    
    case 'SAVE_FOR_LATER': {
      const isAlreadySaved = state.savedItems.some(item => item.id === action.payload.id);
      if (isAlreadySaved) return state;
      
      return {
        ...state,
        savedItems: [...state.savedItems, action.payload]
      };
    }
    
    case 'REMOVE_SAVED': {
      return {
        ...state,
        savedItems: state.savedItems.filter(item => item.id !== action.payload)
      };
    }
    
    case 'CLEAR_CART': {
      return { ...state, items: [], total: 0, itemCount: 0 };
    }
    
    case 'LOAD_CART': {
      const total = action.payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const itemCount = action.payload.items.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: action.payload.items,
        savedItems: action.payload.savedItems,
        total,
        itemCount
      };
    }
    
    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  saveForLater: (item: SavedItem) => void;
  removeSaved: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    savedItems: [],
    total: 0,
    itemCount: 0
  });

  useEffect(() => {
    if (currentUser) {
      loadCart();
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      saveCart();
    }
  }, [state, currentUser]);

  const loadCart = async () => {
    if (!currentUser) return;
    
    try {
      const cartDoc = await getDoc(doc(db, 'carts', currentUser.uid));
      if (cartDoc.exists()) {
        const data = cartDoc.data();
        dispatch({
          type: 'LOAD_CART',
          payload: {
            items: data.items || [],
            savedItems: data.savedItems || []
          }
        });
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const saveCart = async () => {
    if (!currentUser) return;
    
    try {
      await setDoc(doc(db, 'carts', currentUser.uid), {
        items: state.items,
        savedItems: state.savedItems,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(`${item.name} added to cart!`);
  };

  const removeFromCart = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const saveForLater = (item: SavedItem) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: item });
    toast.success(`${item.name} saved for later!`);
  };

  const removeSaved = (id: string) => {
    dispatch({ type: 'REMOVE_SAVED', payload: id });
    toast.success('Removed from saved items');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider value={{
      state,
      addToCart,
      removeFromCart,
      updateQuantity,
      saveForLater,
      removeSaved,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}