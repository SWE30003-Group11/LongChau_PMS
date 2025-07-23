"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Heart,
  ShoppingCart,
  Loader2,
  X
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useCart } from "@/hooks/use-cart"
import Link from "next/link"

// Helper function to get product image URL from storage
function getProductImageUrl(productName: string): string {
  const { data } = supabase.storage.from('product-images').getPublicUrl(`${productName}.png`)
  return data.publicUrl
}

interface Product {
  id: number
  name: string
  generic_name?: string
  price: number
  original_price?: number | null
  category?: string | null
  prescription_required?: boolean
  in_stock?: boolean
  manufacturer?: string | null
  pack_size?: string | null
  strength?: string | null
  description?: string | null
}

interface FavoriteProduct {
  id: string
  user_id: string
  product_id: number
  created_at: string
  product: Product | null
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { addToCart } = useCart()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_products')
        .select('id, user_id, product_id, created_at, product:products(*)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      // Defensive: if product is array, take first element
      const favoritesWithProduct = ((data as unknown) as any[]).map((fav: any) => ({
        ...fav,
        product: Array.isArray(fav.product) ? fav.product[0] : fav.product
      }))
      setFavorites(favoritesWithProduct as FavoriteProduct[])
    } catch (error) {
      console.error('Error fetching favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFavorite = async (favoriteId: string, productName: string) => {
    if (!confirm(`Remove ${productName} from favorites?`)) return
    setRemoving(favoriteId)
    try {
      const { error } = await supabase
        .from('favorite_products')
        .delete()
        .eq('id', favoriteId)
      if (error) throw error
      setFavorites(favorites => favorites.filter(f => f.id !== favoriteId))
    } catch (error) {
      console.error('Error removing favorite:', error)
    } finally {
      setRemoving(null)
    }
  }

  const handleAddToCart = (product: any) => {
    if (product.prescription_required) {
      router.push('/account/prescriptions')
      return
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getProductImageUrl(product.name),
      quantity: 1
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => router.push('/account/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-light mb-2">My Favorites</h1>
                <p className="text-gray-600">Products you've saved for later</p>
              </div>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => router.push('/shop')}
              >
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Favorites Grid */}
          {favorites.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-gray-500 mb-6">
                  Save your favorite products to buy them later
                </p>
                <Button 
                  className="rounded-full"
                  onClick={() => router.push('/shop')}
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((favorite) => {
                const product = favorite.product
                if (!product) return (
                  <div key={favorite.id} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm p-6 flex flex-col items-center justify-center text-gray-400">
                      <X className="h-8 w-8 mb-2" />
                      <div className="text-sm">Product not found</div>
                    </div>
                  </div>
                )

                return (
                  <div key={favorite.id} className="group">
                    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative">
                        <Link href={`/shop/${product.id}`}>
                          <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                            <img
                              src={getProductImageUrl(product.name) || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-64 object-cover"
                            />
                          </div>
                        </Link>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.id, product.name)}
                          disabled={removing === favorite.id}
                          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
                        >
                          {removing === favorite.id ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <X className="h-5 w-5" />
                          )}
                        </button>
                        {product.category && (
                          <Badge 
                            className="absolute top-2 left-2 bg-white text-gray-800"
                            variant="secondary"
                          >
                            {product.category}
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-lg font-semibold mb-3">
                          {typeof product.price === 'number' ? product.price.toLocaleString('vi-VN') : '-'}₫
                        </p>
                        {product.prescription_required && (
                          <Badge variant="outline" className="mb-3 text-xs">
                            Prescription Required
                          </Badge>
                        )}
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => router.push(`/shop/${product.id}`)}
                          >
                            View Details
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Quick Stats */}
          {favorites.length > 0 && (
            <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-medium mb-4">Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Items</p>
                  <p className="text-2xl font-semibold">{favorites.length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Total Value</p>
                  <p className="text-2xl font-semibold">
                    {favorites
                      .reduce((sum, fav) => sum + (fav.product?.price || 0), 0)
                      .toLocaleString('vi-VN')}₫
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Prescription Items</p>
                  <p className="text-2xl font-semibold">
                    {favorites.filter(f => f.product?.prescription_required).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}