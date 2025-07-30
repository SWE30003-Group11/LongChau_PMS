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
  addToCart: (item: CartItem) => { type: 'ADD' | 'UPDATE', item: CartItem }
  removeFromCart: (id: number) => { type: 'REMOVE', item: CartItem | undefined }
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (item) => {
        const existingItem = get().cart.find((i) => i.id === item.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            cart: get().cart.map((i) =>
              i.id === item.id ? { ...i, quantity: item.quantity } : i
            ),
          })
          return { type: 'UPDATE' as const, item }
        }
        
        // Add new item
        set({ cart: [...get().cart, item] })
        return { type: 'ADD' as const, item }
      },
      
      removeFromCart: (id) => {
        const item = get().cart.find(i => i.id === id)
        set({
          cart: get().cart.filter((item) => item.id !== id),
        })
        return { type: 'REMOVE' as const, item }
      },
      
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