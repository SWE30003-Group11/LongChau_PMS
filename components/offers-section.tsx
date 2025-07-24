"use client"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function OffersSection() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block px-4 py-1 bg-white rounded-full text-sm mb-4">QUALITY ASSURANCE</div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900">
              Genuine products,
              <br />
              certified quality,
              <br />
              guaranteed safety!
            </h2>
            <p className="text-gray-600">
              All our products are sourced directly from manufacturers and verified for authenticity. Your health deserves nothing less than genuine care.
            </p>

            <div className="mt-6">
              <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden w-2/3">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: "url('/home/quality-assurance.png')" }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg h-full flex flex-col justify-center min-h-full" style={{ minHeight: '100%' }}>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
              MONTHLY
              <br />
              PROMOTIONS
              <span className="font-light italic text-gray-700 ml-4">for members</span>
            </h2>

            <p className="text-gray-600 mb-8">
              Join Long Chau membership program and enjoy exclusive discounts on healthcare products.
              <br />
              Save up to 20% on selected items every month.
            </p>

            <div className="mb-8 flex-1 flex items-center justify-center">
              {/* Card Switcher State */}
              {(() => {
                const CARD_WIDTH = 480;
                const CARD_HEIGHT = 300;
                const [frontIsFirst, setFrontIsFirst] = useState(true);
                // Animation variants for framer-motion
                const cardVariants = {
                  front: {
                    zIndex: 10,
                    scale: 1,
                    rotate: -8,
                    x: 0,
                    y: 0,
                    boxShadow: "0 16px 48px 0 rgba(31,41,55,0.18)",
                    transition: { type: "spring", stiffness: 300, damping: 30 },
                  },
                  back: {
                    zIndex: 0,
                    scale: 0.95,
                    rotate: 8,
                    x: 60,
                    y: 40,
                    boxShadow: "0 8px 32px 0 rgba(31,41,55,0.12)",
                    transition: { type: "spring", stiffness: 300, damping: 30 },
                  },
                };
                return (
                  <div className="relative" style={{ width: CARD_WIDTH + 60, height: CARD_HEIGHT + 60 }}>
                    {/* Back Card */}
                    <motion.div
                      className="absolute cursor-pointer w-[480px] h-[300px] rounded-3xl overflow-hidden bg-white border border-gray-200"
                      style={{ zIndex: frontIsFirst ? 0 : 10 }}
                      animate={frontIsFirst ? "back" : "front"}
                      variants={cardVariants}
                      onClick={() => setFrontIsFirst(true)}
                    >
                      <img
                        src="/home/member-card-2.png"
                        alt="Long Chau Membership Card Back"
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                      />
                    </motion.div>
                    {/* Front Card */}
                    <motion.div
                      className="absolute cursor-pointer w-[480px] h-[300px] rounded-3xl overflow-hidden bg-white border border-gray-200"
                      style={{ zIndex: frontIsFirst ? 10 : 0 }}
                      animate={frontIsFirst ? "front" : "back"}
                      variants={cardVariants}
                      onClick={() => setFrontIsFirst(false)}
                    >
                      <img
                        src="/home/member-card-1.png"
                        alt="Long Chau Membership Card Front"
                        className="w-full h-full object-cover select-none"
                        draggable={false}
                      />
                    </motion.div>
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end">
              <Link href="/membership" className="flex items-center group">
                <span className="mr-2 text-sm uppercase tracking-wider">Join Now</span>
                <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-gray-800 transition-colors">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}