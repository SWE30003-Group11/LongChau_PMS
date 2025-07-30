"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, Award, Users, Heart, ArrowRight, Quote, Pill, Stethoscope, Building2 } from "lucide-react"
import { motion, useScroll, useTransform, useInView } from "@/lib/framer"
import { cn } from "@/lib/utils"

// 3D Dot Arch Pill Component
const DotArchPill3D = ({
  size = 300,
  dotSize = 2,
  dotOpacity = 0.8,
  color1 = "#3B82F6",
  color2 = "#06B6D4",
  animated = true
}: {
  size?: number
  dotSize?: number
  dotOpacity?: number
  color1?: string
  color2?: string
  animated?: boolean
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = size
    canvas.height = size * 2

    // Pill parameters
    const pillWidth = size * 0.6
    const pillHeight = size * 1.6
    const centerX = size / 2
    const centerY = size

    // Dot grid parameters
    const rows = 40
    const cols = 30
    const dots: Array<{
      x: number
      y: number
      z: number
      baseX: number
      baseY: number
      baseZ: number
      intensity: number
    }> = []

    // Create dots that form a pill shape
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Map to cylindrical coordinates for pill shape
        const theta = (col / cols) * Math.PI * 2
        const y = (row / rows) * pillHeight - pillHeight / 2

        // Determine radius based on position (capsule shape)
        let radius = pillWidth / 2
        
        // Top hemisphere
        if (y < -pillHeight / 2 + pillWidth / 2) {
          const capY = y + pillHeight / 2 - pillWidth / 2
          radius = Math.sqrt((pillWidth / 2) ** 2 - capY ** 2) || 0
        }
        // Bottom hemisphere
        else if (y > pillHeight / 2 - pillWidth / 2) {
          const capY = y - pillHeight / 2 + pillWidth / 2
          radius = Math.sqrt((pillWidth / 2) ** 2 - capY ** 2) || 0
        }

        if (radius > 0) {
          const x = Math.cos(theta) * radius
          const z = Math.sin(theta) * radius

          // Add some noise for organic feel
          const noise = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 10

          dots.push({
            x: x + noise * 0.1,
            y: y,
            z: z + noise * 0.1,
            baseX: x,
            baseY: y,
            baseZ: z,
            intensity: 0.7 + Math.random() * 0.3
          })
        }
      }
    }

    // Add seam dots - create a ring of dots at y = 0
    const seamDots = 40
    for (let i = 0; i < seamDots; i++) {
      const theta = (i / seamDots) * Math.PI * 2
      const radius = pillWidth / 2
      const x = Math.cos(theta) * radius
      const z = Math.sin(theta) * radius
      
      dots.push({
        x: x,
        y: 0,
        z: z,
        baseX: x,
        baseY: 0,
        baseZ: z,
        intensity: 1 // Full intensity for seam dots
      })
    }

    const animate = () => {
      ctx.clearRect(0, 0, size, size * 2)
      timeRef.current += 0.02

      // Sort dots by z-depth for proper rendering
      const sortedDots = [...dots].sort((a, b) => a.z - b.z)

      sortedDots.forEach((dot, index) => {
        // Apply rotation
        const rotY = animated ? timeRef.current * 0.3 : 0
        const rotZ = animated ? Math.sin(timeRef.current * 0.2) * 0.1 : 0

        // Rotate around Y axis
        const x1 = dot.baseX * Math.cos(rotY) - dot.baseZ * Math.sin(rotY)
        const z1 = dot.baseX * Math.sin(rotY) + dot.baseZ * Math.cos(rotY)

        // Rotate around Z axis
        const x2 = x1 * Math.cos(rotZ) - dot.baseY * Math.sin(rotZ)
        const y2 = x1 * Math.sin(rotZ) + dot.baseY * Math.cos(rotZ)

        // Apply wave animation
        let waveOffset = 0
        if (animated) {
          waveOffset = Math.sin(timeRef.current + index * 0.01) * 2
        }

        // Project to 2D with perspective
        const perspective = 800
        const scale = perspective / (perspective + z1 + 200)
        const projX = centerX + (x2 + waveOffset) * scale
        const projY = centerY + y2 * scale

        // Determine color based on Y position (pill halves)
        let color = dot.baseY < 0 ? color1 : color2
        
        // Special handling for seam dots - make them darker
        if (Math.abs(dot.baseY) < 0.1) {
          color = '#808080' // Dark gray/black for seam
        }

        // Calculate opacity based on z-depth and position
        const depthOpacity = (1 - (z1 + pillWidth / 2) / pillWidth) * 0.5 + 0.5
        const finalOpacity = dotOpacity * dot.intensity * depthOpacity

        // Draw dot
        ctx.beginPath()
        ctx.arc(projX, projY, dotSize * scale, 0, Math.PI * 2)
        ctx.fillStyle = color + Math.floor(finalOpacity * 255).toString(16).padStart(2, '0')
        ctx.fill()

        // Add glow effect for dots in front (except seam dots)
        if (z1 > 0 && Math.abs(dot.baseY) > 0.1) {
          const glowGradient = ctx.createRadialGradient(
            projX, projY, 0,
            projX, projY, dotSize * scale * 3
          )
          glowGradient.addColorStop(0, color + '40')
          glowGradient.addColorStop(1, color + '00')
          ctx.fillStyle = glowGradient
          ctx.fill()
        }
      })

      frameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [size, dotSize, dotOpacity, color1, color2, animated])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ 
        width: size, 
        height: size * 2,
        position: 'relative'
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          filter: 'contrast(1.2)'
        }} 
      />
      
      {/* Ambient glow */}
      <div 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          height: '80%',
          background: `radial-gradient(circle, ${color1}20 0%, transparent 70%)`,
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />
    </motion.div>
  )
}

export default function AboutUsPage() {
  const heroRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  
  const [activeTeamMember, setActiveTeamMember] = useState(0)
  const teamMembers = [
    {
      name: "Le Truong Thien Nguyen",
      position: "Chief Executive Officer",
      bio: "With over 20 years in pharmaceutical retail and healthcare management, Dr. Duc has led Long Chau's expansion to become Vietnam's largest pharmacy chain.",
      image: "/about/thien-1.jpg",
    },
    {
      name: "Minh Phuong Anh Mai",
      position: "Chief Pharmacist",
      bio: "Leading our team of over 5,000 licensed pharmacists nationwide, Dr. Mai ensures the highest standards of pharmaceutical care and patient safety.",
      image: "/about/anh.png",
    },
    {
      name: "Ngoc Huyen Truong",
      position: "Chief Technology Officer",
      bio: "Pioneering digital transformation in Vietnamese healthcare, Viet oversees our e-pharmacy platform and digital health initiatives.",
      image: "/about/huyen.png",
    },
    {
      name: "Pham Thanh Truc Tran",
      position: "Director of Operations",
      bio: "Managing over 1,000 stores nationwide, Nhung ensures consistent service quality and operational excellence across all Long Chau locations.",
      image: "/about/truc.jpg",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Clean with 3D Dot Arch Pill */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-5xl md:text-7xl font-light mb-8 tracking-tight">
                  Vietnam's Leading <span className="italic font-serif">Pharmacy</span> Chain Since 2007
                </h1>
                
                <div className="h-px w-24 bg-gradient-to-r from-gray-400 to-transparent mb-8" />
                
                <p className="text-xl text-gray-600 mb-12 font-light max-w-2xl">
                  From our first store to over 1,000 locations nationwide, Long Chau has been dedicated to making quality healthcare accessible to every Vietnamese family.
                </p>
                
                <a href="#mission" className="inline-flex items-center group">
                  <span className="mr-2 text-gray-900 font-medium">Discover our journey</span>
                  <span className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:bg-gray-900 group-hover:border-gray-900 group-hover:text-white transition-all duration-300">
                    <ArrowRight size={16} />
                  </span>
                </a>
              </motion.div>
            </div>
            
            {/* 3D Dot Arch Pill */}
            <div className="flex justify-center items-center">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              >
                <DotArchPill3D 
                  size={400}
                  dotSize={2.5}
                  dotOpacity={0.8}
                  color1="#3B82F6"
                  color2="#06B6D4"
                  animated={true}
                />
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Decorative line */}
        <motion.div 
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"
        />
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              className="lg:col-span-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 translate-x-3 translate-y-3 opacity-10" />
                <div className="relative aspect-w-4 aspect-h-3 rounded-2xl overflow-hidden">
                  <img
                    src="/about/modern-pharmacy-interior.png"
                    alt="Modern Long Chau pharmacy interior"
                    className="w-full h-full object-cover transform transition-transform duration-10000 hover:scale-105"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-6 space-y-8"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Our Mission</h2>
                <h3 className="text-4xl font-light mb-6">
                  Making quality healthcare <span className="italic font-serif">accessible</span> to all
                </h3>
                <div className="h-px w-16 bg-gradient-to-r from-gray-400 to-transparent mb-8" />
              </div>
              
              <p className="text-gray-600 leading-relaxed">
                Long Chau is more than just a pharmacy chain. We are healthcare partners committed to improving the health and wellbeing of Vietnamese communities through accessible, affordable, and professional pharmaceutical services.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                With licensed pharmacists at every location, genuine products sourced directly from manufacturers, and a commitment to patient education, we ensure that every customer receives the care they deserve.
              </p>
              
              <div className="pt-4">
                <a href="#values" className="text-gray-900 font-medium hover:text-gray-600 transition-colors">
                  Explore our values →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">What Guides Us</h2>
            <h3 className="text-4xl font-light mb-6">
              Our <span className="italic font-serif">values</span>
            </h3>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8" />
            <p className="text-gray-600 leading-relaxed">
              These core principles guide every decision we make and every service we provide.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "Trust & Safety", color: "from-blue-50 to-blue-100", 
                desc: "Every product is verified for authenticity. Every prescription is reviewed by licensed pharmacists. Your safety is our priority." },
              { icon: Users, title: "Community First", color: "from-green-50 to-green-100", 
                desc: "With stores in every province, we're committed to serving Vietnamese communities wherever they are, whenever they need us." },
              { icon: Award, title: "Professional Excellence", color: "from-purple-50 to-purple-100", 
                desc: "Our pharmacists undergo continuous training to provide expert guidance and ensure the highest standards of pharmaceutical care." },
              { icon: Heart, title: "Patient Care", color: "from-rose-50 to-rose-100", 
                desc: "We believe healthcare is a right, not a privilege. That's why we offer affordable options and personalized care for every patient." }
            ].map((value, index) => (
              <motion.div 
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-full bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${value.color}`}>
                    <value.icon className="h-6 w-6 text-gray-700" />
                  </div>
                  <h3 className="text-xl font-medium mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed flex-grow">
                    {value.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

            {/* Journey Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Our Journey</h2>
            <h3 className="text-4xl font-light mb-6">
              From <span className="italic font-serif">one store</span> to <span className="italic font-serif">nationwide</span> presence
            </h3>
            <div className="h-px w-16 bg-gradient-to-r from-gray-400 to-transparent mx-auto mb-8" />
            <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Starting with a single pharmacy in Ho Chi Minh City in 2007, Long Chau has grown to become Vietnam's largest pharmacy chain, serving millions of customers annually through innovation, dedication, and unwavering commitment to healthcare excellence.
            </p>
          </motion.div>

          {/* Enhanced Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Vertical timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200"></div>
            
            <div className="space-y-24">
              {[
                { 
                  year: "2007", 
                  milestone: "First Long Chau pharmacy opens in HCMC",
                  description: "Our journey began with a simple vision: making quality healthcare accessible to every Vietnamese family. The first store set the foundation for our commitment to excellence.",
                  stats: "1 Store • 5 Staff Members • HCMC Only",
                  icon: "🏪"
                },
                { 
                  year: "2015", 
                  milestone: "Expansion to 100 stores nationwide",
                  description: "Rapid growth across Vietnam's major cities, establishing our reputation for quality pharmaceutical services and trusted healthcare solutions.",
                  stats: "100 Stores • 500+ Pharmacists • 15 Provinces",
                  icon: "🚀"
                },
                { 
                  year: "2020", 
                  milestone: "Launch of e-pharmacy platform",
                  description: "Digital transformation during the pandemic, introducing online consultations, home delivery, and telemedicine services to serve customers safely.",
                  stats: "500 Stores • Online Platform • 1M+ App Downloads",
                  icon: "💻"
                },
                { 
                  year: "2024", 
                  milestone: "Over 1,000 stores across 63 provinces",
                  description: "Achieving nationwide coverage with comprehensive healthcare services, from remote villages to major metropolitan areas.",
                  stats: "1,000+ Stores • 5,000+ Staff • All 63 Provinces",
                  icon: "🌟"
                },
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-lg z-10"></div>
                  
                  {/* Content card */}
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
                    {/* Year and icon side */}
                    <div className={`${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:pl-16'}`}>
                      <motion.div
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        className="inline-block"
                      >
                        <div className="text-6xl mb-4">{item.icon}</div>
                        <div className="text-5xl font-light text-gray-900 mb-2">{item.year}</div>
                        <div className="text-sm text-blue-600 font-medium uppercase tracking-wider">
                          {item.stats}
                        </div>
                      </motion.div>
                    </div>
                    
                    {/* Content side */}
                    <div className={`${index % 2 === 0 ? 'lg:pl-16' : 'lg:pr-16'}`}>
                      <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                        <h4 className="text-xl font-semibold text-gray-900 mb-4">
                          {item.milestone}
                        </h4>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {item.description}
                        </p>
                        <div className="h-px w-12 bg-gradient-to-r from-blue-400 to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Achievement highlights */}
          <motion.div 
            className="mt-24 bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-12">
              <h4 className="text-2xl font-light text-gray-900 mb-4">
                Milestones that <span className="italic font-serif">matter</span>
              </h4>
              <p className="text-gray-600">Key achievements that shaped our journey to becoming Vietnam's most trusted pharmacy chain</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Healthcare Innovation",
                  description: "First pharmacy chain in Vietnam to integrate AI-powered medication management and personalized health recommendations",
                  highlight: "Leading Technology"
                },
                {
                  title: "Community Impact",
                  description: "Over 10 million customers served with free health consultations and medicine education programs nationwide",
                  highlight: "10M+ Lives Touched"
                },
                {
                  title: "Quality Assurance",
                  description: "100% authentic products guarantee with direct partnerships with leading pharmaceutical manufacturers globally",
                  highlight: "Zero Counterfeit Record"
                }
              ].map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full mb-4">
                    {achievement.highlight}
                  </div>
                  <h5 className="text-lg font-medium text-gray-900 mb-3">{achievement.title}</h5>
                  <p className="text-gray-600 text-sm leading-relaxed">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-2xl mx-auto text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-2">Leadership</h2>
            <h3 className="text-4xl font-light mb-6">
              Our <span className="italic font-serif">team</span>
            </h3>
            <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto mb-8" />
            <p className="text-gray-600 leading-relaxed">
              Meet the dedicated leaders driving Long Chau's mission to transform healthcare in Vietnam.
            </p>
          </motion.div>

          {/* Interactive team display */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Team navigation */}
            <div className="lg:col-span-4 space-y-6">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={cn(
                    "cursor-pointer p-4 border-l-2 transition-all duration-300",
                    activeTeamMember === index 
                      ? "border-gray-900 bg-white shadow-sm" 
                      : "border-transparent hover:border-gray-200"
                  )}
                  onClick={() => setActiveTeamMember(index)}
                >
                  <h4 className={cn(
                    "text-lg font-medium mb-1 transition-colors",
                    activeTeamMember === index ? "text-gray-900" : "text-gray-600"
                  )}>
                    {member.name}
                  </h4>
                  <p className={cn(
                    "text-sm transition-colors",
                    activeTeamMember === index ? "text-gray-700" : "text-gray-500"
                  )}>
                    {member.position}
                  </p>
                </motion.div>
              ))}
            </div>
            
            {/* Featured team member */}
            <motion.div 
              className="lg:col-span-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={activeTeamMember}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 translate-x-3 translate-y-3 opacity-10" />
                  <div className="relative aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden">
                    <img
                      src={teamMembers[activeTeamMember].image}
                      alt={teamMembers[activeTeamMember].name}
                      className="w-full h-full object-cover transform transition-transform duration-2000 hover:scale-105"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-2xl font-medium mb-2">{teamMembers[activeTeamMember].name}</h4>
                    <p className="text-gray-500">{teamMembers[activeTeamMember].position}</p>
                    <div className="h-px w-12 bg-gradient-to-r from-gray-300 to-transparent my-4" />
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {teamMembers[activeTeamMember].bio}
                  </p>
                  
                  <div className="flex space-x-4 pt-2">
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:bg-gray-900 hover:border-gray-900 hover:text-white">
                      <LinkedinIcon className="h-5 w-5" />
                    </div>
                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center transition-all hover:bg-gray-900 hover:border-gray-900 hover:text-white">
                      <TwitterIcon className="h-5 w-5" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-light text-center mb-16">
              Long Chau by the <span className="italic font-serif">numbers</span>
            </h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { number: "1,000+", label: "Pharmacy Locations" },
                { number: "5,000+", label: "Licensed Pharmacists" },
                { number: "10M+", label: "Customers Served Annually" },
                { number: "63", label: "Provinces Covered" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <p className="text-5xl font-light mb-2">{stat.number}</p>
                  <p className="text-gray-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-12 relative">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center">
                  <Quote className="h-8 w-8 text-gray-400" />
                </div>
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border border-gray-100"></div>
              </div>
              
              <h2 className="text-4xl font-light mb-8 tracking-tight">
                Our Promise to <span className="italic font-serif">You</span>
              </h2>
              
              <div className="h-px w-16 bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-10" />
              
              <p className="text-xl text-gray-600 mb-12 font-light max-w-2xl">
                We promise to continue serving Vietnamese communities with integrity, professionalism, and care. Your health is our mission, and your trust is our greatest achievement.
              </p>
              
              <div className="relative">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2 }}
                  className="absolute h-px bg-gray-200 top-0 left-0 right-0"
                />
                <blockquote className="pt-10 max-w-lg mx-auto">
                  <p className="text-gray-700 italic text-lg text-center">
                    "Every prescription filled, every consultation given, every product sold - it all serves one purpose: improving the health and wellbeing of our community."
                  </p>
                  <footer className="text-gray-500 mt-4 text-center">— Long Chau Leadership Team</footer>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

const Check = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
)