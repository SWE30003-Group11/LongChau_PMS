import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  image?: string
  quantity: number
  prescriptionRequired?: boolean
}

interface CartStore {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      
      addToCart: (item) => set((state) => {
        const existingItem = state.cart.find((i) => i.id === item.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          return {
            cart: state.cart.map((i) =>
              i.id === item.id ? { ...i, quantity: item.quantity } : i
            ),
          }
        }
        
        // Add new item
        return { cart: [...state.cart, item] }
      }),
      
      removeFromCart: (id) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== id),
      })),
      
      updateQuantity: (id, quantity) => set((state) => ({
        cart: state.cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        ),
      })),
      
      clearCart: () => set({ cart: [] }),
    }),
    {
      name: 'longchau-cart',
    }
  )
)