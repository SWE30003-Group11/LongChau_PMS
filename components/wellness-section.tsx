export default function WellnessSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-light text-gray-900">Health &</h3>
            <h4 className="text-4xl font-light italic text-gray-700">Wellness</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {[
                {
                  name: "VITAMIN & SUPPLEMENT COMPLEX",
                  price: "₫299,000",
                  category: "VITAMINS"
                },
                {
                  name: "IMMUNITY BOOSTER PACK",
                  price: "₫399,000",
                  category: "SUPPLEMENTS"
                },
              ].map((product, index) => (
                <div key={index} className="bg-gray-100 rounded-lg p-4 relative">
                  <div className="bg-white text-xs px-3 py-1 rounded-full inline-block mb-4">{product.category}</div>
                  <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden mb-4">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('/home/wellness-${index + 1}.png')` }}
                    ></div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-900 font-medium">{product.name}</p>
                    <p className="text-sm font-medium mt-1">{product.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-900 mt-6">COMPREHENSIVE WELLNESS SOLUTIONS FOR A HEALTHIER LIFESTYLE.</p>
          </div>

          <div>
            <div className="aspect-w-3 aspect-h-4 rounded-lg overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/home/wellness-lifestyle.jpeg')" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}