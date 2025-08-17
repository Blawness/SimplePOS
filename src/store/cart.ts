import { create } from 'zustand'
import type { Product, CartItem } from '@/lib/types'

type CartState = {
  items: CartItem[]
  addItem: (product: Product) => void
  updateQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: product => {
    set(state => {
      const existingItem = state.items.find(item => item.id === product.id)
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      }
      return {
        items: [...state.items, { ...product, quantity: 1 }]
      }
    })
  },
  updateQuantity: (productId, quantity) =>
    set(state => {
      const updatedItems = state.items
        .map(item => (item.id === productId ? { ...item, quantity } : item))
        .filter(item => item.quantity > 0)
      return { items: updatedItems }
    }),
  removeItem: productId =>
    set(state => ({
      items: state.items.filter(item => item.id !== productId)
    })),
  clearCart: () => set({ items: [] }),
  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  }
}))
