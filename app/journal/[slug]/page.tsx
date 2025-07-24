"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Twitter, Facebook, Share2, Link2 } from "lucide-react"
import { useEffect, useState } from "react"
import { healthArticles } from "../page" // Import from parent directory
import React from "react"

export default function HealthTipsArticlePage() {
  const params = useParams()
  const slug = params?.slug as string
  const article = healthArticles[slug as keyof typeof healthArticles]
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

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="text-center">
          <h1 className="text-2xl font-light mb-4">Article not found</h1>
          <Link href="/journal" className="text-blue-600 hover:underline">
            Return to Health Tips
          </Link>
        </div>
      </div>
    )
  }

  // Get related articles (exclude current article)
  const relatedArticles = Object.values(healthArticles)
    .filter(a => a.slug !== slug)
    .slice(0, 3)

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Fixed social sharing sidebar */}
      <div
        className={`fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 transition-opacity duration-300 z-50 ${
          showShareButtons ? "opacity-100" : "opacity-0"
        }`}
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

      <div className="container mx-auto px-4">
        <Link href="/journal" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Health Tips
        </Link>

        <article className="max-w-4xl mx-auto">
          {/* Article Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="order-2 md:order-1">
              <div className="text-gray-500 mb-2">{article.date} • By {article.author}</div>
              <h1 className="text-4xl md:text-5xl font-light mb-6">
                {article.title}
              </h1>
              <div className="bg-blue-900 text-white p-6 rounded-lg">
                <p className="text-white/90">
                  {article.excerpt}
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
                  src={article.image ? article.image : "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Article Content - Render based on slug */}
          <div className="max-w-3xl mx-auto prose prose-lg">
            {slug === "understanding-your-medications-guide" && (
              <>
                <p className="text-gray-600 mb-8">
                  At Long Chau Pharmacy, we believe that patient education is the cornerstone of safe and effective medication use. With over 1,000 locations nationwide and thousands of licensed pharmacists, we're committed to helping you understand your medications better.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">1. Reading Your Prescription Label</h2>
                <p className="text-gray-600 mb-8">
                  Every prescription label contains vital information. Understanding these details ensures you take your medications safely and effectively. Our pharmacists are always available to explain any part of your prescription that seems unclear.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">2. Proper Storage of Medications</h2>
                <p className="text-gray-600 mb-8">
                  Proper storage ensures your medications remain effective and safe. Most medications should be stored in a cool, dry place away from direct sunlight. Some medications require refrigeration - always check with your Long Chau pharmacist.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">3. Taking Medications Safely</h2>
                <p className="text-gray-600 mb-8">
                  Following your medication schedule is crucial for treatment success. Use medication reminders, pill organizers, or our Long Chau app to help maintain your routine. Never adjust dosages without consulting your healthcare provider.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">4. Understanding Drug Interactions</h2>
                <p className="text-gray-600 mb-8">
                  Drug interactions can affect how your medications work or increase side effects. Always inform your healthcare providers about all medications, supplements, and herbal products you're taking.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">5. When to Contact Your Pharmacist</h2>
                <p className="text-gray-600 mb-8">
                  Don't hesitate to reach out to your Long Chau pharmacist if you experience unexpected side effects, have questions about your medications, or need clarification on dosing instructions.
                </p>
              </>
            )}

            {slug === "managing-chronic-conditions-diabetes" && (
              <>
                <p className="text-gray-600 mb-8">
                  Diabetes affects millions of Vietnamese, and proper management is crucial for preventing complications and maintaining quality of life. At Long Chau Pharmacy, we're committed to supporting you with medications, supplies, and expert guidance every step of the way.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Understanding Diabetes Types</h2>
                <p className="text-gray-600 mb-8">
                  There are two main types of diabetes. Type 1 diabetes is an autoimmune condition requiring daily insulin, while Type 2 diabetes involves insulin resistance and can often be managed with lifestyle changes and oral medications.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Essential Medication Management</h2>
                <p className="text-gray-600 mb-8">
                  Long Chau stocks a complete range of diabetes medications including Metformin, various insulin formulations, DPP-4 inhibitors, and SGLT2 inhibitors. Our pharmacists can help you understand how each medication works.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Blood Sugar Monitoring</h2>
                <p className="text-gray-600 mb-8">
                  Regular monitoring is essential for diabetes management. We offer glucometers, test strips, lancets, and continuous glucose monitoring systems. Our staff can demonstrate proper testing techniques.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Lifestyle Management Tips</h2>
                <p className="text-gray-600 mb-8">
                  Successful diabetes management includes healthy eating, regular exercise, medication adherence, and stress management. Our pharmacists can connect you with nutritionists and diabetes educators.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Preventing Complications</h2>
                <p className="text-gray-600 mb-8">
                  Regular check-ups for eyes, feet, heart, and kidneys are crucial. Long Chau offers screening services and specialized diabetic care products to help prevent complications.
                </p>
              </>
            )}

            {slug === "seasonal-health-flu-prevention" && (
              <>
                <p className="text-gray-600 mb-8">
                  Flu season in Vietnam typically peaks during the rainy season and cooler months. Understanding prevention strategies and knowing when to seek treatment can help you stay healthy year-round.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Understanding Flu Season in Vietnam</h2>
                <p className="text-gray-600 mb-8">
                  The influenza virus spreads more easily during certain times of the year. In Vietnam, we see increased cases during May to October and December to February. Being prepared is your best defense.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Prevention Strategies</h2>
                <p className="text-gray-600 mb-8">
                  Annual flu vaccination is your best protection. Long Chau offers flu vaccines at all locations. Additionally, frequent handwashing, avoiding touching your face, and maintaining good general health all contribute to prevention.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Recognizing Flu Symptoms</h2>
                <p className="text-gray-600 mb-8">
                  Flu symptoms include fever, body aches, fatigue, and respiratory symptoms. Unlike a cold, flu symptoms come on suddenly and are more severe. Early treatment with antiviral medications can reduce severity.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">When to Seek Medical Care</h2>
                <p className="text-gray-600 mb-8">
                  Seek immediate medical attention for difficulty breathing, chest pain, confusion, or severe dehydration. High-risk groups including elderly, pregnant women, and those with chronic conditions should consult healthcare providers early.
                </p>
              </>
            )}

            {slug === "essential-vitamins-supplements-guide" && (
              <>
                <p className="text-gray-600 mb-8">
                  Navigating the world of vitamins and supplements can be overwhelming. This guide helps you understand which supplements may benefit you and how to take them safely.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Essential Vitamins for Daily Health</h2>
                <p className="text-gray-600 mb-8">
                  Key vitamins include Vitamin D for bone health and immune function, Vitamin C for immune support, and B-Complex vitamins for energy metabolism. Long Chau carries high-quality supplements from trusted manufacturers.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Choosing Quality Supplements</h2>
                <p className="text-gray-600 mb-8">
                  Not all supplements are created equal. Look for third-party tested products, check expiration dates, and choose reputable brands. Our pharmacists can help you select appropriate supplements for your needs.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Proper Dosing and Timing</h2>
                <p className="text-gray-600 mb-8">
                  Some vitamins are best taken with food, while others absorb better on an empty stomach. Fat-soluble vitamins (A, D, E, K) should be taken with meals containing healthy fats.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Potential Interactions</h2>
                <p className="text-gray-600 mb-8">
                  Supplements can interact with medications. Always inform your healthcare provider and pharmacist about all supplements you're taking. Some supplements can affect blood clotting, blood sugar, or medication absorption.
                </p>
              </>
            )}

            {slug === "antibiotic-resistance-awareness" && (
              <>
                <p className="text-gray-600 mb-8">
                  Antibiotic resistance is one of the biggest threats to global health today. Understanding how to use antibiotics responsibly is crucial for preserving their effectiveness for future generations.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">What is Antibiotic Resistance?</h2>
                <p className="text-gray-600 mb-8">
                  Antibiotic resistance occurs when bacteria evolve to survive medications designed to kill them. This makes infections harder to treat and increases the risk of disease spread, severe illness, and death.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">How Resistance Develops</h2>
                <p className="text-gray-600 mb-8">
                  Resistance develops when antibiotics are overused or misused. Taking antibiotics for viral infections, not completing prescribed courses, or sharing antibiotics all contribute to resistance.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Using Antibiotics Responsibly</h2>
                <p className="text-gray-600 mb-8">
                  Only take antibiotics prescribed for you, complete the full course even if you feel better, never share antibiotics, and don't save leftover antibiotics. Trust your healthcare provider's judgment on whether antibiotics are needed.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Prevention is Key</h2>
                <p className="text-gray-600 mb-8">
                  Preventing infections reduces the need for antibiotics. Practice good hygiene, stay up-to-date with vaccinations, handle food safely, and avoid close contact with sick people when possible.
                </p>
              </>
            )}

            {slug === "heart-health-blood-pressure-management" && (
              <>
                <p className="text-gray-600 mb-8">
                  High blood pressure affects millions of Vietnamese and is a major risk factor for heart disease and stroke. Understanding your medications and lifestyle factors is key to successful management.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Understanding Blood Pressure</h2>
                <p className="text-gray-600 mb-8">
                  Blood pressure is the force of blood against artery walls. Normal blood pressure is below 120/80 mmHg. High blood pressure often has no symptoms, making regular monitoring essential.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Common Blood Pressure Medications</h2>
                <p className="text-gray-600 mb-8">
                  Long Chau stocks various blood pressure medications including ACE inhibitors, beta blockers, diuretics, and calcium channel blockers. Each works differently, and your doctor will prescribe based on your specific needs.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Medication Adherence</h2>
                <p className="text-gray-600 mb-8">
                  Taking blood pressure medications consistently is crucial. Set reminders, use pill organizers, and never stop medications without consulting your doctor, even if you feel fine.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Lifestyle Modifications</h2>
                <p className="text-gray-600 mb-8">
                  Medication works best combined with lifestyle changes. Reduce sodium intake, maintain a healthy weight, exercise regularly, limit alcohol, quit smoking, and manage stress.
                </p>

                <h2 className="text-2xl font-light mt-12 mb-4">Monitoring at Home</h2>
                <p className="text-gray-600 mb-8">
                  Home blood pressure monitoring helps track your progress. Long Chau offers various blood pressure monitors and our pharmacists can teach you proper measurement techniques.
                </p>
              </>
            )}

            <div className="bg-blue-900 text-white p-8 rounded-lg my-12">
              <h3 className="text-xl font-light mb-4">Need Professional Advice?</h3>
              <p className="mb-4">
                Our licensed pharmacists are available 24/7 at select locations to answer your questions and provide guidance.
              </p>
              <p className="text-lg font-medium">
                Long Chau Hotline: 1800 6928
              </p>
            </div>
          </div>

          {/* Author Section */}
          <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                <img 
                  src="/images/author-placeholder.jpg" 
                  alt={article.author} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="font-medium">Written by {article.author}</h3>
                <p className="text-sm text-gray-600">Healthcare professional at Long Chau Pharmacy</p>
              </div>
            </div>
          </div>

          {/* Related Articles */}
          <div className="max-w-4xl mx-auto mt-16">
            <h3 className="text-2xl font-light mb-8">
              <span className="italic">related</span> ARTICLES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link 
                  key={relatedArticle.slug} 
                  href={`/journal/${relatedArticle.slug}`} 
                  className="group"
                >
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={relatedArticle.image ? relatedArticle.image : "/placeholder.svg"}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="text-lg font-medium group-hover:underline">
                    {relatedArticle.title}
                  </h4>
                  <p className="text-sm text-gray-500 mt-2">{relatedArticle.date}</p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}