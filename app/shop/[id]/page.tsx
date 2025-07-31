"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { Minus, Plus, Shield, Truck, Clock, AlertCircle, FileText, Package, Heart, Phone, MessageCircle, CheckCircle, XCircle, Info, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import { useNotification } from "@/contexts/NotificationContext"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { usePrescription } from "@/hooks/use-prescription"

// Helper to map branch_id to branch name
const branchIdToName: Record<number, string> = {
  1: 'Long Chau - Hai Ba Trung HQ',
  2: 'Long Chau - Nguyen Trai',
  3: 'Long Chau - Le Van Sy',
  4: 'Long Chau - Pham Ngu Lao',
  5: 'Long Chau - District 7',
  6: 'Long Chau - Cong Hoa',
  7: 'Long Chau - Bach Dang',
  8: 'Long Chau - 3 Thang 2',
};

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
  key_features?: string | null
  active_ingredient?: string | null
  mechanism_of_action?: string | null
  indications?: string | string[] | null
  warranty?: string | null
  storage?: string | null
  pregnancy_category?: string | null
  lactation?: string | null
  bundle_products?: string | null
  related_products?: string | null
  inventory?: { quantity: number, branch_id: number }[]
  registration_number?: string | null
  barcode?: string | null
  quality_features?: string | null
  updated_at?: string | null
}

// Helper function to get product image URL from storage
function getProductImageUrl(productName: string, updatedAt?: string | number): string {
  const { data } = supabase.storage.from('product-images').getPublicUrl(`${productName}.png`)
  // Use updatedAt if available, else fallback to Date.now()
  const cacheBuster = updatedAt ? `?t=${updatedAt}` : `?t=${Date.now()}`;
  return data.publicUrl + cacheBuster;
}

// Helper function to get multiple product images
function getProductImages(productName: string): string[] {
  // For now, we'll just return the main image
  // You can extend this to handle multiple images if needed
  return [getProductImageUrl(productName)]
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const productId = Number(id)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false)
  const { addToCart } = useCart()
  const { addNotification } = useNotification()
  const { user } = useAuth()
  const { hasPrescription, isApproved, isLoading: prescriptionLoading } = usePrescription(productId)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const [favoriteLoading, setFavoriteLoading] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true)
      const { data } = await supabase
        .from("products")
        .select("*, inventory:inventory(quantity, branch_id)")
        .eq("id", productId)
        .single()
      setProduct(data as Product)
      setLoading(false)
    }
    fetchProduct()
  }, [productId])

  // Check if this product is a favorite for the current user
  useEffect(() => {
    if (!user || !product) return
    const checkFavorite = async () => {
      const { data } = await supabase
        .from('favorite_products')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single()
      if (data && data.id) {
        setIsFavorite(true)
        setFavoriteId(data.id)
      } else {
        setIsFavorite(false)
        setFavoriteId(null)
      }
    }
    checkFavorite()
  }, [user, product])

  // Handle favorite toggle
  const handleToggleFavorite = async () => {
    if (!user || !product) return
    setFavoriteLoading(true)
    if (isFavorite && favoriteId) {
      // Remove favorite
      await supabase.from('favorite_products').delete().eq('id', favoriteId)
      setIsFavorite(false)
      setFavoriteId(null)
      addNotification({
        title: 'Removed from Favorites',
        message: `${product.name} has been removed from your favorites`,
        type: 'info'
      });
    } else {
      // Add favorite
      const { data, error } = await supabase.from('favorite_products').insert({ user_id: user.id, product_id: product.id }).select('id').single()
      if (!error && data && data.id) {
        setIsFavorite(true)
        setFavoriteId(data.id)
        addNotification({
          title: 'Added to Favorites',
          message: `${product.name} has been added to your favorites`,
          type: 'success'
        });
      }
    }
    setFavoriteLoading(false)
  }

  if (loading) return <div className="text-center py-20 text-gray-500">Loading product...</div>
  if (!product) return <div className="text-center py-20 text-red-500">Product not found.</div>

  // Parse JSON fields
  let keyFeatures: any = {}
  let bundleProducts: any[] = []
  let relatedProducts: any[] = []
  
  try { if (product.key_features) keyFeatures = JSON.parse(product.key_features) } catch {}
  try { if (product.bundle_products) bundleProducts = JSON.parse(product.bundle_products) } catch {}
  try { if (product.related_products) relatedProducts = JSON.parse(product.related_products) } catch {}
  
  // Get product image from storage
  const imageSrc = getProductImageUrl(product.name, product.updated_at || Date.now());

  const manufacturer = product.manufacturer || "Unknown"
  const genericName = product.generic_name || null
  const price = typeof product.price === "number" ? product.price : 0
  const originalPrice = typeof product.original_price === "number" ? product.original_price : null
  const prescriptionRequired = !!product.prescription_required
  const category = product.category || "Other"

  const handleAddToCart = () => {
    if (!product) return
    
    if (prescriptionRequired) {
      if (!user) {
        addNotification({
          title: 'Login Required',
          message: 'Please log in to purchase prescription medications',
          type: 'warning',
        })
        return
      }
      
      if (!hasPrescription) {
        addNotification({
          title: 'Prescription Required',
          message: 'Please upload your prescription first',
          type: 'warning',
        })
        window.location.href = '/prescriptions'
        return
      }
      
      if (!isApproved) {
        addNotification({
          title: 'Prescription Pending',
          message: 'Your prescription is being reviewed. Please wait for approval.',
          type: 'warning',
        })
        return
      }
    }
    
    const result = addToCart({
      id: product.id,
      name: product.name,
      price: price,
      image: getProductImageUrl(product.name, product.updated_at || Date.now()),
      quantity: quantity,
      prescriptionRequired: prescriptionRequired
    })

    // Show appropriate notification based on action type
    if (result.type === 'ADD') {
      addNotification({
        title: 'Added to Cart',
        message: `${product.name} has been added to your cart`,
        type: 'success'
      })
    } else if (result.type === 'UPDATE') {
      addNotification({
        title: 'Cart Updated', 
        message: `Updated quantity of ${product.name} in your cart`,
        type: 'success'
      })
    }
  }

  const totalStock = (product?.inventory || []).reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  const inStock = totalStock > 0;

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gradient-to-b from-white to-gray-50">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gray-900">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${category}`} className="hover:text-gray-900">{category}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-4 border border-gray-100">
                <img
                  src={imageSrc || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-500">{manufacturer}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">Reg No: {product.registration_number || '-'}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">Barcode: {product.barcode || '-'}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-light mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg mb-4">
                  {genericName} {product.strength && `• ${product.strength}`} • {product.pack_size}
                </p>
                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-light text-gray-900">
                    {price.toLocaleString('vi-VN')}₫
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                        Save {Math.round(((originalPrice - price) / originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>
              {/* Prescription Alert */}
              {prescriptionRequired && (
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Prescription Required:</strong> This medication requires a valid prescription from a licensed healthcare provider. Upload your prescription or consult with our pharmacist.
                  </AlertDescription>
                </Alert>
              )}

              {/* Key Features */}
              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-8 flex items-center justify-between p-4 bg-green-50 rounded-xl">
                {inStock ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <span className="font-medium text-green-900">In Stock</span>
                      <p className="text-sm text-green-700">Available at Long Chau branches</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <span className="font-medium text-red-900">Out of Stock</span>
                      <p className="text-sm text-red-700">Currently unavailable</p>
                    </div>
                  </div>
                )}
              </div>
              {/* Branch Stock Table */}
              {Array.isArray(product.inventory) && product.inventory.length > 0 && (
                <div className="mb-8">
                  <table className="w-full text-sm border rounded-xl overflow-hidden">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-2 font-medium text-gray-600">Branch</th>
                        <th className="text-right px-4 py-2 font-medium text-gray-600">Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.inventory.map((inv, idx) => (
                        <tr key={inv.branch_id} className="border-t">
                          <td className="px-4 py-2">{branchIdToName[inv.branch_id] || `Branch #${inv.branch_id}`}</td>
                          <td className="px-4 py-2 text-right">{inv.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Add to Cart Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-full">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-xl font-medium">{(price * quantity).toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!inStock || (prescriptionRequired && (!user || !hasPrescription || !isApproved))}
                    className="rounded-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg flex-1"
                  >
                    {prescriptionRequired ? (
                      <>
                        {!user ? "Login to Buy" :
                         !hasPrescription ? "Upload Prescription" :
                         !isApproved ? "Prescription Pending" :
                         "Add to Cart"}
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                  {/* Favorite Button with state, fixed Tooltip usage */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant={isFavorite ? "default" : "outline"}
                          size="icon"
                          className={`rounded-full w-14 h-14 flex items-center justify-center ${isFavorite ? "bg-red-100 hover:bg-red-200" : ""}`}
                          aria-label={user ? (isFavorite ? "Remove from Favorites" : "Add to Favorites") : "Log in to favorite"}
                          onClick={async () => {
                            if (!user) {
                              window.location.href = "/account";
                              return;
                            }
                            await handleToggleFavorite();
                          }}
                          disabled={favoriteLoading}
                        >
                          {favoriteLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                          ) : (
                            <Heart className={`h-5 w-5 transition-colors duration-200 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        {user ? (isFavorite ? "Remove from Favorites" : "Add to Favorites") : "Log in to favorite"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Express Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="rounded-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Pharmacist
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Support
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-4 gap-4 py-6 mt-8 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">100% Authentic</p>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">24/7 Support</p>
                </div>
                <div className="text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">Secure Package</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section and Details Tabs */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Enhanced Section Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300"></div>
              <span className="text-sm uppercase tracking-wider text-gray-500 font-medium">Product Information</span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300"></div>
            </div>
            <h2 className="font-playfair text-5xl md:text-6xl font-light text-gray-900 mb-4">
              <span className="italic text-gray-600">Comprehensive</span><br />
              <span className="text-gray-900">Details</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about this product, from ingredients to usage guidelines
            </p>
          </motion.div>

          <Tabs defaultValue="details" className="max-w-6xl mx-auto">
            <TabsList className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-12 shadow-lg border border-gray-100 flex justify-center">
              <TabsTrigger 
                value="details" 
                className="flex-1 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Details
              </TabsTrigger>
              <TabsTrigger 
                value="highlights" 
                className="flex-1 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                Highlights
              </TabsTrigger>
              <TabsTrigger 
                value="faq" 
                className="flex-1 rounded-xl font-medium transition-all duration-300 data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=active]:shadow-md"
              >
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-light text-gray-900 mb-8">Product Details</h3>
                <dl className="divide-y divide-gray-200">
                  {product.active_ingredient && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Active Ingredient</dt>
                      <dd className="flex-1 text-gray-900">{product.active_ingredient}</dd>
                    </div>
                  )}
                  {product.mechanism_of_action && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Mechanism of Action</dt>
                      <dd className="flex-1 text-gray-900">{product.mechanism_of_action}</dd>
                    </div>
                  )}
                  {product.category && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Therapeutic Category</dt>
                      <dd className="flex-1 text-gray-900">{product.category}</dd>
                    </div>
                  )}
                  {product.storage && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Storage</dt>
                      <dd className="flex-1 text-gray-900">{product.storage}</dd>
                    </div>
                  )}
                  {product.warranty && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Warranty</dt>
                      <dd className="flex-1 text-gray-900">{product.warranty}</dd>
                    </div>
                  )}
                  {product.pregnancy_category && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Pregnancy Category</dt>
                      <dd className="flex-1 text-gray-900">{product.pregnancy_category}</dd>
                    </div>
                  )}
                  {product.lactation && (
                    <div className="py-4 flex flex-col md:flex-row md:items-center md:gap-4">
                      <dt className="w-48 text-gray-500 text-sm">Lactation</dt>
                      <dd className="flex-1 text-gray-900">{product.lactation}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </TabsContent>

            {/* Highlights Tab */}
            <TabsContent value="highlights" className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="max-w-3xl mx-auto">
                <h3 className="text-2xl font-light text-gray-900 mb-8">Effective treatment, proven results</h3>
                <div className="mb-8">
                  <h4 className="text-lg font-medium mb-3">Recommended For</h4>
                  <ul className="space-y-2">
                    {(() => {
                      let indicationsArr: string[] = [];
                      if (Array.isArray(product.indications)) {
                        indicationsArr = product.indications;
                      } else if (typeof product.indications === 'string') {
                        indicationsArr = product.indications.split(/\n|,/).map(s => s.trim()).filter(Boolean);
                      }
                      return indicationsArr.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ));
                    })()}
                  </ul>
                </div>
                {product.quality_features && (
                  <div>
                    <h4 className="text-lg font-medium mb-3">Quality Assurance</h4>
                    <div className="grid grid-cols-2 gap-4">
                      {(() => {
                        let features = [];
                        try { features = JSON.parse(product.quality_features); } catch {}
                        return features.map((feature: any, index: number) => (
                          <div key={index} className="flex items-center gap-3">
                            {feature.icon && typeof feature.icon === 'string' ? null : feature.icon && <feature.icon className="h-5 w-5 text-gray-700" />} {/* fallback if icon is a component */}
                            <span className="text-sm text-gray-600">{feature.text}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Enhanced FAQ Tab */}
            <TabsContent value="faq" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden"
              >
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-blue-50 via-white to-blue-50 p-8 border-b border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm uppercase tracking-wider text-gray-500 font-medium">Frequently Asked</span>
                  </div>
                  <h3 className="font-playfair text-2xl font-light text-gray-900">Questions & Answers</h3>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {[
                      { 
                        icon: Package,
                        question: "How should I store this product?", 
                        answer: product.storage || "Store in a cool, dry place away from direct sunlight. Keep out of reach of children.",
                        color: "emerald"
                      },
                      { 
                        icon: Shield,
                        question: "Is this medication safe during pregnancy?", 
                        answer: product.pregnancy_category || "Consult your doctor before use during pregnancy.",
                        color: "rose"
                      },
                      { 
                        icon: Info,
                        question: "Is this medication safe during breastfeeding?", 
                        answer: product.lactation || "Consult your doctor before use while breastfeeding.",
                        color: "violet"
                      },
                      { 
                        icon: CheckCircle,
                        question: "What warranty or guarantee comes with this product?", 
                        answer: product.warranty || "All medications are 100% authentic and sourced directly from licensed manufacturers. We guarantee product quality until expiry date when stored properly.",
                        color: "blue"
                      },
                    ].map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="group"
                      >
                        <div className="relative overflow-hidden rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group-hover:border-gray-200">
                          <div className="p-6">
                            <div className="flex items-start gap-4">
                              <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-${faq.color}-50 flex items-center justify-center text-${faq.color}-600 group-hover:bg-${faq.color}-100 transition-colors duration-300`}>
                                <faq.icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold mb-3 text-gray-900 group-hover:text-gray-800 transition-colors">
                                  {faq.question}
                                </h4>
                                <p className="text-gray-600 leading-relaxed">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-${faq.color}-400 to-${faq.color}-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Enhanced Contact Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="mt-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-white to-blue-50 border border-blue-100"
                  >
                    <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] opacity-20"></div>
                    <div className="relative p-8">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
                          <Phone className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold text-gray-900 mb-2">
                            Need Expert Advice?
                          </h4>
                          <p className="text-gray-600 mb-4 leading-relaxed">
                            Our licensed pharmacists are available 24/7 to provide personalized guidance and answer your questions.
                          </p>
                          <div className="flex flex-wrap gap-3">
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                              <Phone className="h-4 w-4 text-blue-600" />
                              <span className="font-medium text-gray-900">1900 6928</span>
                            </div>
                            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                              <MessageCircle className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900">Live Chat</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}