"use client"

import Link from "next/link"
import { ArrowLeft, Twitter, Facebook, Share2, Shield, Thermometer, Calendar, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function FluPreventionPage() {
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
              <div className="text-gray-500 mb-2">5 March 2025 • By Long Chau Pharmacy Team</div>
              <h1 className="text-4xl md:text-5xl font-light mb-6">
                Seasonal Health: Preventing Common <span className="italic font-serif">Flu</span> and <span className="italic font-serif">Cold</span>
              </h1>
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <p className="text-white/90">
                  Stay healthy during flu season with our comprehensive prevention guide. Learn about vaccines, immunity boosters, and when to seek medical attention from Long Chau's expert pharmacists.
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
                  src="/journal/seasonal-health-flu-prevention.jpg"
                  alt="Flu prevention supplies"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              Flu season in Vietnam typically peaks during the rainy season and cooler months. Understanding prevention strategies and knowing when to seek treatment can help you stay healthy year-round. At Long Chau, we're committed to keeping our communities healthy with vaccines, medications, and expert advice.
            </p>

            <h2 className="text-2xl font-light mt-12 mb-6">Understanding Flu Season in Vietnam</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Peak Flu Seasons in Vietnam:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-sm mb-1">May - October</h4>
                  <p className="text-gray-600 text-xs">Rainy season brings increased transmission</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 mb-2" />
                  <h4 className="font-medium text-sm mb-1">December - February</h4>
                  <p className="text-gray-600 text-xs">Cooler weather increases indoor gatherings</p>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              The influenza virus spreads through respiratory droplets when infected people cough, sneeze, or talk. You can also get flu by touching contaminated surfaces and then touching your face. Understanding transmission helps in prevention.
            </p>

            <h2 className="text-2xl font-light mt-12 mb-6">Prevention Strategies</h2>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="font-medium mb-2">1. Annual Flu Vaccination</h3>
                <p className="text-gray-600 text-sm mb-3">
                  The single most effective way to prevent flu. Long Chau offers flu vaccines at all locations starting from August each year.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Who should get vaccinated:</strong> Everyone 6 months and older, especially high-risk groups including elderly, pregnant women, young children, and those with chronic conditions.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-green-600 pl-6">
                <h3 className="font-medium mb-2">2. Hand Hygiene</h3>
                <p className="text-gray-600 text-sm">
                  Wash hands frequently with soap and water for at least 20 seconds. Use alcohol-based hand sanitizer when soap isn't available. Long Chau stocks various hand sanitizers and antibacterial soaps.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="font-medium mb-2">3. Respiratory Etiquette</h3>
                <p className="text-gray-600 text-sm">
                  Cover your mouth and nose when coughing or sneezing. Use tissues and dispose of them properly. Wear masks in crowded places during flu season.
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-6">
                <h3 className="font-medium mb-2">4. Boost Your Immune System</h3>
                <p className="text-gray-600 text-sm">
                  Maintain a healthy lifestyle with adequate sleep, regular exercise, and balanced nutrition. Consider vitamin C and D supplements, available at Long Chau.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Recognizing Flu Symptoms</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-red-50 p-6 rounded-lg">
                <Thermometer className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="font-medium mb-3">Flu Symptoms</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Sudden onset of high fever (38°C or higher)</li>
                  <li>• Severe body aches and fatigue</li>
                  <li>• Dry cough and sore throat</li>
                  <li>• Headache and chills</li>
                  <li>• Sometimes nausea and vomiting</li>
                </ul>
              </div>
              <div className="bg-yellow-50 p-6 rounded-lg">
                <Shield className="h-8 w-8 text-yellow-600 mb-3" />
                <h3 className="font-medium mb-3">Common Cold Symptoms</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Gradual onset</li>
                  <li>• Runny or stuffy nose</li>
                  <li>• Sneezing</li>
                  <li>• Mild body aches</li>
                  <li>• Low-grade fever (if any)</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg mb-8">
              <p className="text-gray-700 font-medium mb-2">Key Difference:</p>
              <p className="text-gray-600 text-sm">
                Flu symptoms appear suddenly and are more severe than cold symptoms. If you're unsure, visit your nearest Long Chau pharmacy for a consultation.
              </p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Treatment Options</h2>

            <div className="space-y-4 mb-8">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-3">Antiviral Medications</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Most effective when started within 48 hours of symptom onset. Prescription antivirals like Tamiflu can reduce flu severity and duration.
                </p>
                <p className="text-xs text-gray-500">
                  Available at Long Chau with prescription
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-3">Symptom Relief</h3>
                <p className="text-gray-600 text-sm mb-3">
                  Over-the-counter medications can help manage symptoms:
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Paracetamol or ibuprofen for fever and aches</li>
                  <li>• Decongestants for nasal congestion</li>
                  <li>• Cough suppressants for dry cough</li>
                  <li>• Throat lozenges for sore throat</li>
                </ul>
              </div>

              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-medium mb-3">Natural Remedies</h3>
                <p className="text-gray-600 text-sm">
                  Rest, stay hydrated, use a humidifier, and try warm salt water gargles. Long Chau offers various herbal teas and natural supplements that may provide comfort.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">When to Seek Medical Care</h2>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
              <AlertCircle className="h-6 w-6 text-red-600 mb-3" />
              <h3 className="font-medium mb-3">Seek Immediate Medical Attention If You Experience:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Difficulty breathing or shortness of breath</li>
                <li>• Persistent chest pain or pressure</li>
                <li>• Sudden dizziness or confusion</li>
                <li>• Severe or persistent vomiting</li>
                <li>• Flu symptoms that improve but then return with fever and worse cough</li>
                <li>• High fever lasting more than 3 days</li>
              </ul>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">High-Risk Groups</h2>

            <p className="text-gray-600 mb-6">
              Certain groups are at higher risk for flu complications and should take extra precautions:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">👶</div>
                <p className="text-sm font-medium">Children under 5</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">👵</div>
                <p className="text-sm font-medium">Adults 65+</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🤰</div>
                <p className="text-sm font-medium">Pregnant women</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">🏥</div>
                <p className="text-sm font-medium">Chronic conditions</p>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Long Chau Flu Season Services</h3>
              <ul className="space-y-3 mb-6">
                <li>✓ Flu vaccines available at all locations</li>
                <li>✓ Free flu symptom consultations</li>
                <li>✓ Complete range of OTC flu medications</li>
                <li>✓ Prescription antiviral medications</li>
                <li>✓ Home delivery for flu care products</li>
                <li>✓ Corporate flu vaccination programs</li>
              </ul>
              <p className="text-lg">
                <strong>Flu Hotline:</strong> 1800 6928
              </p>
              <p className="text-sm text-white/80 mt-2">
                Available 24/7 during flu season for advice and support
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Prevention Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Get annual flu vaccine
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Stock hand sanitizer and masks
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Maintain vitamin D levels
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Practice good hand hygiene
                  </label>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Avoid touching face
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Stay home when sick
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Keep immune system strong
                  </label>
                  <label className="flex items-center text-sm">
                    <input type="checkbox" className="mr-3 rounded" />
                    Know when to seek care
                  </label>
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-center italic">
              Remember: Prevention is always better than treatment. Visit your nearest Long Chau pharmacy today to prepare for flu season.
            </p>
          </div>

          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img src="/images/pharmacy-team.jpg" alt="Long Chau Pharmacy Team" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">Written by Long Chau Pharmacy Team</h3>
                <p className="text-sm text-gray-600">Expert pharmacists dedicated to community health</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-light mb-8">
              <span className="italic">related</span> ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <Link href="/journal/antibiotic-resistance-awareness" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/antibiotic-resistance-awareness.jpg"
                    alt="Antibiotic resistance"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Antibiotic Resistance: Why Completing Your Course Matters
                </h4>
                <p className="text-sm text-gray-500 mt-2">20 February 2025</p>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}