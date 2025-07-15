"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  // Handle video loading
  useEffect(() => {
    const videoElement = videoRef.current
    
    if (videoElement) {
      const handleLoaded = () => {
        setIsVideoLoaded(true)
      }
      
      videoElement.addEventListener('loadeddata', handleLoaded)
      
      // In case the video is already loaded
      if (videoElement.readyState >= 3) {
        setIsVideoLoaded(true)
      }
      
      return () => {
        videoElement.removeEventListener('loadeddata', handleLoaded)
      }
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video background */}
      <div className="absolute inset-0 bg-gray-900">
        {/* Fallback image shown while video loads */}
        {!isVideoLoaded && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{
              backgroundImage: "url('/banner/pharmacy-hero.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 0,
            }}
          />
        )}
        
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: 1 }}
        >
          <source src="/banner/home.mp4" type="video/mp4" />
          {/* Fallback message for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay to darken video and improve text readability */}
        <div
          className="absolute inset-0 bg-black opacity-40"
          style={{ zIndex: 2 }}
        ></div>
      </div>

      {/* Content layer */}
      <div 
        className="relative h-full flex flex-col justify-center items-center text-center text-white px-4"
        style={{ zIndex: 10 }}
      >
        <h1 className="text-5xl md:text-7xl font-light mb-4">
          <span className="block">Your Health</span>
          <span className="block italic font-serif">Our Priority</span>
        </h1>

        <p className="max-w-xl text-lg mb-8 font-light">
          Vietnam's trusted pharmacy chain delivering quality healthcare products and professional pharmaceutical services nationwide.
        </p>

        <Link
          href="/shop"
          className="bg-white text-gray-900 px-8 py-3 rounded-full flex items-center hover:bg-gray-100 transition-colors group"
        >
          <span className="uppercase tracking-wider text-sm font-medium">Shop Healthcare Products</span>
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  )
}