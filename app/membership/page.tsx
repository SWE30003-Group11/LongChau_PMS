"use client"

import { Gift, Star, CalendarHeart } from "lucide-react";
import Link from "next/link";

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="w-full bg-gradient-to-r from-blue-50 to-blue-100 py-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl md:text-5xl font-light mb-3 tracking-tight text-gray-900">Long Chau Membership</h1>
        <p className="text-lg md:text-xl font-light text-gray-500 max-w-xl text-center">
          Unlock exclusive rewards and savings with your free Long Chau membership.
        </p>
      </header>
      <main className="container mx-auto px-4 py-20 flex-1 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-14 text-center">Membership Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl">
          {/* Points Benefit */}
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-blue-50">
              <Star className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">Earn Points</h3>
            <p className="text-gray-600 mb-1">Get <span className="font-semibold text-blue-600">1 point</span> for every <span className="font-semibold">100,000đ</span> spent.</p>
            <p className="text-gray-400 text-sm">Redeem points for discounts and gifts.</p>
          </div>
          {/* Monthly Discounts */}
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-pink-50">
              <Gift className="h-8 w-8 text-pink-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">Monthly Discounts</h3>
            <p className="text-gray-600 mb-1">Enjoy <span className="font-semibold text-pink-500">exclusive discounts</span> every month.</p>
            <p className="text-gray-400 text-sm">Save more on your favorite products.</p>
          </div>
          {/* Birthday Treat */}
          <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-yellow-50">
              <CalendarHeart className="h-8 w-8 text-yellow-500" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-gray-900">Birthday Treat</h3>
            <p className="text-gray-600 mb-1">Get a <span className="font-semibold text-yellow-500">special gift or discount</span> on your birthday month.</p>
            <p className="text-gray-400 text-sm">Celebrate with Long Chau!</p>
          </div>
        </div>
        <div className="mt-20 flex flex-col items-center">
          <Link href="/account" className="px-10 py-4 bg-gray-900 text-white rounded-full text-lg font-semibold shadow hover:bg-gray-800 transition-colors">
            Join Now For Free
          </Link>
          <p className="text-gray-400 text-sm mt-4">Already a member? <Link href="/account" className="underline hover:text-gray-900">Sign in</Link></p>
        </div>
      </main>
    </div>
  );
} 