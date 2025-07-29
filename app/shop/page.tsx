"use client"

import { ArrowLeft, ArrowRight, ChevronDown, Shield, Clock, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase/client"
import { useNotification } from '@/contexts/NotificationContext'

// Helper function to get product image URL from storage
function getProductImageUrl(productName: string): string {
  const { data } = supabase.storage.from('product-images').getPublicUrl(`${productName}.png`)
  return data.publicUrl
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
}

export default function ShopPage() {
  const { addToCart } = useCart()
  const { addNotification } = useNotification()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState("featured")
  const productsPerPage = 9

  // Filter state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedPrescription, setSelectedPrescription] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [pendingFilters, setPendingFilters] = useState(false)

  // All filter options (could be dynamic from DB, but static for now)
  const categoryOptions = [
    "Pain Relief",
    "Antibiotics",
    "Vitamins & Supplements",
    "Digestive Health",
    "Allergy & Respiratory",
    "Medical Devices",
    "Personal Protection",
    "Cough & Cold"
  ]
  const brandOptions = [
    "DHG Pharma",
    "Imexpharm",
    "OPV",
    "Domesco",
    "Blackmores",
    "Centrum",
    "Stada",
    "Bayer",
    "Sanofi",
    "Merck",
    "BioGaia",
    "Nature Made",
    "Strepsils"
  ]
  const priceRanges = [
    { label: "Under 50,000₫", value: "under-50000" },
    { label: "50,000₫ - 200,000₫", value: "50000-200000" },
    { label: "Above 200,000₫", value: "above-200000" }
  ]

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
    if (selectedPriceRanges.length > 0) {
      query = query.or(selectedPriceRanges.map(val => {
        if (val === "under-50000") return "price.lt.50000"
        if (val === "50000-200000") return "and(price.gte.50000,price.lte.200000)"
        if (val === "above-200000") return "price.gt.200000"
        return ""
      }).join(","))
    }
    // Sort
    if (sort === "price-asc") query = query.order("price", { ascending: true })
    else if (sort === "price-desc") query = query.order("price", { ascending: false })
    else if (sort === "name-asc") query = query.order("name", { ascending: true })
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
  }, [sort])

  // Handlers for checkboxes
  function handleCheckboxChange(option: string, selected: string[], setSelected: (v: string[]) => void) {
    setSelected(selected.includes(option) ? selected.filter(v => v !== option) : [...selected, option])
    setPendingFilters(true)
  }

  // Handler for prescription (single select)
  function handlePrescriptionChange(option: string) {
    setSelectedPrescription(selectedPrescription.includes(option) ? [] : [option])
    setPendingFilters(true)
  }

  // Handler for price range (multi-select)
  function handlePriceRangeChange(option: string) {
    setSelectedPriceRanges(selectedPriceRanges.includes(option) ? selectedPriceRanges.filter(v => v !== option) : [...selectedPriceRanges, option])
    setPendingFilters(true)
  }

  const totalPages = Math.ceil(products.length / productsPerPage)
  const paginatedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  )

  const handleAddToCart = (product: any) => {
    if (product.inventory && product.inventory.length > 0 && !product.prescription_required) {
      const result = addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImageUrl(product.name),
        quantity: 1,
        prescriptionRequired: product.prescription_required
      })

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
    } else if (product.prescription_required) {
      window.location.href = `/shop/${product.id}`
    }
  }

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

              <Collapsible>
                <CollapsibleTrigger className="flex items-center justify-between w-full text-left font-medium py-2 border-b border-gray-200">
                  <span>PRICE RANGE</span>
                  <ChevronDown className="h-4 w-4" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 pb-2">
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <div className="flex items-center" key={range.value}>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                            checked={selectedPriceRanges.includes(range.value)}
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
                onClick={() => { fetchProductsWithFilters(); setPendingFilters(false); }}
                disabled={!pendingFilters}
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
                value={sort}
                onChange={e => { setSort(e.target.value); setCurrentPage(1) }}
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
                {paginatedProducts.map((product) => (
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
                              src={getProductImageUrl(product.name) || "/placeholder.svg"}
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
                        <div className="flex items-center justify-between mb-3 mt-auto">
                          <div>
                            <p className="text-lg font-medium text-gray-900">
                              {Number(product.price).toLocaleString('vi-VN')}₫
                            </p>
                            {product.original_price && (
                              <p className="text-sm text-gray-500 line-through">
                                {Number(product.original_price).toLocaleString('vi-VN')}₫
                              </p>
                            )}
                          </div>
                          {/* Calculate total stock for each product */}
                          {product.inventory && product.inventory.length > 0 ? (
                            <div className="text-right">
                              <span className="text-xs text-green-600">In Stock</span>
                            </div>
                          ) : (
                            <div className="text-right">
                              <span className="text-xs text-red-600">Out of Stock</span>
                            </div>
                          )}
                        </div>
                        <Button 
                          className="w-full rounded-full text-sm mt-2"
                          variant={product.inventory && product.inventory.length > 0 ? "default" : "outline"}
                          disabled={!(product.inventory && product.inventory.length > 0)}
                          onClick={() => handleAddToCart(product)}
                        >
                          {product.inventory && product.inventory.length > 0 ? (product.prescription_required ? "Upload Prescription" : "Add to Cart") : "Notify Me"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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