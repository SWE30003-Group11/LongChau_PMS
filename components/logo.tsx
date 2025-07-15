"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function Logo() {
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1 text-2xl font-playfair font-bold text-gray-900 z-10 group"
      >
        <span className="relative">
          <span className="relative z-10">Long Chau</span>
          <motion.span
            className="absolute -bottom-1 left-0 h-[3px] bg-gray-900 w-0 group-hover:w-full transition-all duration-300"
            initial={{ width: 0 }}
            animate={{ width: showDropdown ? "100%" : 0 }}
          />
        </span>
        {showDropdown ? (
          <ChevronUp className="h-4 w-4 mt-1 transition-transform duration-300" />
        ) : (
          <ChevronDown className="h-4 w-4 mt-1 transition-transform duration-300" />
        )}
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg overflow-hidden z-50 min-w-[200px]"
          >
            <div className="py-1">
              <Link
                href="/"
                className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                onClick={() => setShowDropdown(false)}
              >
                Long Chau Store
              </Link>
              <button
                onClick={() => {
                  router.push("/dashboard")
                  setShowDropdown(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
              >
                Long Chau PMS
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
