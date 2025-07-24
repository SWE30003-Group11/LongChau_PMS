import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Use the same data as in app/journal/page.tsx
const healthArticles = [
  {
    title: "Understanding Your Medications: A Complete Guide to Safe Usage",
    date: "15 March 2025",
    slug: "understanding-your-medications-guide",
    image: "/journal/understanding-your-medications-guide.webp",
    featured: true,
  },
  {
    title: "Managing Chronic Conditions: Diabetes Care Tips",
    date: "10 March 2025",
    slug: "managing-chronic-conditions-diabetes",
    image: "/journal/managing-chronic-conditions-diabetes.webp",
  },
  {
    title: "Seasonal Health: Preventing Common Flu and Cold",
    date: "5 March 2025",
    slug: "seasonal-health-flu-prevention",
    image: "/journal/seasonal-health-flu-prevention.jpg",
  },
]

export default function HealthTipsSection() {
  const featured = healthArticles.find((a) => a.featured)
  const others = healthArticles.filter((a) => !a.featured)
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
            {featured && (
              <div className="bg-gray-50 text-gray-900 rounded-lg overflow-hidden">
                <div className="p-4">
                  <span className="inline-block px-3 py-1 bg-white text-xs rounded-full mb-4">FEATURED</span>
                </div>
                <div className="aspect-w-16 aspect-h-9">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${featured.image}')` }}
                  ></div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-medium mb-2">
                    {featured.title}
                  </h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{featured.date}</span>
                    <Link href={`/journal/${featured.slug}`} className="text-sm text-gray-900 hover:underline">
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {others.map((article, index) => (
              <div key={index} className="bg-gray-50 text-gray-900 rounded-lg overflow-hidden">
                <div className="aspect-w-16 aspect-h-9">
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url('${article.image}')` }}
                  ></div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium mb-2">{article.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{article.date}</span>
                    <Link
                      href={`/journal/${article.slug}`}
                      className="text-xs text-gray-900 hover:underline"
                    >
                      Read more
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-center mt-6">
              <Link href="/journal" className="flex items-center text-white hover:text-white/80 transition-colors group">
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