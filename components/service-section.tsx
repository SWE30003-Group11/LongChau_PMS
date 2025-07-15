import { Clock, Truck } from "lucide-react"

export default function ServiceSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-12">
          <div className="inline-block px-4 py-1 border border-gray-300 rounded-full text-sm mb-4">OUR SERVICES</div>
          <h2 className="text-5xl md:text-7xl font-light text-gray-900 text-center">
            PROFESSIONAL
            <br />
            PHARMACY CARE.
          </h2>
          <h3 className="text-4xl md:text-6xl font-light italic text-gray-700 text-center mt-4">NATIONWIDE.</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: "url('/home/pharmacy-interior.png')" }}
              ></div>
            </div>
          </div>

          <div className="space-y-10 order-1 lg:order-2">
            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">24/7 Pharmacy Service</h4>
                <p className="text-gray-600">
                  Select Long Chau locations offer round-the-clock service to ensure you have access to essential medications and healthcare products whenever you need them.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-gray-900" />
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium mb-2">Home Delivery Service</h4>
                <p className="text-gray-600">
                  Order your medications and healthcare products online or by phone, and have them delivered directly to your doorstep with our reliable delivery service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}