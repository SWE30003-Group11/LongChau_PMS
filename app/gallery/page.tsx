"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

// Gallery images - no text, just images
const galleryImages = [
  {
    id: 1,
    image: "/gallery/gallery-1.png",
    offsetMultiplier: 0.8,
  },
  {
    id: 2,
    image: "/gallery/gallery-2.png",
    offsetMultiplier: 1.0,
  },
  {
    id: 3,
    image: "/gallery/gallery-3.jpg",
    offsetMultiplier: 0.7,
  },
  {
    id: 4,
    image: "/gallery/gallery-4.jpg",
    offsetMultiplier: 0.9,
  },
  {
    id: 5,
    image: "/gallery/gallery-5.jpg",
    offsetMultiplier: 1.1,
  },
  {
    id: 6,
    image: "/gallery/gallery-6.jpg",
    offsetMultiplier: 0.6,
  },
]

type GalleryImage = {
  id: number
  image: string
  offsetMultiplier: number
}

export default function GalleryPage() {
  const [scrollY, setScrollY] = useState(0)
  const [displayItems, setDisplayItems] = useState<GalleryImage[]>([])
  const bottomObserverRef = useRef(null)
  
  // Initialize display items
  useEffect(() => {
    setDisplayItems([...galleryImages])
  }, [])

  // Handle scroll for parallax effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // When we reach the bottom, add more items
          setDisplayItems(prevItems => {
            const highestId = Math.max(...prevItems.map(item => item.id))
            
            const newItems = galleryImages.map(item => ({
              ...item,
              id: highestId + item.id,
            }))
            
            return [...prevItems, ...newItems]
          })
        }
      },
      { threshold: 0.1 }
    )

    if (bottomObserverRef.current) {
      observer.observe(bottomObserverRef.current)
    }

    return () => {
      if (bottomObserverRef.current) {
        observer.unobserve(bottomObserverRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Center Text - only gallery title, no details */}
      <motion.div 
        className="fixed inset-0 flex items-center justify-center z-10 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="text-center">
          <h1 className="text-7xl md:text-8xl font-playfair text-gray-900 tracking-tight">Long Chau</h1>
          <h2 className="text-7xl md:text-8xl font-playfair italic text-gray-800 tracking-tighter leading-tight">Gallery</h2>
        </div>
      </motion.div>

      {/* Pure Image Gallery - No text, no details */}
      <div className="pt-40 pb-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayItems.map((item, index) => (
              <motion.div
                key={`${item.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index % 6 * 0.1 }}
                style={{
                  transform: `translateY(${scrollY * 0.05 * item.offsetMultiplier}px)`,
                  transition: "transform 0.1s ease-out",
                }}
              >
                {/* Just the image, nothing else */}
                <div className="aspect-[3/4] overflow-hidden">
                  <img
                    src={item.image}
                    alt="" 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom observer element */}
          <div ref={bottomObserverRef} className="h-4" />
        </div>
      </div>
    </div>
  )
}