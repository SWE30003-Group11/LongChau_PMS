"use client"

import Link from "next/link"
import { ArrowLeft, Twitter, Facebook, Share2, Link2, AlertCircle, CheckCircle } from "lucide-react"
import { useEffect, useState } from "react"

export default function MedicationGuidePage() {
  const [showShareButtons, setShowShareButtons] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowShareButtons(true)
      } else {
        setShowShareButtons(false)
      }

      if (window.scrollY > 500) {
        setShowScrollIndicator(false)
      } else {
        setShowScrollIndicator(true)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/pharmacy-consultation.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        </div>

        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-white">
              <div className="text-white/70 mb-4">15 March 2025 • By Dr. Pham Thi Mai, Chief Pharmacist</div>
              <h1 className="text-5xl md:text-7xl font-light mb-6">
                Understanding Your <span className="italic font-serif">Medications</span>: A Complete Guide to Safe Usage
              </h1>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        {showScrollIndicator && (
          <div className="absolute bottom-10 right-10 animate-bounce">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path
                  d="M19 12L12 19L5 12"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>

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
          <Link2 className="h-5 w-5 text-gray-900" />
        </button>
        <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
          <Share2 className="h-5 w-5 text-gray-900" />
        </button>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Link href="/journal" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Health Tips
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-blue-900 text-white p-8 rounded-lg mb-12">
            <p className="text-white/90 mb-6 text-lg">
              Taking medications correctly is crucial for your health and safety. This comprehensive guide will help you understand how to properly store, take, and manage your medications, ensuring you get the maximum benefit while minimizing risks.
            </p>
            <div className="flex items-center">
              <button className="flex items-center text-white/70 hover:text-white">
                <Share2 className="h-5 w-5 mr-2" />
                SHARE THIS GUIDE
              </button>
            </div>
          </div>

          {/* Article Content */}
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              At Long Chau Pharmacy, we believe that patient education is the cornerstone of safe and effective medication use. With over 1,000 locations nationwide and thousands of licensed pharmacists, we're committed to helping you understand your medications better.
            </p>

            <h2 className="text-3xl font-light mt-12 mb-6">1. Reading Your Prescription Label</h2>
            <p className="text-gray-600 mb-4">
              Every prescription label contains vital information. Here's what to look for:
            </p>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Patient name:</strong> Always verify this is your prescription</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Medication name:</strong> Both brand and generic names may be listed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Dosage:</strong> The strength of each pill/dose</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Instructions:</strong> How and when to take the medication</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Quantity:</strong> Number of pills or amount dispensed</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Refills:</strong> How many times you can refill this prescription</span>
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-light mt-12 mb-6">2. Proper Storage of Medications</h2>
            <p className="text-gray-600 mb-8">
              Proper storage ensures your medications remain effective and safe. Most medications should be stored in a cool, dry place away from direct sunlight.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-green-900">DO Store Medications:</h3>
                <ul className="space-y-2 text-green-800">
                  <li>• In original containers with labels</li>
                  <li>• In a cool, dry place</li>
                  <li>• Away from children and pets</li>
                  <li>• In a lockbox if needed for safety</li>
                  <li>• According to specific instructions (some need refrigeration)</li>
                </ul>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3 text-red-900">DON'T Store Medications:</h3>
                <ul className="space-y-2 text-red-800">
                  <li>• In bathroom medicine cabinets (too humid)</li>
                  <li>• In cars (temperature extremes)</li>
                  <li>• Near windows or heat sources</li>
                  <li>• In weekly pill organizers for extended periods</li>
                  <li>• Past their expiration date</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-medium text-yellow-900 mb-2">Important Storage Tip</h4>
                  <p className="text-yellow-800">
                    Always check if your medication requires special storage. Some medications, like insulin or certain antibiotics, must be refrigerated. Ask your Long Chau pharmacist if you're unsure.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-light mt-12 mb-6">3. Taking Medications Safely</h2>
            <p className="text-gray-600 mb-8">
              Following these guidelines helps ensure your medications work effectively and reduces the risk of side effects:
            </p>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-gray-300 pl-6">
                <h3 className="text-xl font-medium mb-2">Timing Matters</h3>
                <p className="text-gray-600">
                  Take medications at the same time each day when possible. Use alarms or medication reminder apps to help maintain consistency. Some medications work best when taken with food, while others should be taken on an empty stomach.
                </p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-6">
                <h3 className="text-xl font-medium mb-2">Never Double Up</h3>
                <p className="text-gray-600">
                  If you miss a dose, don't take a double dose to make up for it. Check with your pharmacist about what to do when you miss a dose of your specific medication.
                </p>
              </div>
              
              <div className="border-l-4 border-gray-300 pl-6">
                <h3 className="text-xl font-medium mb-2">Complete the Course</h3>
                <p className="text-gray-600">
                  For antibiotics and other medications, always complete the full prescribed course, even if you feel better. Stopping early can lead to treatment failure or antibiotic resistance.
                </p>
              </div>
            </div>

            <div className="my-12">
              <img
                src="/images/pharmacist-consultation.jpg"
                alt="Long Chau pharmacist consulting with patient"
                className="w-full rounded-lg shadow-lg"
              />
              <p className="text-sm text-gray-500 mt-4 text-center">
                Our licensed pharmacists are always available to answer your medication questions
              </p>
            </div>

            <h2 className="text-3xl font-light mt-12 mb-6">4. Understanding Drug Interactions</h2>
            <p className="text-gray-600 mb-8">
              Drug interactions can affect how your medications work or increase side effects. Always inform your healthcare providers about:
            </p>

            <div className="bg-gray-100 p-8 rounded-lg mb-8">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                  All prescription medications
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                  Over-the-counter medicines
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                  Vitamins and supplements
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                  Herbal products
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                  Alcohol consumption
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-gray-600 rounded-full mr-3"></span>
                  Any allergies or sensitivities
                </li>
              </ul>
            </div>

            <h2 className="text-3xl font-light mt-12 mb-6">5. When to Contact Your Pharmacist</h2>
            <p className="text-gray-600 mb-8">
              Don't hesitate to reach out to your Long Chau pharmacist if you experience:
            </p>

            <div className="bg-red-50 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-medium mb-4 text-red-900">Seek Immediate Help If You Experience:</h3>
              <ul className="space-y-2 text-red-800">
                <li>• Severe allergic reactions (rash, swelling, difficulty breathing)</li>
                <li>• Unexpected side effects</li>
                <li>• Symptoms that worsen despite treatment</li>
                <li>• Confusion about your medication regimen</li>
                <li>• Concerns about drug interactions</li>
              </ul>
            </div>

            <div className="bg-gray-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-2xl font-light mb-4">Your Health is Our Priority</h3>
              <p className="mb-4">
                At Long Chau Pharmacy, we're committed to your health and safety. Our licensed pharmacists are available 24/7 at select locations to answer your questions and provide guidance.
              </p>
              <p className="text-lg font-medium">
                Long Chau Hotline: 1800 6928
              </p>
            </div>
          </div>

          {/* Author Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img src="/images/dr-pham-mai.jpg" alt="Dr. Pham Thi Mai" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">Written by Dr. Pham Thi Mai</h3>
                <p className="text-sm text-gray-600">Chief Pharmacist at Long Chau, with over 20 years of experience in pharmaceutical care.</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="mt-16">
            <h3 className="text-2xl font-light mb-8">
              <span className="italic">related</span> ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/journal/antibiotic-resistance-awareness" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/images/antibiotic-resistance.jpg"
                    alt="Antibiotic resistance"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Antibiotic Resistance: Why Completing Your Course Matters
                </h4>
                <p className="text-sm text-gray-500 mt-2">20 February 2025</p>
              </Link>
              <Link href="/journal/essential-vitamins-supplements-guide" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/images/vitamins-guide.jpg"
                    alt="Vitamins and supplements"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Essential Vitamins and Supplements: What You Need to Know
                </h4>
                <p className="text-sm text-gray-500 mt-2">28 February 2025</p>
              </Link>
              <Link href="/journal/managing-chronic-conditions-diabetes" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/images/diabetes-care.jpg"
                    alt="Diabetes management"
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