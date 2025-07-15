import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">EXPLORE OUR</h2>
          <h3 className="text-4xl md:text-6xl font-light italic text-gray-700">product categories</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/home/prescription-medicines.png')" }}
              ></div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-4xl font-light text-gray-900">Prescription</h3>
            <h4 className="text-4xl font-light italic text-gray-700">Medicines</h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {[
                { name: "Antibiotics", count: "150+ products" },
                { name: "Cardiovascular", count: "200+ products" },
                { name: "Diabetes Care", count: "100+ products" }
              ].map((item, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 relative">
                  <div className="bg-white text-xs px-3 py-1 rounded-full inline-block mb-4">PRESCRIPTION</div>
                  <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('/home/category-${index + 1}.jpg')` }}
                    ></div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-600">{item.count}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6">
              <Link href="/shop/prescription" className="flex items-center text-gray-900 hover:text-gray-700 transition-colors group">
                <span className="mr-2">View all prescription medicines</span>
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}