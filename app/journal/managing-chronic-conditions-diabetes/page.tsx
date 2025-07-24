"use client"

import Link from "next/link"
import { ArrowLeft, Twitter, Facebook, Share2, Activity, Heart, Eye, Brain } from "lucide-react"
import { useEffect, useState } from "react"

export default function DiabetesCarePage() {
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
              <div className="text-gray-500 mb-2">10 March 2025 • By Dr. Nguyen Van Duc</div>
              <h1 className="text-4xl md:text-5xl font-light mb-6">
                Managing Chronic Conditions: <span className="italic font-serif">Diabetes</span> Care Tips
              </h1>
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <p className="text-white/90">
                  Living with diabetes requires careful management, but with the right knowledge and support from your healthcare team, you can maintain a healthy, active lifestyle. This guide provides practical tips for managing your condition effectively.
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
                  src="/journal/managing-chronic-conditions-diabetes.webp"
                  alt="Diabetes care"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              Diabetes affects millions of Vietnamese, and proper management is crucial for preventing complications and maintaining quality of life. At Long Chau Pharmacy, we're committed to supporting you with medications, supplies, and expert guidance every step of the way.
            </p>

            <h2 className="text-2xl font-light mt-12 mb-6">Understanding Diabetes Types</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Type 1 Diabetes</h3>
                <p className="text-gray-700 text-sm">
                  An autoimmune condition where the pancreas produces little or no insulin. Requires daily insulin therapy and careful blood sugar monitoring.
                </p>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium mb-3">Type 2 Diabetes</h3>
                <p className="text-gray-700 text-sm">
                  The body doesn't use insulin properly. Often manageable with lifestyle changes and oral medications, though some may need insulin.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Essential Medication Management</h2>
            
            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Common Diabetes Medications Available at Long Chau:</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Metformin:</strong> First-line medication for Type 2 diabetes, helps control blood sugar
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>Insulin:</strong> Various types including rapid-acting, long-acting, and premixed formulations
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>DPP-4 inhibitors:</strong> Help the body produce more insulin when blood sugar is high
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <div>
                    <strong>SGLT2 inhibitors:</strong> Help kidneys remove excess glucose through urine
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Blood Sugar Monitoring</h2>
            <p className="text-gray-600 mb-6">
              Regular monitoring is essential for diabetes management. Long Chau offers a complete range of monitoring supplies:
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <Activity className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <p className="text-sm font-medium">Glucometers</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded-full"></div>
                <p className="text-sm font-medium">Test Strips</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded"></div>
                <p className="text-sm font-medium">Lancets</p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                <div className="h-8 w-8 mx-auto mb-2 bg-blue-600 rounded-full"></div>
                <p className="text-sm font-medium">Control Solution</p>
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium mb-3">Target Blood Sugar Levels:</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Before meals: 80-130 mg/dL (4.4-7.2 mmol/L)</li>
                <li>• 2 hours after meals: Less than 180 mg/dL (10.0 mmol/L)</li>
                <li>• HbA1c: Less than 7% for most adults</li>
              </ul>
              <p className="text-xs text-gray-600 mt-3">*Targets may vary based on individual factors. Consult your healthcare provider.</p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Lifestyle Management Tips</h2>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Healthy Eating</h3>
                  <p className="text-gray-600 text-sm">
                    Focus on whole grains, lean proteins, and plenty of vegetables. Count carbohydrates and maintain consistent meal times. Our pharmacists can recommend nutritional supplements if needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Regular Exercise</h3>
                  <p className="text-gray-600 text-sm">
                    Aim for at least 150 minutes of moderate activity weekly. Exercise helps lower blood sugar and improves insulin sensitivity. Always carry glucose tablets during physical activity.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Medication Adherence</h3>
                  <p className="text-gray-600 text-sm">
                    Take medications as prescribed, even when feeling well. Set reminders and use pill organizers available at Long Chau to maintain your routine.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-700 font-bold">4</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Stress Management</h3>
                  <p className="text-gray-600 text-sm">
                    Stress can affect blood sugar levels. Practice relaxation techniques, get adequate sleep, and consider joining support groups.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Preventing Complications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-lg p-6">
                <Eye className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-medium mb-2">Eye Care</h3>
                <p className="text-gray-600 text-sm">
                  Annual eye exams are crucial. Diabetic retinopathy is preventable with good blood sugar control.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <Heart className="h-8 w-8 text-red-600 mb-3" />
                <h3 className="font-medium mb-2">Heart Health</h3>
                <p className="text-gray-600 text-sm">
                  Monitor blood pressure and cholesterol. Long Chau offers cardiovascular health screenings.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <div className="h-8 w-8 text-green-600 mb-3">👣</div>
                <h3 className="font-medium mb-2">Foot Care</h3>
                <p className="text-gray-600 text-sm">
                  Daily foot inspections and proper footwear are essential. We stock diabetic foot care products.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <Brain className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-medium mb-2">Nerve Health</h3>
                <p className="text-gray-600 text-sm">
                  Report numbness or tingling to your doctor. Neuropathy can be managed with proper treatment.
                </p>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Long Chau Diabetes Care Services</h3>
              <ul className="space-y-3 mb-6">
                <li>✓ Free blood glucose testing at select locations</li>
                <li>✓ Diabetes medication consultations</li>
                <li>✓ Insulin storage and handling guidance</li>
                <li>✓ Nutritional counseling referrals</li>
                <li>✓ Home delivery for diabetes supplies</li>
              </ul>
              <p className="text-lg">
                <strong>Call our Diabetes Care Hotline:</strong> 1800 6928
              </p>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Remember</h3>
              <p className="text-gray-700">
                Diabetes management is a journey, not a destination. With proper medication, monitoring, and lifestyle adjustments, you can live a full, healthy life. Your Long Chau pharmacists are here to support you every step of the way.
              </p>
              <p className="text-gray-700 mt-4">
                Regular check-ups with your healthcare provider and consistent self-care are the keys to successful diabetes management.
              </p>
            </div>
          </div>

          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img src="/images/dr-nguyen-duc.jpg" alt="Dr. Nguyen Van Duc" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">Written by Dr. Nguyen Van Duc</h3>
                <p className="text-sm text-gray-600">CEO of Long Chau Pharmacy, specialist in chronic disease management</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-light mb-8">
              <span className="italic">related</span> ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/journal/heart-health-blood-pressure-management" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/heart-health-blood-pressure-management.avif"
                    alt="Heart health"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Heart Health: Managing Blood Pressure Medications
                </h4>
                <p className="text-sm text-gray-500 mt-2">15 February 2025</p>
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
              <Link href="/journal/antibiotic-resistance-awareness" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/antibiotic-resistance-awareness.jpg"
                    alt="Antibiotic resistance"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Understanding Your Medications: A Complete Guide
                </h4>
                <p className="text-sm text-gray-500 mt-2">15 March 2025</p>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}