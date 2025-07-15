"use client"

import { Shield, Heart } from "lucide-react"
import { useState } from "react"

export default function ProductShowcase() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  const cardImages = [
    "/home/licensed-pharmacist.jpeg",
    "/home/genuine-products.png"
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">
              QUALITY HEALTHCARE,
              <br />
              TRUSTED SERVICE
            </h2>

            <p className="text-gray-600 max-w-md">
              From prescription medications to wellness products, we provide comprehensive pharmaceutical care with professional expertise you can trust.
            </p>

            <h3 className="text-5xl md:text-7xl font-light italic text-gray-700">pharmacy.</h3>
          </div>

          <div className="relative">
            {/* Main image container */}
            <div className="relative z-0">
              <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
                <img
                  src="/home/pharmacist.jpeg"
                  alt="Pharmacy Service"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Cards container - using grid for better control */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div 
                className="bg-white p-6 rounded-lg shadow-lg relative cursor-pointer transition-all hover:shadow-xl"
                onMouseEnter={() => setHoveredCard(0)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={handleMouseMove}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Shield className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
                <h4 className="text-center font-medium mb-2">Licensed Pharmacists</h4>
                <p className="text-sm text-center text-gray-600">
                  Every Long Chau location is staffed with licensed pharmacists ready to provide professional consultation and medication guidance.
                </p>
                
                {/* Hover image */}
                {hoveredCard === 0 && (
                  <div 
                    className="fixed pointer-events-none z-50 w-32 h-32 rounded-lg overflow-hidden shadow-2xl transition-opacity duration-200"
                    style={{
                      left: `${mousePosition.x}px`,
                      top: `${mousePosition.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <img 
                      src={cardImages[0]} 
                      alt="Licensed Pharmacist"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Card 2 */}
              <div 
                className="bg-white p-6 rounded-lg shadow-lg relative cursor-pointer transition-all hover:shadow-xl"
                onMouseEnter={() => setHoveredCard(1)}
                onMouseLeave={() => setHoveredCard(null)}
                onMouseMove={handleMouseMove}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
                <h4 className="text-center font-medium mb-2">Genuine Products</h4>
                <p className="text-sm text-center text-gray-600">
                  All medications and healthcare products are sourced directly from certified manufacturers, ensuring authenticity and quality.
                </p>
                
                {/* Hover image */}
                {hoveredCard === 1 && (
                  <div 
                    className="fixed pointer-events-none z-50 w-32 h-32 rounded-lg overflow-hidden shadow-2xl transition-opacity duration-200"
                    style={{
                      left: `${mousePosition.x}px`,
                      top: `${mousePosition.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <img 
                      src={cardImages[1]} 
                      alt="Genuine Products"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}