"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

// Shared articles data that will be used in both landing page and article pages
export const healthArticles = {
  "understanding-your-medications-guide": {
    id: 1,
    title: "Understanding Your Medications: A Complete Guide to Safe Usage",
    excerpt: "Learn how to properly store, take, and manage your medications. Our comprehensive guide covers everything from reading prescription labels to understanding drug interactions and side effects.",
    date: "15 March 2025",
    image: "/journal/understanding-your-medications-guide.webp",
    slug: "understanding-your-medications-guide",
    readTime: "8 min read",
    category: "Medication Safety",
    author: "Dr. Pham Thi Mai, Chief Pharmacist",
    featured: true
  },
  "managing-chronic-conditions-diabetes": {
    id: 2,
    title: "Managing Chronic Conditions: Diabetes Care Tips",
    excerpt: "Comprehensive guide to managing diabetes through proper medication, blood sugar monitoring, and lifestyle changes. Learn from our expert pharmacists about the latest treatments and management strategies.",
    date: "10 March 2025",
    image: "/journal/managing-chronic-conditions-diabetes.webp",
    slug: "managing-chronic-conditions-diabetes",
    readTime: "6 min read",
    category: "Chronic Care",
    author: "Dr. Nguyen Van Duc"
  },
  "seasonal-health-flu-prevention": {
    id: 3,
    title: "Seasonal Health: Preventing Common Flu and Cold",
    excerpt: "Stay healthy during flu season with our prevention guide. Learn about vaccines, immunity boosters, and when to seek medical attention.",
    date: "5 March 2025",
    image: "/journal/seasonal-health-flu-prevention.jpg",
    slug: "seasonal-health-flu-prevention",
    readTime: "5 min read",
    category: "Prevention",
    author: "Long Chau Pharmacy Team"
  },
  "essential-vitamins-supplements-guide": {
    id: 4,
    title: "Essential Vitamins and Supplements: What You Need to Know",
    excerpt: "Navigate the world of vitamins and supplements with confidence. Our guide helps you understand which supplements you need and how to take them safely.",
    date: "28 February 2025",
    image: "/journal/essential-vitamins-supplements-guide.webp",
    slug: "essential-vitamins-supplements-guide",
    readTime: "7 min read",
    category: "Wellness",
    author: "Pharmacy Expert Team"
  },
  "antibiotic-resistance-awareness": {
    id: 5,
    title: "Antibiotic Resistance: Why Completing Your Course Matters",
    excerpt: "Understanding antibiotic resistance and why it's crucial to complete your prescribed course. Learn how to use antibiotics responsibly.",
    date: "20 February 2025",
    image: "/journal/antibiotic-resistance-awareness.jpg",
    slug: "antibiotic-resistance-awareness",
    readTime: "5 min read",
    category: "Medication Safety",
    author: "Dr. Le Thi Huong"
  },
  "heart-health-blood-pressure-management": {
    id: 6,
    title: "Heart Health: Managing Blood Pressure Medications",
    excerpt: "Everything you need to know about blood pressure medications, from ACE inhibitors to beta-blockers. Tips for medication adherence and lifestyle management.",
    date: "15 February 2025",
    image: "/journal/heart-health-blood-pressure-management.avif",
    slug: "heart-health-blood-pressure-management",
    readTime: "6 min read",
    category: "Chronic Care",
    author: "Cardiovascular Specialist Team"
  }
}

const categories = ["All", "Medication Safety", "Chronic Care", "Prevention", "Wellness"]

export default function HealthTipsPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  // Convert articles object to array
  const articlesArray = Object.values(healthArticles)
  
  // Get featured article based on selected category
  const getFeaturedArticle = () => {
    if (activeCategory === "All") {
      // Show the original featured article for "All" category
      return articlesArray.find(article => 'featured' in article && article.featured)
    } else {
      // Show the first article from the selected category as featured
      const categoryArticles = articlesArray.filter(article => article.category === activeCategory)
      return categoryArticles.length > 0 ? categoryArticles[0] : null
    }
  }
  
  const featuredArticle = getFeaturedArticle()
  
  // Filter out the featured article from the regular articles to avoid duplication
  const regularArticles = articlesArray.filter(article => {
    // Exclude the original featured article when "All" is selected
    if (activeCategory === "All") {
      return !("featured" in article && article.featured)
    } else {
      // Exclude the article that's currently being shown as featured
      return article.id !== featuredArticle?.id
    }
  })

  const filteredArticles = regularArticles.filter(article => 
    activeCategory === "All" || article.category === activeCategory
  )

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl font-light italic text-gray-700">health</h2>
          <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6">TIPS & ADVICE</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Professional healthcare guidance from Long Chau's expert pharmacists. Your trusted source for medication information and health advice.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-4 py-2 text-sm rounded-full transition-colors ${
                  activeCategory === category ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {featuredArticle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-20"
          >
            <Link href={`/journal/${featuredArticle.slug}`} className="group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={featuredArticle.image || "/placeholder.svg"}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-3 text-gray-500 mb-4">
                    <span className="text-sm uppercase tracking-wider">
                      {activeCategory === "All" ? "FEATURED" : activeCategory}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                    <span className="text-sm">{featuredArticle.readTime}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light mb-4 group-hover:text-gray-700 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{featuredArticle.excerpt}</p>
                  <p className="text-sm text-gray-500 mb-6">By {featuredArticle.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{featuredArticle.date}</span>
                    <span className="text-gray-900 group-hover:underline">Read more</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/journal/${article.slug}`} className="group block">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 bg-gray-100">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex items-center space-x-3 text-gray-500 mb-2">
                  <span className="text-xs uppercase tracking-wider">{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                  <span className="text-xs">{article.readTime}</span>
                </div>
                <h3 className="text-xl font-medium mb-3 group-hover:text-gray-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{article.excerpt}</p>
                <p className="text-xs text-gray-500 mb-3">By {article.author}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{article.date}</span>
                  <span className="text-gray-900 text-sm group-hover:underline">Read more</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}