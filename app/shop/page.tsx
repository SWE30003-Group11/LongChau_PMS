"use client"

import { ArrowLeft, ArrowRight, ChevronDown, Shield, Clock, Truck, CreditCard } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useCart } from "@/hooks/use-cart"

// Mock pharmacy product data
const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    price: 25000,
    originalPrice: 30000,
    image: "/products/paracetamol.jpg",
    category: "Pain Relief",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "DHG Pharma",
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    price: 85000,
    image: "/products/amoxicillin.jpg",
    category: "Antibiotics",
    prescriptionRequired: true,
    inStock: true,
    manufacturer: "Imexpharm",
  },
  {
    id: 3,
    name: "Vitamin C 1000mg",
    genericName: "Ascorbic Acid",
    price: 45000,
    originalPrice: 50000,
    image: "/products/vitaminc.jpg",
    category: "Vitamins & Supplements",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "Blackmores",
  },
  {
    id: 4,
    name: "Omeprazole 20mg",
    genericName: "Omeprazole",
    price: 120000,
    image: "/products/omeprazole.jpg",
    category: "Digestive Health",
    prescriptionRequired: true,
    inStock: false,
    manufacturer: "OPV",
  },
  {
    id: 5,
    name: "Cetirizine 10mg",
    genericName: "Cetirizine Hydrochloride",
    price: 35000,
    image: "/products/cetirizine.jpg",
    category: "Allergy & Respiratory",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "Domesco",
  },
  {
    id: 6,
    name: "Blood Pressure Monitor",
    price: 850000,
    originalPrice: 1000000,
    image: "/products/bp-monitor.jpg",
    category: "Medical Devices",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "Omron",
  },
  {
    id: 7,
    name: "N95 Face Masks (Box of 20)",
    price: 150000,
    image: "/products/n95-masks.jpg",
    category: "Personal Protection",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "3M",
  },
  {
    id: 8,
    name: "Hand Sanitizer 500ml",
    price: 45000,
    image: "/products/sanitizer.jpg",
    category: "Personal Protection",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "Purell",
  },
  {
    id: 9,
    name: "Multivitamin Complex",
    price: 280000,
    image: "/products/multivitamin.jpg",
    category: "Vitamins & Supplements",
    prescriptionRequired: false,
    inStock: true,
    manufacturer: "Centrum",
  },
]

// Group products by category
const productsByCategory = products.reduce(
  (acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  },
  {} as Record<string, typeof products>,
)

export default function ShopPage() {
  const { addToCart } = useCart()
  
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
                    {Object.keys(productsByCategory).map((category) => (
                      <div key={category} className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <span className="ml-2 text-sm">{category}</span>
                          <span className="ml-auto text-xs text-gray-500">({productsByCategory[category].length})</span>
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
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                        <span className="ml-2 text-sm">No Prescription Required</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                        <span className="ml-2 text-sm">Prescription Required</span>
                      </label>
                    </div>
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
                    {["DHG Pharma", "Imexpharm", "OPV", "Domesco", "Blackmores", "Centrum"].map((brand) => (
                      <div key={brand} className="flex items-center">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                          <span className="ml-2 text-sm">{brand}</span>
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
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                        <span className="ml-2 text-sm">Under 50,000₫</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                        <span className="ml-2 text-sm">50,000₫ - 200,000₫</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <label className="flex items-center cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                        <span className="ml-2 text-sm">Above 200,000₫</span>
                      </label>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort and View Options */}
            <div className="flex justify-between items-center mb-8">
              <p className="text-sm text-gray-600">Showing {products.length} products</p>
              <select className="border border-gray-200 rounded-full px-4 py-2 text-sm">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name: A to Z</option>
              </select>
            </div>

            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <div key={category} className="mb-16">
                <div className="mb-8">
                  <h2 className="text-2xl font-light mb-2">
                    <span className="italic">{category}</span>
                  </h2>
                  <div className="h-px w-24 bg-gradient-to-r from-gray-400 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product) => (
                    <div key={product.id} className="group">
                      <div className="bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        {/* Product badges */}
                        <div className="relative">
                          {product.originalPrice && (
                            <div className="absolute top-4 left-4 z-10">
                              <span className="inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                          {product.prescriptionRequired && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className="inline-block bg-blue-500 text-white text-xs px-3 py-1 rounded-full">
                                Rx Required
                              </span>
                            </div>
                          )}
                          
                          <Link href={`/shop/${product.id}`}>
                            <div className="aspect-w-1 aspect-h-1 bg-gray-50 p-8">
                              <img
                                src={product.image || "/placeholder.svg"}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </Link>
                        </div>
                        
                        <div className="p-4">
                          <p className="text-xs text-gray-500 mb-1">{product.manufacturer}</p>
                          <h3 className="text-sm font-medium mb-1">{product.name}</h3>
                          {product.genericName && (
                            <p className="text-xs text-gray-600 mb-3">({product.genericName})</p>
                          )}
                          
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-lg font-medium text-gray-900">
                                {product.price.toLocaleString('vi-VN')}₫
                              </p>
                              {product.originalPrice && (
                                <p className="text-sm text-gray-500 line-through">
                                  {product.originalPrice.toLocaleString('vi-VN')}₫
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {product.inStock ? (
                                <span className="text-xs text-green-600">In Stock</span>
                              ) : (
                                <span className="text-xs text-red-600">Out of Stock</span>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            className="w-full rounded-full text-sm"
                            variant={product.inStock ? "default" : "outline"}
                            disabled={!product.inStock}
                            onClick={() => {
                              if (product.inStock && !product.prescriptionRequired) {
                                // Simple add to cart for non-prescription items
                                addToCart({
                                  id: product.id,
                                  name: product.name,
                                  price: product.price,
                                  image: product.image,
                                  quantity: 1,
                                  prescriptionRequired: product.prescriptionRequired
                                })
                              } else if (product.prescriptionRequired) {
                                // Navigate to product detail page for prescription items
                                window.location.href = `/shop/${product.id}`
                              }
                            }}
                          >
                            {product.inStock ? (product.prescriptionRequired ? "Upload Prescription" : "Add to Cart") : "Notify Me"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="rounded-full px-4">1</Button>
              <Button variant="outline" className="rounded-full px-4">2</Button>
              <Button variant="outline" className="rounded-full px-4">3</Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}