"use client"

import { ArrowLeft, ArrowRight, ChevronDown, Shield, Clock, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { NotificationProvider, useNotification } from '@/contexts/NotificationContext'
import { usePrescription } from "@/hooks/use-prescription"
import { useAuth } from "@/contexts/AuthContext"

// Helper function to get product image URL from storage
function getProductImageUrl(productName: string, updatedAt?: string | number): string {
  const { data } = supabase.storage.from('product-images').getPublicUrl(`${productName}.png`)
  // Use updatedAt if available, else fallback to Date.now()
  const cacheBuster = updatedAt ? `?t=${updatedAt}` : `?t=${Date.now()}`;
  return data.publicUrl + cacheBuster;
}

// Define Product type for Supabase data
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
  inventory?: { quantity: number }[]
  updated_at?: string | number
}

export default function ShopPage() {
  const { addToCart } = useCart()
  const { addNotification } = useNotification()
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("name")
  const [currentPage, setCurrentPage] = useState(1)
  const [categoryOptions, setCategoryOptions] = useState<string[]>([])
  const [brandOptions, setBrandOptions] = useState<string[]>([])
  const [totalProducts, setTotalProducts] = useState(0)
  const [productPrescriptionStatus, setProductPrescriptionStatus] = useState<Record<number, { hasPrescription: boolean; isApproved: boolean }>>({})

  // Get prescription status for all products at once
  const { hasPrescription: generalHasPrescription, isApproved: generalIsApproved } = usePrescription()

  // Fetch prescription status for all products
  useEffect(() => {
    async function fetchPrescriptionStatus() {
      if (!user) return

      try {
        const { data: prescriptions, error } = await supabase
          .from('prescriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'approved')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching prescriptions:', error)
          return
        }

        // Create a map of product ID to prescription status
        const statusMap: Record<number, { hasPrescription: boolean; isApproved: boolean }> = {}
        
        // For each product, check if any prescription includes it
        products.forEach(product => {
          const hasApprovedPrescriptionForProduct = prescriptions?.some(p => 
            p.selected_products && 
            p.selected_products.includes(product.id)
          ) || false

          statusMap[product.id] = {
            hasPrescription: hasApprovedPrescriptionForProduct,
            isApproved: hasApprovedPrescriptionForProduct
          }
        })

        setProductPrescriptionStatus(statusMap)
      } catch (error) {
        console.error('Error checking prescription status:', error)
      }
    }

    fetchPrescriptionStatus()
  }, [user, products])

  // Function to check prescription status for a specific product
  const getPrescriptionStatus = (productId: number) => {
    return productPrescriptionStatus[productId] || {
      hasPrescription: false,
      isApproved: false
    }
  }

  // Fetch filter options from DB
  useEffect(() => {
    async function fetchOptions() {
      const { data: catData } = await supabase.from("products").select("category").neq("category", null)
      const { data: brandData } = await supabase.from("products").select("manufacturer").neq("manufacturer", null)
      setCategoryOptions(Array.from(new Set((catData || []).map((c: any) => c.category).filter(Boolean))))
      setBrandOptions(Array.from(new Set((brandData || []).map((b: any) => b.manufacturer).filter(Boolean))))
    }
    fetchOptions()
  }, [])

  // Filtering logic
  async function fetchProductsWithFilters() {
    setLoading(true)
    let query = supabase.from("products").select("*, inventory:inventory(quantity)")
    // Category
    if (selectedCategories.length > 0) {
      query = query.in("category", selectedCategories)
    }
    // Brand
    if (selectedBrands.length > 0) {
      query = query.in("manufacturer", selectedBrands)
    }
    // Prescription
    if (selectedPrescription.length === 1) {
      if (selectedPrescription[0] === "No Prescription Required") query = query.eq("prescription_required", false)
      if (selectedPrescription[0] === "Prescription Required") query = query.eq("prescription_required", true)
    }
    // Price
    if (priceRange.length > 0) {
      query = query.or(priceRange.map(val => {
        if (val === "under-50000") return "price.lt.50000"
        if (val === "50000-200000") return "and(price.gte.50000,price.lte.200000)"
        if (val === "above-200000") return "price.gt.200000"
        return ""
      }).join(","))
    }
    // Sort
    if (sortBy === "price-asc") query = query.order("price", { ascending: true })
    else if (sortBy === "price-desc") query = query.order("price", { ascending: false })
    else if (sortBy === "name-asc") query = query.order("name", { ascending: true })
    else query = query.order("id", { ascending: false })
    const { data, error } = await query
    if (!error) setProducts((data as Product[]) || [])
    setLoading(false)
    setCurrentPage(1)
  }

  // Initial fetch and sort
  useEffect(() => {
    fetchProductsWithFilters()
    // eslint-disable-next-line
  }, [sortBy])

  // Handlers for checkboxes
  function handleCheckboxChange(option: string, selected: string[], setSelected: (v: string[]) => void) {
    setSelected(selected.includes(option) ? selected.filter(v => v !== option) : [...selected, option])
  }

  // Handler for prescription (single select)
  function handlePrescriptionChange(option: string) {
    setSelectedPrescription(selectedPrescription.includes(option) ? [] : [option])
  }

  // Handler for price range (multi-select)
  function handlePriceRangeChange(option: string) {
    setPriceRange(priceRange.includes(option) ? priceRange.filter(v => v !== option) : [...priceRange, option])
  }

  // Calculate pagination
  const totalPages = Math.ceil(products.length / 9)
  const paginatedProducts = products.slice(
    (currentPage - 1) * 9,
    currentPage * 9
  )

  // Replace priceRanges in the filter UI
  const priceRangeOptions = [
    { label: "Under 50,000₫", value: "under-50000" },
    { label: "50,000₫ - 200,000₫", value: "50000-200000" },
    { label: "Above 200,000₫", value: "above-200000" }
  ];

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-[100vh]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/banner/shop.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20"></div>
        </div>

         <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-7xl font-light text-white mb-4">QUALITY</h1>
                <h2 className="text-5xl md:text-7xl font-light italic text-white/90 mb-6">healthcare products</h2>
                <p className="text-white/80 text-lg font-light">
                  Trusted pharmaceutical products and medical supplies from Vietnam's leading brands
                </p>
              </div>

              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h3 className="text-xl font-medium mb-4">
                  Need a <span className="italic">Prescription?</span>
                </h3>
                <p className="text-gray-600 text-sm mb-6">
                  Upload your prescription or consult with our licensed pharmacists online for quick approval and safe medication dispensing.
                </p>
                <Button asChild className="w-full bg-gray-900 hover:bg-gray-800 rounded-full">
                  <Link href="/prescriptions">UPLOAD PRESCRIPTION</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Shield className="h-8 w-8 mx-auto mb-2 text-gray-700" />
              <p className="text-sm font-medium">Licensed Pharmacy</p>
              <p className="text-xs text-gray-600">Ministry of Health Certified</p>
            </div>
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-700" />
              <p className="text-sm font-medium">24/7 Support</p>
              <p className="text-xs text-gray-600">Pharmacist Consultation</p>
            </div>
            <div className="text-center">
              <Truck className="h-8 w-8 mx-auto mb-2 text-gray-700" />
              <p className="text-sm font-medium">Same Day Delivery</p>
              <p className="text-xs text-gray-600">Within Ho Chi Minh City</p>
            </div>
            <div className="text-center">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-700" />
              <p className="text-sm font-medium">Secure Payment</p>
              <p className="text-xs text-gray-600">Multiple Options Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shop Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full md:w-64 flex-shrink-0">
            <h3 className="text-sm font-medium uppercase tracking-wider mb-6">FILTERS</h3>

            <div className="space-y-6">
              {categoryOptions.length > 0 && (
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b border-gray-200">
                    <span>CATEGORY</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 pb-2">
                    <div className="space-y-2">
                      {categoryOptions.map(option => (
                        <div className="flex items-center" key={option}>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                              checked={selectedCategories.includes(option)}
                              onChange={() => handleCheckboxChange(option, selectedCategories, setSelectedCategories)}
                            />
                            <span className="ml-2 text-sm">{option}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b border-gray-200">
                  <span>PRESCRIPTION</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 pb-2">
                  <div className="space-y-2">
                    {["No Prescription Required", "Prescription Required"].map(option => (
                      <div className="flex items-center" key={option}>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            checked={selectedPrescription.includes(option)}
                            onChange={() => handlePrescriptionChange(option)}
                          />
                          <span className="ml-2 text-sm">{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {brandOptions.length > 0 && (
                <Collapsible>
                  <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b border-gray-200">
                    <span>BRAND</span>
                    <ChevronDown className="h-4 w-4" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-4 pb-2">
                    <div className="space-y-2">
                      {brandOptions.map(option => (
                        <div className="flex items-center" key={option}>
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                              checked={selectedBrands.includes(option)}
                              onChange={() => handleCheckboxChange(option, selectedBrands, setSelectedBrands)}
                            />
                            <span className="ml-2 text-sm">{option}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b border-gray-200">
                  <span>PRICE RANGE</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 pb-2">
                  <div className="space-y-2">
                    {priceRangeOptions.map(range => (
                      <div className="flex items-center" key={range.value}>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            checked={priceRange.includes(range.value)}
                            onChange={() => handlePriceRangeChange(range.value)}
                          />
                          <span className="ml-2 text-sm">{range.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>

              {/* Filter Button */}
              <Button
                className="w-full rounded-full mt-4"
                onClick={() => { fetchProductsWithFilters(); }}
              >
                Filter
              </Button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-gray-600">Showing {products.length} products</p>
              <select
                className="border border-gray-200 rounded-full px-4 py-2 text-sm"
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setCurrentPage(1) }}
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => {
                  const { hasPrescription, isApproved } = getPrescriptionStatus(product.id)
                  
                  return (
                    <div key={product.id} className="group h-full">
                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                        {/* Product badges */}
                        <div className="relative">
                          {product.original_price && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                -{product.original_price ? Math.round(((product.original_price - product.price) / product.original_price) * 100) : 0}%
                              </span>
                            </div>
                          )}
                          {product.prescription_required && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                                Rx Required
                              </span>
                            </div>
                          )}
                          <Link href={`/shop/${product.id}`}>
                            <div className="w-full h-56 bg-gray-50 flex items-center justify-center">
                              <img
                                src={getProductImageUrl(product.name, product.updated_at) || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                          </Link>
                        </div>
                        <div className="flex flex-col flex-1 p-4">
                          {product.manufacturer && <p className="text-xs text-gray-500 mb-1">{product.manufacturer}</p>}
                          <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                          {product.generic_name && (
                            <p className="text-xs text-gray-600 mb-3">({product.generic_name})</p>
                          )}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {product.inventory && product.inventory.length > 0 ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                          <div className="mt-auto">
                            <Button
                              className="w-full rounded-full text-sm"
                              variant={product.inventory && product.inventory.length > 0 ? "default" : "outline"}
                              disabled={!(product.inventory && product.inventory.length > 0)}
                              onClick={() => {
                                if (product.prescription_required) {
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

                                  // Prescription is approved, add to cart
                                  addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: getProductImageUrl(product.name, product.updated_at),
                                    quantity: 1,
                                    prescriptionRequired: product.prescription_required
                                  })
                                  addNotification({
                                    title: 'Added to Cart',
                                    message: `${product.name} has been added to your cart`,
                                    type: 'success',
                                  })
                                } else if (product.inventory && product.inventory.length > 0) {
                                  addToCart({
                                    id: product.id,
                                    name: product.name,
                                    price: product.price,
                                    image: getProductImageUrl(product.name, product.updated_at),
                                    quantity: 1,
                                    prescriptionRequired: product.prescription_required
                                  })
                                  addNotification({
                                    title: 'Added to Cart',
                                    message: `${product.name} has been added to your cart`,
                                    type: 'success',
                                  })
                                }
                              }}
                            >
                              {product.inventory && product.inventory.length > 0 ? (
                                product.prescription_required ? (
                                  !user ? "Login to Buy" :
                                  !hasPrescription ? "Upload Prescription" :
                                  !isApproved ? "Prescription Pending" :
                                  "Add to Cart"
                                ) : "Add to Cart"
                              ) : "Out of Stock"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              {[...Array(totalPages)].map((_, idx) => (
                <Button
                  key={idx + 1}
                  variant={currentPage === idx + 1 ? "default" : "outline"}
                  className="rounded-full px-4"
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}