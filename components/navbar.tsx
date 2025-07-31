"use client"

import { useState, useEffect, useRef } from "react"
import { ShoppingBag, User, Menu, X, ArrowRight, Plus, Minus, ChevronDown, LogOut, Package, Settings } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useNotification } from "@/contexts/NotificationContext"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isLogoDropdownOpen, setIsLogoDropdownOpen] = useState(false)
  const { cart, addToCart, removeFromCart } = useCart()
  const { addNotification } = useNotification()
  const logoDropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()
  
  // Check if the current path is a dashboard page
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Handle scroll effect for navbar background
  useEffect(() => {
    if (isDashboardPage) return
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDashboardPage])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isDashboardPage) return
    
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen, isDashboardPage])
  
  // Close logo dropdown when clicking outside
  useEffect(() => {
    if (isDashboardPage) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (logoDropdownRef.current && !logoDropdownRef.current.contains(event.target as Node)) {
        setIsLogoDropdownOpen(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isDashboardPage])

  // Don't render navbar on dashboard page
  if (isDashboardPage) {
    return null
  }

  const handleSignOut = async () => {
    await signOut()
  }

  // Get initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || isMenuOpen ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent",
        )}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Elegant Logo with Dropdown */}
          <div className="relative z-10" ref={logoDropdownRef}>
            {/* Show dropdown only for staff/admin/pharmacist roles */}
            {user && profile?.role && profile.role !== 'customer' ? (
              <motion.div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setIsLogoDropdownOpen(!isLogoDropdownOpen)}
                initial={{ opacity: 1 }}
                whileHover={{ opacity: 0.9 }}
              >
                {/* Logo mark - elegant L and C monogram */}
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-serif italic text-sm tracking-tighter">LC</span>
                  </div>
                </div>
                
                {/* Logo text */}
                <div className="relative overflow-hidden py-2">
                  <span className="text-gray-900 text-xl font-light tracking-wide">Long Chau</span>
                  
                  {/* Animated underline on hover */}
                  <motion.div 
                    className="absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-gray-400/50 via-gray-900/30 to-transparent"
                    initial={{ scaleX: 0.3, opacity: 0 }}
                    animate={{ scaleX: isLogoDropdownOpen ? 1 : 0.3, opacity: isLogoDropdownOpen ? 1 : 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                
                {/* Animated chevron - only points up when open */}
                <motion.div
                  animate={{ rotate: isLogoDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="text-slate-600"
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.div>
            ) : (
              // Simple logo for customers and non-logged in users - no dropdown
              <Link href="/" className="flex items-center gap-3 group">
                {/* Logo mark - elegant L and C monogram */}
                <div className="relative w-8 h-8">
                  <div className="absolute inset-0 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-serif italic text-sm tracking-tighter">LC</span>
                  </div>
                </div>
                
                {/* Logo text */}
                <div className="relative overflow-hidden py-2">
                  <span className="text-gray-900 text-xl font-light tracking-wide">Long Chau</span>
                </div>
              </Link>
            )}
            
            {/* Elegant dropdown menu - positioned below the logo */}
            {user && profile?.role && profile.role !== 'customer' && (
              <AnimatePresence>
                {isLogoDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.98 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute mt-2 z-10 min-w-[220px] backdrop-blur-sm"
                  >
                    {/* Glass morphism container */}
                    <div className="p-1 rounded-lg bg-white/90 shadow-lg border border-slate-200/50 overflow-hidden">
                      {/* Subtle glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent opacity-50 pointer-events-none" />
                      
                      {/* Menu items container */}
                      <div className="relative z-10">
                        {/* Store Option */}
                        <a
                          href="/"
                          className="block px-3 py-3 rounded-md hover:bg-slate-50 cursor-pointer group transition-colors"
                          onClick={() => {
                            setIsLogoDropdownOpen(false)
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-medium group-hover:text-slate-900 transition-colors">
                              Long Chau Store
                            </span>
                            <span className="text-slate-500 text-sm mt-1 font-light">
                              Browse our product catalog
                            </span>
                          </div>
                        </a>
                        
                        {/* Elegant divider */}
                        <div className="mx-3 my-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
                        
                        {/* PMS Option - always shown for staff/admin/pharmacist */}
                        <a
                          href="/dashboard"
                          className="block px-3 py-3 rounded-md hover:bg-slate-50 cursor-pointer group transition-colors"
                          onClick={() => {
                            setIsLogoDropdownOpen(false)
                          }}
                        >
                          <div className="flex flex-col">
                            <span className="text-slate-800 font-medium group-hover:text-slate-900 transition-colors">
                              Long Chau PMS
                            </span>
                            <span className="text-slate-500 text-sm mt-1 font-light">
                              Pharmacy management system
                            </span>
                          </div>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>

          <div className="flex items-center space-x-2 z-10">
            <div className="bg-gray-900 rounded-full flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-white p-2 relative cursor-pointer transition-transform hover:scale-105">
                    <User size={18} />
                    {user && (
                      <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-500 rounded-full ring-2 ring-gray-900"></span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md p-0 border-none">
                  <div className="h-full flex flex-col">
                    <SheetHeader className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <SheetTitle className="text-xl font-medium tracking-wide">Account</SheetTitle>
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <X className="h-5 w-5" />
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-auto p-6">
                      {user ? (
                        <div className="space-y-6">
                          {/* User Profile Section */}
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-16 h-16">
                              <AvatarFallback className="bg-gray-100 text-xl font-medium text-gray-700">
                                {profile 
                                  ? getInitials(profile.full_name || 'User') 
                                  : (user.user_metadata?.full_name 
                                    ? getInitials(user.user_metadata.full_name)
                                    : (user.email ? user.email.charAt(0).toUpperCase() : 'U')
                                  )
                                }
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="text-lg font-medium">
                                {profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
                              </h3>
                              <p className="text-sm text-gray-500">{profile?.email || user.email}</p>
                              {profile?.role && profile.role !== 'customer' && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mt-1">
                                  {profile.role}
                                </span>
                              )}
                            </div>
                          </div>

                          <Separator />

                          {/* Navigation Links */}
                          <nav className="space-y-1">
                            <SheetClose asChild>
                              <Link
                                href="/account/dashboard"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <User className="h-5 w-5 text-gray-500" />
                                <span>My Account</span>
                              </Link>
                            </SheetClose>

                            <SheetClose asChild>
                              <Link
                                href="/account/orders"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Package className="h-5 w-5 text-gray-500" />
                                <span>My Orders</span>
                              </Link>
                            </SheetClose>

                            <SheetClose asChild>
                              <Link
                                href="/account/prescriptions"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <svg
                                  className="h-5 w-5 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                                <span>My Prescriptions</span>
                              </Link>
                            </SheetClose>

                            <SheetClose asChild>
                              <Link
                                href="/account/addresses"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <svg
                                  className="h-5 w-5 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>Saved Addresses</span>
                              </Link>
                            </SheetClose>

                            <SheetClose asChild>
                              <Link
                                href="/account/favorites"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <svg
                                  className="h-5 w-5 text-gray-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                  />
                                </svg>
                                <span>My Favorites</span>
                              </Link>
                            </SheetClose>

                            <SheetClose asChild>
                              <Link
                                href="/account/settings"
                                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                              >
                                <Settings className="h-5 w-5 text-gray-500" />
                                <span>Settings</span>
                              </Link>
                            </SheetClose>

                            {/* Show PMS Dashboard link for staff */}
                            {profile?.role && profile.role !== 'customer' && (
                              <>
                                <Separator className="my-2" />
                                <SheetClose asChild>
                                  <Link
                                    href="/dashboard"
                                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors bg-gray-50"
                                  >
                                    <svg
                                      className="h-5 w-5 text-gray-500"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                      />
                                    </svg>
                                    <span>PMS Dashboard</span>
                                  </Link>
                                </SheetClose>
                              </>
                            )}
                          </nav>

                          <Separator />

                          {/* Sign Out Button */}
                          <SheetClose asChild>
                            <Button
                              variant="outline"
                              className="w-full rounded-full border-gray-300 hover:bg-gray-50 transition-all"
                              onClick={handleSignOut}
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Sign Out
                            </Button>
                          </SheetClose>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                          <h3 className="text-2xl font-playfair mb-2">Welcome</h3>
                          <p className="text-gray-600 mb-8">Sign in to your account or create a new one</p>
                          <div className="space-y-4 w-full max-w-xs">
                            <SheetClose asChild>
                              <Button asChild variant="outline" className="w-full rounded-full border-gray-300 hover:bg-gray-50 transition-all">
                                <Link href="/account">Sign In</Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button asChild className="w-full rounded-full bg-gray-900 hover:bg-gray-800 transition-all">
                                <Link href="/account">Create Account</Link>
                              </Button>
                            </SheetClose>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="h-4 w-px bg-gray-700"></div>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="text-white p-2 relative cursor-pointer transition-transform hover:scale-105">
                    <ShoppingBag size={18} />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-white text-gray-900 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md p-0 border-none">
                  <div className="h-full flex flex-col">
                    <SheetHeader className="p-6 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <SheetTitle className="text-xl font-medium tracking-wide">
                          Cart<sup className="ml-1">({cart.length})</sup>
                        </SheetTitle>
                        <SheetClose asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                            <X className="h-5 w-5" />
                          </Button>
                        </SheetClose>
                      </div>
                    </SheetHeader>

                    <div className="flex-1 overflow-auto p-6">
                      {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                          <h3 className="text-2xl font-playfair mb-2">Your cart is</h3>
                          <p className="text-3xl font-playfair italic mb-8">empty</p>
                          <SheetClose asChild>
                            <Button asChild variant="outline" className="rounded-full border-gray-300 hover:bg-gray-50 transition-all">
                              <a href="/shop" className="flex items-center">
                                <span>BROWSE PRODUCTS</span>
                                <ArrowRight className="ml-2 h-5 w-5" />
                              </a>
                            </Button>
                          </SheetClose>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {cart.map((item) => (
                            <div key={item.id} className="flex gap-4">
                              <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image || "/placeholder.svg?height=80&width=80"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-lg mt-1">₫{item.price}</p>
                                  </div>
                                  <button
                                    onClick={() => {
                                      const result = removeFromCart(item.id)
                                      if (result.item) {
                                        addNotification({
                                          title: 'Removed from Cart',
                                          message: `${result.item.name} has been removed from your cart`,
                                          type: 'info'
                                        })
                                      }
                                    }}
                                    className="text-gray-500 hover:text-gray-700 transition-colors"
                                  >
                                    <X className="h-5 w-5" />
                                  </button>
                                </div>
                                <div className="flex items-center mt-2 border rounded-full overflow-hidden w-fit">
                                  <button
                                    onClick={() => {
                                      if (item.quantity > 1) {
                                        addToCart({ ...item, quantity: item.quantity - 1 })
                                        addNotification({
                                          title: 'Cart Updated',
                                          message: `Decreased quantity of ${item.name}`,
                                          type: 'info'
                                        })
                                      }
                                    }}
                                    className="p-1 px-2 hover:bg-gray-50 transition-colors"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </button>
                                  <span className="px-4">{item.quantity}</span>
                                  <button
                                    onClick={() => {
                                      addToCart({ ...item, quantity: item.quantity + 1 })
                                      addNotification({
                                        title: 'Cart Updated',
                                        message: `Increased quantity of ${item.name}`,
                                        type: 'info'
                                      })
                                    }}
                                    className="p-1 px-2 hover:bg-gray-50 transition-colors"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {cart.length > 0 && (
                      <div className="border-t border-gray-100 p-6">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Subtotal</span>
                          <span className="font-medium">
                            {cart.reduce((total, item) => total + item.price * item.quantity, 0).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                          Shipping, taxes, and discount codes are calculated at checkout
                        </p>
                        <SheetClose asChild>
                          <Button asChild className="w-full rounded-full bg-gray-900 hover:bg-gray-800 transition-all">
                            <Link href="/checkout">
                              <span className="mr-2">CONTINUE TO CHECKOUT</span>
                              <ArrowRight className="h-5 w-5" />
                            </Link>
                          </Button>
                        </SheetClose>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
              <div className="h-4 w-px bg-gray-700"></div>
              {/* Modified menu button that changes icon based on menu state */}
              <button
                className="text-white p-2 relative cursor-pointer transition-all duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Fullscreen Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-white/90 backdrop-blur-md z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-40 flex items-center justify-center"
            >
              <div className="container mx-auto px-4">
                <nav className="flex flex-col items-center space-y-6 text-center">
                  {[
                    { name: "Home", href: "/" },
                    { name: "Shop", href: "/shop" },
                    { name: "About Us", href: "/about-us" },
                    { name: "Gallery", href: "/gallery" },
                    { name: "Health Tips & Advice", href: "/journal" },
                  ].map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <a
                        href={item.href}
                        className="text-5xl md:text-7xl font-playfair text-gray-900 hover:text-gray-600 transition-colors relative group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {item.name}
                        <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-300 group-hover:w-full"></span>
                      </a>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}