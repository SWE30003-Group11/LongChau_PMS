"use client"

import Link from "next/link"
import { ArrowLeft, Twitter, Facebook, Share2, Info, Pill, Sun, Leaf } from "lucide-react"
import { useEffect, useState } from "react"

export default function VitaminsSupplementsPage() {
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
              <div className="text-gray-500 mb-2">28 February 2025 • By Pharmacy Expert Team</div>
              <h1 className="text-4xl md:text-5xl font-light mb-6">
                Essential <span className="italic font-serif">Vitamins</span> and <span className="italic font-serif">Supplements</span>: What You Need to Know
              </h1>
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <p className="text-white/90">
                  Navigate the world of vitamins and supplements with confidence. Our comprehensive guide helps you understand which supplements you need and how to take them safely for optimal health.
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
                  src="/journal/essential-vitamins-supplements-guide.webp"
                  alt="Vitamins and supplements"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              In our fast-paced modern life, getting all necessary nutrients from diet alone can be challenging. While supplements should never replace a balanced diet, they can help fill nutritional gaps and support overall health. At Long Chau Pharmacy, we're committed to helping you make informed decisions about supplementation.
            </p>

            <h2 className="text-2xl font-light mt-12 mb-6">Essential Vitamins for Daily Health</h2>

            <div className="space-y-6 mb-8">
              <div className="bg-yellow-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <Sun className="h-8 w-8 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium text-lg mb-2">Vitamin D</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      The "sunshine vitamin" crucial for bone health, immune function, and mood regulation. Many Vietnamese are deficient due to sun avoidance and indoor lifestyles.
                    </p>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <strong>Recommended dose:</strong> 1000-2000 IU daily<br />
                        <strong>Best taken:</strong> With fatty meals for better absorption
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">C</div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Vitamin C</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Powerful antioxidant supporting immune function, collagen production, and iron absorption. Water-soluble, so excess is excreted.
                    </p>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <strong>Recommended dose:</strong> 500-1000mg daily<br />
                        <strong>Best taken:</strong> Divided doses throughout the day
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">B</div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">B-Complex Vitamins</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Eight essential vitamins supporting energy metabolism, nerve function, and red blood cell formation. Particularly important for vegetarians.
                    </p>
                    <div className="bg-white p-3 rounded">
                      <p className="text-xs text-gray-600">
                        <strong>Key vitamins:</strong> B1, B2, B3, B5, B6, B7, B9, B12<br />
                        <strong>Best taken:</strong> Morning with breakfast
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Important Minerals</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-3">Calcium</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Essential for bone health, muscle function, and nerve transmission.
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Dose: 1000-1200mg daily</li>
                  <li>• Best with vitamin D</li>
                  <li>• Take with meals</li>
                </ul>
              </div>
              
              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-3">Iron</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Crucial for oxygen transport and energy production.
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Dose: 8-18mg daily</li>
                  <li>• Take on empty stomach</li>
                  <li>• With vitamin C</li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-3">Magnesium</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Supports muscle function, sleep, and stress management.
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Dose: 300-400mg daily</li>
                  <li>• Best before bed</li>
                  <li>• May cause loose stools</li>
                </ul>
              </div>

              <div className="border rounded-lg p-6">
                <h3 className="font-medium mb-3">Zinc</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Boosts immune function and wound healing.
                </p>
                <ul className="space-y-1 text-xs text-gray-600">
                  <li>• Dose: 8-11mg daily</li>
                  <li>• Take with food</li>
                  <li>• Avoid with calcium</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Choosing Quality Supplements</h2>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Long Chau's Quality Standards:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="font-medium text-sm">Third-party tested</p>
                    <p className="text-xs text-gray-600">All supplements verified for purity and potency</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="font-medium text-sm">GMP certified</p>
                    <p className="text-xs text-gray-600">Manufactured in certified facilities</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="font-medium text-sm">Clear labeling</p>
                    <p className="text-xs text-gray-600">Transparent ingredient lists</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
                  <div>
                    <p className="font-medium text-sm">Expert guidance</p>
                    <p className="text-xs text-gray-600">Pharmacist consultations available</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Proper Dosing and Timing</h2>

            <div className="bg-white border rounded-lg p-6 mb-8">
              <h3 className="font-medium mb-4">Optimal Timing Guide:</h3>
              
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h4 className="font-medium text-sm mb-2">Morning (with breakfast)</h4>
                  <p className="text-gray-600 text-xs">B-complex vitamins, Vitamin C, Iron (if tolerated)</p>
                </div>
                
                <div className="border-b pb-4">
                  <h4 className="font-medium text-sm mb-2">With meals</h4>
                  <p className="text-gray-600 text-xs">Fat-soluble vitamins (A, D, E, K), Calcium, Multivitamins</p>
                </div>
                
                <div className="border-b pb-4">
                  <h4 className="font-medium text-sm mb-2">Empty stomach</h4>
                  <p className="text-gray-600 text-xs">Probiotics, Amino acids, Some herbal supplements</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Before bed</h4>
                  <p className="text-gray-600 text-xs">Magnesium, Melatonin, Some calcium formulations</p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Potential Interactions</h2>

            <div className="bg-red-50 p-6 rounded-lg mb-8">
              <Info className="h-6 w-6 text-red-600 mb-3" />
              <h3 className="font-medium mb-3">Important Interaction Warnings:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• <strong>Vitamin K</strong> can interfere with blood thinners like warfarin</li>
                <li>• <strong>St. John's Wort</strong> affects many medications including birth control</li>
                <li>• <strong>Iron</strong> reduces absorption of thyroid medications and some antibiotics</li>
                <li>• <strong>Calcium</strong> can interfere with iron and zinc absorption</li>
                <li>• <strong>High-dose vitamin E</strong> may increase bleeding risk with anticoagulants</li>
              </ul>
              <p className="text-xs text-gray-600 mt-4">
                Always inform your healthcare provider and Long Chau pharmacist about all supplements you're taking.
              </p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Special Populations</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-pink-50 p-6 rounded-lg">
                <h3 className="font-medium mb-3">Pregnancy & Breastfeeding</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Prenatal vitamins with folic acid, iron, and DHA are essential. Avoid high-dose vitamin A and herbal supplements.
                </p>
                <p className="text-xs text-gray-600">
                  Long Chau offers specialized prenatal formulations
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-medium mb-3">Elderly (65+)</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Focus on vitamin D, B12, calcium, and omega-3s. Consider formulations designed for better absorption.
                </p>
                <p className="text-xs text-gray-600">
                  Ask about senior-specific supplements at Long Chau
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-medium mb-3">Vegetarians/Vegans</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Essential: B12, iron, omega-3s, vitamin D, and possibly calcium. Plant-based options available.
                </p>
                <p className="text-xs text-gray-600">
                  Long Chau stocks vegan-certified supplements
                </p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-medium mb-3">Athletes</h3>
                <p className="text-gray-700 text-sm mb-3">
                  May benefit from protein supplements, BCAAs, creatine, and electrolytes. Timing is crucial.
                </p>
                <p className="text-xs text-gray-600">
                  Sports nutrition consultation available
                </p>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Long Chau Supplement Services</h3>
              <ul className="space-y-3 mb-6">
                <li>✓ Free supplement consultations with licensed pharmacists</li>
                <li>✓ Comprehensive vitamin and mineral testing referrals</li>
                <li>✓ Personalized supplement recommendations</li>
                <li>✓ Drug-supplement interaction checks</li>
                <li>✓ Monthly supplement subscription service</li>
                <li>✓ Quality-assured products from trusted brands</li>
              </ul>
              <p className="text-lg">
                <strong>Supplement Advice Hotline:</strong> 1800 6928
              </p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Common Myths Debunked</h2>

            <div className="space-y-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-sm mb-1">Myth: "More is always better"</p>
                <p className="text-gray-600 text-xs">
                  Truth: Excessive supplementation can be harmful. Follow recommended doses.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-sm mb-1">Myth: "Natural means safe"</p>
                <p className="text-gray-600 text-xs">
                  Truth: Natural supplements can have side effects and interactions too.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-sm mb-1">Myth: "Supplements can replace a healthy diet"</p>
                <p className="text-gray-600 text-xs">
                  Truth: Supplements complement, not replace, a balanced diet.
                </p>
              </div>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Key Takeaways</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Choose quality supplements from reputable sources like Long Chau</li>
                <li>• Follow recommended doses and timing for optimal absorption</li>
                <li>• Be aware of potential interactions with medications</li>
                <li>• Consult healthcare providers for personalized recommendations</li>
                <li>• Remember: supplements support, not replace, healthy lifestyle choices</li>
              </ul>
            </div>
          </div>

          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img src="/images/pharmacy-experts.jpg" alt="Pharmacy Expert Team" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">Written by Pharmacy Expert Team</h3>
                <p className="text-sm text-gray-600">Long Chau's team of specialized nutritional pharmacists</p>
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
              <Link href="/journal/antibiotic-resistance-awareness" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/antibiotic-resistance-awareness.jpg"
                    alt="Antibiotic resistance"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Managing Chronic Conditions: Diabetes Care Tips
                </h4>
                <p className="text-sm text-gray-500 mt-2">10 March 2025</p>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}