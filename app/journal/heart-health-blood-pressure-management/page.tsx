"use client"

import Link from "next/link"
import { ArrowLeft, Twitter, Facebook, Share2, Heart, Activity, AlertCircle, Clock } from "lucide-react"
import { useEffect, useState } from "react"

export default function HeartHealthPage() {
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
              <div className="text-gray-500 mb-2">15 February 2025 • By Cardiovascular Specialist Team</div>
              <h1 className="text-4xl md:text-5xl font-light mb-6">
                Heart Health: Managing <span className="italic font-serif">Blood Pressure</span> Medications
              </h1>
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <p className="text-white/90">
                  Everything you need to know about blood pressure medications, from ACE inhibitors to beta-blockers. Learn tips for medication adherence and lifestyle management for better heart health.
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
                  src="/journal/heart-health-blood-pressure-management.avif"
                  alt="Blood pressure management"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            <p className="text-gray-600 mb-8">
              High blood pressure, or hypertension, affects millions of Vietnamese and is often called the "silent killer" because it typically has no symptoms. Left untreated, it can lead to heart attack, stroke, and kidney disease. At Long Chau Pharmacy, we're here to help you understand and manage your blood pressure medications effectively.
            </p>

            <h2 className="text-2xl font-light mt-12 mb-6">Understanding Blood Pressure</h2>

            <div className="bg-gray-50 p-6 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Blood Pressure Categories:</h3>
              <div className="space-y-3">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Normal</span>
                    <span className="text-sm text-gray-600">Less than 120/80 mmHg</span>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Elevated</span>
                    <span className="text-sm text-gray-600">120-129 (systolic) and less than 80 (diastolic)</span>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">High Blood Pressure Stage 1</span>
                    <span className="text-sm text-gray-600">130-139/80-89 mmHg</span>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">High Blood Pressure Stage 2</span>
                    <span className="text-sm text-gray-600">140/90 mmHg or higher</span>
                  </div>
                </div>
                <div className="bg-red-100 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Hypertensive Crisis</span>
                    <span className="text-sm text-gray-600">Higher than 180/120 (seek immediate care)</span>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Common Blood Pressure Medications</h2>

            <p className="text-gray-600 mb-6">
              Long Chau stocks various blood pressure medications. Your doctor will prescribe based on your specific needs, other health conditions, and potential side effects.
            </p>

            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="font-medium mb-2">ACE Inhibitors</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Examples: Enalapril, Lisinopril, Ramipril
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  How they work: Relax blood vessels by preventing formation of angiotensin II
                </p>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-xs text-gray-700">
                    <strong>Common side effects:</strong> Dry cough, dizziness, elevated potassium<br />
                    <strong>Special note:</strong> Avoid during pregnancy
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-green-600 pl-6">
                <h3 className="font-medium mb-2">Beta Blockers</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Examples: Atenolol, Metoprolol, Carvedilol
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  How they work: Reduce heart rate and the heart's workload
                </p>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-xs text-gray-700">
                    <strong>Common side effects:</strong> Fatigue, cold hands/feet, slow heartbeat<br />
                    <strong>Special note:</strong> Don't stop suddenly - taper under medical supervision
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="font-medium mb-2">Calcium Channel Blockers</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Examples: Amlodipine, Diltiazem, Verapamil
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  How they work: Relax blood vessel muscles and reduce heart's workload
                </p>
                <div className="bg-purple-50 p-3 rounded">
                  <p className="text-xs text-gray-700">
                    <strong>Common side effects:</strong> Swelling in ankles, constipation, headache<br />
                    <strong>Special note:</strong> Avoid grapefruit juice
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-yellow-600 pl-6">
                <h3 className="font-medium mb-2">Diuretics (Water Pills)</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Examples: Hydrochlorothiazide, Furosemide, Spironolactone
                </p>
                <p className="text-gray-600 text-sm mb-2">
                  How they work: Help kidneys remove excess water and sodium
                </p>
                <div className="bg-yellow-50 p-3 rounded">
                  <p className="text-xs text-gray-700">
                    <strong>Common side effects:</strong> Frequent urination, electrolyte imbalances<br />
                    <strong>Special note:</strong> Take in morning to avoid nighttime bathroom trips
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Medication Adherence</h2>

            <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
              <AlertCircle className="h-6 w-6 text-red-600 mb-2" />
              <p className="text-gray-700 font-medium">
                Never stop blood pressure medications without consulting your doctor, even if you feel fine. High blood pressure has no symptoms, and stopping suddenly can be dangerous.
              </p>
            </div>

            <h3 className="font-medium mb-4">Tips for Taking Blood Pressure Medications:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border rounded-lg p-4">
                <Clock className="h-6 w-6 text-blue-600 mb-2" />
                <h4 className="font-medium text-sm mb-2">Same Time Daily</h4>
                <p className="text-xs text-gray-600">
                  Take medications at the same time each day for consistent blood levels
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <div className="h-6 w-6 text-green-600 mb-2">📱</div>
                <h4 className="font-medium text-sm mb-2">Set Reminders</h4>
                <p className="text-xs text-gray-600">
                  Use phone alarms or Long Chau app for medication reminders
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <div className="h-6 w-6 text-purple-600 mb-2">💊</div>
                <h4 className="font-medium text-sm mb-2">Pill Organizers</h4>
                <p className="text-xs text-gray-600">
                  Weekly pill boxes help track if you've taken your dose
                </p>
              </div>
              
              <div className="bg-white border rounded-lg p-4">
                <div className="h-6 w-6 text-orange-600 mb-2">📋</div>
                <h4 className="font-medium text-sm mb-2">Keep a Log</h4>
                <p className="text-xs text-gray-600">
                  Record blood pressure readings and medications taken
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Lifestyle Modifications</h2>

            <p className="text-gray-600 mb-6">
              Medication works best when combined with healthy lifestyle changes. These modifications can significantly improve your blood pressure control:
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🧂</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Reduce Sodium Intake</h3>
                  <p className="text-gray-600 text-sm">
                    Limit to less than 2,300mg daily (about 1 teaspoon). Avoid processed foods, check labels, and use herbs/spices instead of salt.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🏃</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Regular Exercise</h3>
                  <p className="text-gray-600 text-sm">
                    Aim for 150 minutes of moderate exercise weekly. Walking, swimming, and cycling are excellent choices. Start slowly and build up.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Maintain Healthy Weight</h3>
                  <p className="text-gray-600 text-sm">
                    Even a 5-10kg weight loss can significantly reduce blood pressure. Focus on sustainable, gradual weight loss.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🚭</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Quit Smoking</h3>
                  <p className="text-gray-600 text-sm">
                    Smoking damages blood vessels and raises blood pressure. Long Chau offers smoking cessation support products.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🍷</span>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Limit Alcohol</h3>
                  <p className="text-gray-600 text-sm">
                    Men: maximum 2 drinks daily. Women: maximum 1 drink daily. Excessive alcohol raises blood pressure.
                  </p>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">Monitoring at Home</h2>

            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <h3 className="font-medium mb-4">Proper Blood Pressure Measurement:</h3>
              
              <ol className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="font-bold mr-2">1.</span>
                  <span>Sit quietly for 5 minutes before measuring</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">2.</span>
                  <span>Use proper cuff size (ask Long Chau pharmacist)</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">3.</span>
                  <span>Keep feet flat on floor, back supported</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">4.</span>
                  <span>Place cuff on bare arm at heart level</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">5.</span>
                  <span>Take 2-3 readings, 1 minute apart</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-2">6.</span>
                  <span>Record all readings with date and time</span>
                </li>
              </ol>
              
              <div className="mt-4 p-3 bg-white rounded">
                <p className="text-xs text-gray-600">
                  <strong>Pro tip:</strong> Measure at the same times daily, ideally morning and evening before medications.
                </p>
              </div>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Long Chau Heart Health Services</h3>
              <ul className="space-y-3 mb-6">
                <li>✓ Free blood pressure checks at all locations</li>
                <li>✓ Wide selection of home blood pressure monitors</li>
                <li>✓ Medication synchronization programs</li>
                <li>✓ Heart-healthy supplement consultations</li>
                <li>✓ Smoking cessation support</li>
                <li>✓ Medication delivery services</li>
              </ul>
              <p className="text-lg">
                <strong>Heart Health Hotline:</strong> 1800 6928
              </p>
            </div>

            <h2 className="text-2xl font-light mt-12 mb-6">When to Seek Immediate Care</h2>

            <div className="bg-red-50 p-6 rounded-lg mb-8">
              <AlertCircle className="h-8 w-8 text-red-600 mb-3" />
              <h3 className="font-medium mb-3">Call emergency services if you experience:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Chest pain or pressure</li>
                <li>• Severe headache with confusion or vision changes</li>
                <li>• Difficulty breathing</li>
                <li>• Numbness or weakness, especially on one side</li>
                <li>• Blood pressure over 180/120 with symptoms</li>
              </ul>
            </div>

            <div className="bg-gray-100 p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Your Heart Health Journey</h3>
              <p className="text-gray-700">
                Managing blood pressure is a lifelong commitment, but with the right medications, lifestyle changes, and support from your healthcare team, you can significantly reduce your risk of heart disease and stroke.
              </p>
              <p className="text-gray-700 mt-4">
                Remember: Long Chau pharmacists are always available to answer questions about your blood pressure medications, check for interactions, and provide guidance on monitoring devices.
              </p>
            </div>
          </div>

          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img src="/images/cardio-team.jpg" alt="Cardiovascular Specialist Team" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium">Written by Cardiovascular Specialist Team</h3>
                <p className="text-sm text-gray-600">Long Chau's expert cardiovascular pharmacists</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-light mb-8">
              <span className="italic">related</span> ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/journal/managing-chronic-conditions-diabetes" className="group">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src="/journal/managing-chronic-conditions-diabetes.webp"
                    alt="Diabetes care"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-lg font-medium group-hover:underline">
                  Managing Chronic Conditions: Diabetes Care Tips
                </h4>
                <p className="text-sm text-gray-500 mt-2">10 March 2025</p>
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
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}