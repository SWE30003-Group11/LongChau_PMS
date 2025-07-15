import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HealthTipsSection() {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light italic">health</h2>
          <h3 className="text-4xl md:text-5xl font-light">TIPS & ADVICE</h3>
          <p className="text-white/70 mt-2">Professional healthcare guidance from Long Chau's expert pharmacists.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 text-gray-900 rounded-lg overflow-hidden">
              <div className="p-4">
                <span className="inline-block px-3 py-1 bg-white text-xs rounded-full mb-4">FEATURED</span>
              </div>
              <div className="aspect-w-16 aspect-h-9">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('/images/medication-guide.jpg')" }}
                ></div>
              </div>
              <div className="p-6">
                <h4 className="text-xl font-medium mb-2">
                  Understanding Your Medications: A Complete Guide to Safe Usage
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  Learn how to properly store, take, and manage your medications. Our comprehensive guide covers everything from reading prescription labels to understanding drug interactions and side effects.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-xs">15 March 2025</span>
                  <Link href="/health-tips/medication-guide" className="text-sm text-gray-900 hover:underline">
                    Read more
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {[
              {
                title: "Managing Chronic Conditions: Diabetes Care Tips",
                date: "10 March 2025",
                slug: "diabetes-care-tips"
              },
              {
                title: "Seasonal Health: Preventing Common Flu and Cold",
                date: "5 March 2025",
                slug: "seasonal-health-tips"
              },
            ].map((article, index) => (
              <div key={index} className="bg-gray-50 text-gray-900 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('/images/health-tip-${index + 1}.jpg')` }}
                  ></div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">{article.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{article.date}</span>
                    <Link
                      href={`/health-tips/${article.slug}`}
                      className="text-xs text-gray-900 hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-6">
              <Link href="/health-tips" className="flex items-center text-white hover:text-white/80 transition-colors group">
                <span className="mr-2 uppercase text-sm tracking-wider">View All Tips</span>
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-gray-900" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}