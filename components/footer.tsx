"use client"

import Link from "next/link"
import { ArrowRight, Send, Instagram, Facebook, Mail, Phone } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Footer() {
  const pathname = usePathname()

  // Don't render footer on account, dashboard, or gallery pages
  if (pathname.startsWith('/account') || 
      pathname.startsWith('/dashboard') || 
      pathname.startsWith('/gallery')) {
    return null
  }

  return (
    <footer className="relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white pointer-events-none opacity-50"></div>
      
      <div className="relative">
        {/* Newsletter Section - Redesigned for elegance */}
        <div className="grid grid-cols-1 lg:grid-cols-5">
          {/* Image section with overlay */}
          <div className="relative h-[400px] lg:h-auto lg:col-span-3 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transform transition-transform duration-10000 hover:scale-105"
              style={{ backgroundImage: "url('/banner/footer.png')" }}
            >
              {/* Gradient overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent"></div>
            </div>
            
            {/* Optional: Floating quote for visual interest */}
            <div className="absolute bottom-8 left-8 max-w-xs">
              <blockquote className="text-white font-light italic text-xl backdrop-blur-sm bg-black/10 p-4 rounded-md border-l-2 border-white/50">
                "Caring for your health is not just a necessity, but an art of living well."
              </blockquote>
            </div>
          </div>
          
          {/* Newsletter form - redesigned */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-12 lg:p-16 lg:col-span-2">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-4xl font-light tracking-tight text-white mb-1">
                  Stay <span className="font-serif italic">Connected</span>
                </h2>
                <div className="h-px w-16 bg-gradient-to-r from-slate-500 to-transparent mb-4"></div>
                <p className="text-slate-300 font-light">
                  Join our community for curated wellness insights and exclusive offers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white/5 border-slate-700 text-white placeholder:text-slate-400 rounded-md py-6 pl-4 pr-12 focus:ring-1 focus:ring-slate-400 focus:border-transparent"
                  />
                  <Button 
                    type="button"
                    size="icon"
                    className="absolute right-1 top-1 bottom-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <Send size={18} className="text-white" />
                  </Button>
                </div>
                
                <p className="text-xs text-slate-400 leading-relaxed">
                  By subscribing, you agree to our Privacy Policy. We promise to respect your inbox.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer - Redesigned for elegance */}
        <div className="container mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24">
            {/* Brand section */}
            <div className="md:w-2/5">
              <div className="mb-6">
                {/* Logo */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-8 h-8">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 rounded-full opacity-10"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-slate-800 font-serif italic text-lg tracking-tighter">LC</span>
                    </div>
                  </div>
                  <span className="text-slate-800 text-xl font-light tracking-wide">Long Chau</span>
                </div>
                
                {/* Brand description */}
                <p className="text-slate-600 font-light leading-relaxed max-w-md">
                  A premium pharmacy chain dedicated to excellence in healthcare services and product quality since 2025.
                </p>
              </div>
              
              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-slate-600 group">
                  <Mail size={18} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
                  <a href="mailto:info@longchau.com" className="hover:text-slate-900 transition-colors">
                    info@longchau.com
                  </a>
                </div>
                <div className="flex items-center gap-3 text-slate-600 group">
                  <Phone size={18} className="text-slate-400 group-hover:text-slate-800 transition-colors" />
                  <a href="tel:1111-2222-3333" className="hover:text-slate-900 transition-colors">
                    1111-2222-3333
                  </a>
                </div>
              </div>
            </div>
            
            {/* Navigation columns */}
            <div className="md:w-3/5 grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Explore column */}
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-4 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-slate-200">
                  Explore
                </h4>
                <ul className="space-y-3">
                  {["Shop", "Philosophy", "Gallery", "Journal", "Sign In"].map((item) => (
                    <li key={item}>
                      <FooterLink href={`/${item.toLowerCase().replace(' ', '-')}`}>
                        {item}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Support column */}
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-4 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-slate-200">
                  Support
                </h4>
                <ul className="space-y-3">
                  {["FAQ", "Shipping", "Returns", "Privacy Policy", "Terms of Service"].map((item) => (
                    <li key={item}>
                      <FooterLink href={`/${item.toLowerCase().replace(' ', '-')}`}>
                        {item}
                      </FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Social column */}
              <div>
                <h4 className="text-sm font-medium text-slate-800 mb-4 relative inline-block after:absolute after:bottom-0 after:left-0 after:w-8 after:h-px after:bg-slate-200">
                  Connect
                </h4>
                <ul className="space-y-3">
                  <li>
                    <FooterLink href="https://instagram.com" className="flex items-center gap-2">
                      <Instagram size={16} />
                      <span>Instagram</span>
                    </FooterLink>
                  </li>
                  <li>
                    <FooterLink href="https://facebook.com" className="flex items-center gap-2">
                      <Facebook size={16} />
                      <span>Facebook</span>
                    </FooterLink>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Footer bottom */}
          <div className="mt-16 pt-6 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-slate-500 font-light mb-4 md:mb-0">
              © 2025 Long Chau Pharmacy. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                Terms
              </Link>
              <Link href="/sitemap" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

// Custom footer link with hover animation
type FooterLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

const FooterLink = ({ href, children, className }: FooterLinkProps) => {
  return (
    <Link 
      href={href} 
      className={`relative text-slate-600 group inline-block ${className || ''}`}
    >
      <span className="group-hover:text-slate-900 transition-colors">{children}</span>
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-300 group-hover:w-full transition-all duration-300"></span>
    </Link>
  )
}