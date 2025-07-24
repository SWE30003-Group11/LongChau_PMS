"use client"

import Link from "next/link"
import { ArrowLeft, Twitter, Facebook, Share2, AlertTriangle, ShieldOff, TrendingUp, Users } from "lucide-react"
import { useEffect, useState } from "react"

export default function AntibioticResistancePage() {
  const [showShareButtons, setShowShareButtons] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowShareButtons(true)
      } else {
        setShowShareButtons(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Fixed social sharing sidebar */}
      <div
        className={`fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 transition-opacity duration-300 z-50 ${showShareButtons ? "opacity-100" : "opacity-0"}`}
      >
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
          <Twitter className="h-5 w-5 text-gray-900" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
          <Facebook className="h-5 w-5 text-gray-900" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
          <Share2 className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      <div className="container mx-auto px-4">
        <Link href="/journal" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Health Tips
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="order-2 md:order-1">
              <div className="text-gray-500 mb-2">20 February 2025 • By Dr. Le Thi Huong</div>
              <h1 className="text-4xl md:text-5xl font-light mb-6">
                Antibiotic <span className="italic font-serif">Resistance</span>: Why Completing Your Course Matters
              </h1>
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <p className="text-white/90">
                  Understanding antibiotic resistance and why it's crucial to complete your prescribed course. Learn how to use antibiotics responsibly to protect yourself and future generations.
                </p>
                <div className="mt-6 flex items-center">
                  <button className="flex items-center text-white/70 hover:text-white">
                    <Share2 className="h-5 w-5 mr-2" />
                    SHARE
                  </button>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <div className="aspect-w-4 aspect-h-5 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src="/journal/antibiotic-resistance-awareness.jpg"
                  alt="Antibiotic resistance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              Antibiotic resistance is one of the biggest threats to global health today. When bacteria become resistant to antibiotics, simple infections can become life-threatening. At Long Chau Pharmacy, we're committed to educating our communities about responsible antibiotic use to preserve these life-saving medications for future generations.
            </p>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
              <AlertTriangle className="h-6 w-6 text-red-600 mb-2" />
              <p className="text-gray-700 font-medium">
                In Vietnam, antibiotic resistance is rising rapidly due to overuse and misuse. Your actions today directly impact tomorrow's treatment options.
              </p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">What is Antibiotic Resistance?</h2>

            <p className="text-gray-600 mb-6">
              Antibiotic resistance occurs when bacteria evolve to survive medications designed to kill them. These "superbugs" can spread between people and are much harder to treat, requiring stronger, more expensive medications with more side effects.
            </p>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h3 className="font-medium mb-4">The Global Impact:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-4 rounded">
                  <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">700,000</p>
                  <p className="text-xs text-gray-600">Deaths annually worldwide</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <Users className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">10 million</p>
                  <p className="text-xs text-gray-600">Projected deaths by 2050</p>
                </div>
                <div className="bg-white p-4 rounded">
                  <ShieldOff className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">30%</p>
                  <p className="text-xs text-gray-600">Common infections now resistant</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">How Resistance Develops</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-red-700 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Incomplete Treatment</h3>
                  <p className="text-gray-600 text-sm">
                    When you stop antibiotics early because you feel better, some bacteria survive. These survivors are the strongest and can multiply, creating resistant strains.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-700 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Unnecessary Use</h3>
                  <p className="text-gray-600 text-sm">
                    Taking antibiotics for viral infections like colds or flu exposes bacteria in your body to antibiotics unnecessarily, promoting resistance.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-700 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Sharing Medications</h3>
                  <p className="text-gray-600 text-sm">
                    Sharing antibiotics means incorrect dosing and incomplete courses, creating perfect conditions for resistance to develop.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Agricultural Overuse</h3>
                  <p className="text-gray-600 text-sm">
                    Antibiotics in livestock and agriculture contribute to environmental resistance that can transfer to human pathogens.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Using Antibiotics Responsibly</h2>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <h3 className="font-medium mb-4">The Golden Rules:</h3>
              
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">✓ Only take antibiotics prescribed for you</h4>
                  <p className="text-xs text-gray-600">
                    Never use leftover antibiotics or share with others. Each prescription is specific to your infection.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">✓ Complete the full course</h4>
                  <p className="text-xs text-gray-600">
                    Even if you feel better after a few days, continue taking antibiotics for the full prescribed duration.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">✓ Never save leftover antibiotics</h4>
                  <p className="text-xs text-gray-600">
                    Return unused antibiotics to Long Chau for safe disposal. Don't keep them for future use.
                  </p>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">✓ Trust your healthcare provider</h4>
                  <p className="text-xs text-gray-600">
                    If your doctor doesn't prescribe antibiotics, they're not needed. Most infections are viral.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Common Misconceptions</h2>

            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900 mb-1">"I can stop when I feel better"</p>
                <p className="text-gray-600 text-sm">
                  <strong>Truth:</strong> Feeling better doesn't mean all bacteria are eliminated. Stopping early allows the strongest bacteria to survive and multiply.
                </p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900 mb-1">"Antibiotics work for all infections"</p>
                <p className="text-gray-600 text-sm">
                  <strong>Truth:</strong> Antibiotics only work against bacterial infections, not viruses like colds, flu, or COVID-19.
                </p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900 mb-1">"Stronger antibiotics are always better"</p>
                <p className="text-gray-600 text-sm">
                  <strong>Truth:</strong> Using the right antibiotic for the specific bacteria is key. "Stronger" antibiotics have more side effects and should be reserved for resistant infections.
                </p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-6">
                <p className="font-medium text-gray-900 mb-1">"Natural antibiotics are safer"</p>
                <p className="text-gray-600 text-sm">
                  <strong>Truth:</strong> While some natural products have antimicrobial properties, they're not substitutes for prescribed antibiotics when truly needed.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Prevention is Key</h2>

            <p className="text-gray-600 mb-6">
              The best way to combat antibiotic resistance is to prevent infections in the first place:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl mb-2">🧼</div>
                <p className="text-sm font-medium">Hand Hygiene</p>
                <p className="text-xs text-gray-600 mt-1">Wash regularly</p>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl mb-2">💉</div>
                <p className="text-sm font-medium">Vaccinations</p>
                <p className="text-xs text-gray-600 mt-1">Stay up-to-date</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-3xl mb-2">🍎</div>
                <p className="text-sm font-medium">Food Safety</p>
                <p className="text-xs text-gray-600 mt-1">Cook thoroughly</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl mb-2">🏠</div>
                <p className="text-sm font-medium">Stay Home</p>
                <p className="text-xs text-gray-600 mt-1">When sick</p>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">What Long Chau is Doing</h2>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Our Commitment to Fighting Resistance:</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Strict prescription requirements - no antibiotics without valid prescriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Patient education at every antibiotic dispensing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Safe disposal programs for unused antibiotics</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Collaboration with healthcare providers for appropriate prescribing</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
                  <span>Community awareness campaigns and educational materials</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Your Role in Fighting Resistance</h3>
              <p className="text-white/90 mb-6">
                Every person who uses antibiotics responsibly helps preserve these life-saving medications for the future. Your actions matter.
              </p>
              <div className="space-y-2 mb-6">
                <p className="text-sm">✓ Ask if antibiotics are really necessary</p>
                <p className="text-sm">✓ Follow prescription instructions exactly</p>
                <p className="text-sm">✓ Never pressure doctors for antibiotics</p>
                <p className="text-sm">✓ Spread awareness about resistance</p>
              </div>
              <p className="text-lg">
                <strong>Questions about antibiotics?</strong> Call: 1800 6928
              </p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Looking to the Future</h2>

            <p className="text-gray-600 mb-6">
              Without action, we risk returning to a pre-antibiotic era where minor infections become deadly. But there's hope: by working together—patients, healthcare providers, and pharmacies like Long Chau—we can slow resistance and preserve antibiotics for future generations.
            </p>

            <div className="bg-green-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium mb-3">What You Can Do Today:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. Commit to never sharing or saving antibiotics</li>
                <li>2. Complete every prescribed course, even when feeling better</li>
                <li>3. Practice good hygiene to prevent infections</li>
                <li>4. Educate family and friends about resistance</li>
                <li>5. Support policies that promote responsible antibiotic use</li>
              </ol>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Remember</h3>
              <p className="text-gray-700 text-lg font-light">
                "Antibiotics are precious resources that must be protected. When we use them responsibly today, we ensure they'll work tomorrow."
              </p>
              <p className="text-gray-600 text-sm mt-4">
                Together, we can win the fight against antibiotic resistance. Visit your Long Chau pharmacist for more information on responsible antibiotic use.
              </p>
            </div>
          </div>

          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img src="/images/dr-le-huong.jpg" alt="Dr. Le Thi Huong" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">Written by Dr. Le Thi Huong</h3>
                <p className="text-sm text-gray-600">Head of Clinical Pharmacy, Long Chau Hospital Network</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-light mb-8">
              <span className="italic">related</span> ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/journal/understanding-your-medications-guide" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/understanding-your-medications-guide.webp"
                    alt="Understanding medications"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Understanding Your Medications: A Complete Guide
                </h4>
                <p className="text-sm text-gray-500 mt-2">15 March 2025</p>
              </Link>
              <Link href="/journal/seasonal-health-flu-prevention" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/seasonal-health-flu-prevention.jpg"
                    alt="Flu prevention"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Seasonal Health: Preventing Common Flu and Cold
                </h4>
                <p className="text-sm text-gray-500 mt-2">5 March 2025</p>
              </Link>
              <Link href="/journal/essential-vitamins-supplements-guide" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/essential-vitamins-supplements-guide.webp"
                    alt="Vitamins guide"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Essential Vitamins and Supplements: What You Need to Know
                </h4>
                <p className="text-sm text-gray-500 mt-2">28 February 2025</p>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}