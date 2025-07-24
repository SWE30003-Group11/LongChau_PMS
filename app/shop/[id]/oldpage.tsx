"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, Shield, Truck, Clock, AlertCircle, FileText, Package, Heart, Phone, MessageCircle, CheckCircle, XCircle, Info, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { useCart } from "@/hooks/use-cart"

// Comprehensive pharmacy product data
const products = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    genericName: "Acetaminophen",
    price: 25000,
    originalPrice: 30000,
    image: "/products/paracetamol-main.jpg",
    category: "Pain Relief",
    manufacturer: "DHG Pharma",
    prescriptionRequired: false,
    inStock: true,
    packSize: "Box of 100 tablets",
    strength: "500mg",
    images: [
      "/products/paracetamol-1.jpg",
      "/products/paracetamol-2.jpg",
      "/products/paracetamol-3.jpg",
    ],
    description: "Paracetamol is a widely used analgesic and antipyretic medication. It provides effective relief from mild to moderate pain and helps reduce fever. This trusted medication has been used safely for decades and is suitable for most adults and children when used as directed.",
    
    // Key features for hero section
    keyFeatures: {
      mainBenefit: "Fast-acting pain relief",
      duration: "4-6 hours",
      onset: "15-30 minutes",
      form: "Easy-to-swallow tablets"
    },
    
    // Active and inactive ingredients
    activeIngredient: "Paracetamol 500mg",
    inactiveIngredients: "Corn starch, Povidone, Sodium starch glycolate, Magnesium stearate, Purified water",
    
    // Medical information
    indications: [
      "Relief of mild to moderate pain including headache",
      "Migraine and tension headaches",
      "Muscle aches and backache",
      "Toothache and dental pain",
      "Common cold and flu symptoms",
      "Reduction of fever"
    ],
    
    mechanismOfAction: "Paracetamol works by inhibiting prostaglandin synthesis in the central nervous system and blocking pain impulses. It also acts on the hypothalamic heat-regulating center to produce antipyresis (fever reduction).",
    
    pharmacokinetics: {
      absorption: "Rapidly absorbed from the gastrointestinal tract",
      distribution: "Uniformly distributed throughout body fluids",
      metabolism: "Metabolized primarily in the liver",
      elimination: "Excreted in urine, half-life 1-4 hours"
    },
    
    // Dosage information
    dosage: {
      adults: "1-2 tablets (500-1000mg) every 4-6 hours as needed. Maximum 4g (8 tablets) in 24 hours.",
      children: {
        "6-12 years": "250-500mg every 4-6 hours. Maximum 4 doses in 24 hours.",
        "Under 6 years": "Consult a healthcare provider for appropriate dosing."
      },
      elderly: "No special dosage adjustments required unless liver or kidney function is impaired.",
      specialPopulations: "Patients with liver or kidney disease should consult their doctor for appropriate dosing."
    },
    
    // Contraindications and warnings
    contraindications: [
      "Hypersensitivity to paracetamol or any excipients",
      "Severe liver impairment or active liver disease",
      "Severe kidney impairment (CrCl < 10 mL/min)"
    ],
    
    warnings: [
      "Do not exceed recommended dose - overdose may cause severe liver damage",
      "Avoid alcohol while taking this medication",
      "Consult doctor if symptoms persist for more than 3 days",
      "Use with caution in patients with liver or kidney disease",
      "Contains paracetamol - do not take with other paracetamol-containing products"
    ],
    
    precautions: [
      "Chronic alcohol users should limit intake",
      "May interact with warfarin - monitor INR",
      "Use caution in dehydrated or malnourished patients"
    ],
    
    // Side effects
    sideEffects: {
      common: [
        "Generally well tolerated at recommended doses",
        "Rare nausea or stomach upset"
      ],
      uncommon: [
        "Allergic skin reactions (rash, itching)",
        "Blood disorders (very rare)"
      ],
      serious: [
        "Severe skin reactions (seek immediate medical attention)",
        "Signs of overdose: nausea, vomiting, loss of appetite, pallor"
      ]
    },
    
    // Drug interactions
    interactions: [
      {
        drug: "Warfarin",
        effect: "May enhance anticoagulant effect with prolonged use",
        recommendation: "Monitor INR if used regularly"
      },
      {
        drug: "Alcohol",
        effect: "Increased risk of liver damage",
        recommendation: "Avoid alcohol consumption"
      },
      {
        drug: "Other paracetamol products",
        effect: "Risk of overdose",
        recommendation: "Do not use together"
      }
    ],
    
    // Storage and handling
    storage: "Store below 30°C in a dry place. Keep out of reach of children. Do not use after expiry date.",
    shelfLife: "36 months from manufacture date",
    
    // Regulatory information
    registrationNumber: "VD-12345-11",
    barcode: "8934564120015",
    
    // Additional product info
    pregnancyCategory: "Category A - Safe in pregnancy when used as directed",
    lactation: "Safe during breastfeeding at recommended doses",
    
    // Quality attributes
    qualityFeatures: [
      { icon: Shield, text: "GMP Certified Manufacturing" },
      { icon: CheckCircle, text: "Quality Tested" },
      { icon: Package, text: "Tamper-Evident Packaging" },
      { icon: Info, text: "Complete Drug Information" }
    ],
    
    // Related products
    relatedProducts: [
      {
        id: 2,
        name: "Ibuprofen 400mg",
        price: 35000,
        image: "/products/ibuprofen.jpg",
      },
      {
        id: 3,
        name: "Aspirin 500mg", 
        price: 28000,
        image: "/products/aspirin.jpg",
      },
      {
        id: 4,
        name: "Paracetamol Syrup 120mg/5ml",
        price: 45000,
        image: "/products/paracetamol-syrup.jpg",
      }
    ],
    
    // Frequently bought together
    bundleProducts: [
      {
        id: 5,
        name: "Vitamin C 1000mg",
        price: 65000,
        image: "/products/vitamin-c.jpg"
      },
      {
        id: 6,
        name: "Throat Lozenges",
        price: 25000,
        image: "/products/lozenges.jpg"
      }
    ]
  },
  {
    id: 2,
    name: "Amoxicillin 500mg",
    genericName: "Amoxicillin",
    price: 85000,
    originalPrice: 95000,
    image: "/products/amoxicillin-main.jpg",
    category: "Antibiotics",
    manufacturer: "Imexpharm",
    prescriptionRequired: true,
    inStock: true,
    packSize: "Box of 20 capsules",
    strength: "500mg",
    images: [
      "/products/amoxicillin-1.jpg",
      "/products/amoxicillin-2.jpg",
      "/products/amoxicillin-3.jpg",
    ],
    description: "Amoxicillin is a broad-spectrum penicillin antibiotic used to treat various bacterial infections. It works by stopping the growth of bacteria and is effective against many common infections when prescribed by a healthcare professional.",
    
    keyFeatures: {
      mainBenefit: "Broad-spectrum antibiotic",
      duration: "7-10 days course",
      onset: "1-2 hours",
      form: "Easy-to-take capsules"
    },
    
    activeIngredient: "Amoxicillin trihydrate equivalent to 500mg amoxicillin",
    inactiveIngredients: "Magnesium stearate, Sodium starch glycolate, Microcrystalline cellulose, Gelatin capsule shell",
    
    indications: [
      "Upper respiratory tract infections (pharyngitis, sinusitis)",
      "Lower respiratory tract infections (bronchitis, pneumonia)",
      "Urinary tract infections",
      "Skin and soft tissue infections",
      "Dental abscesses",
      "H. pylori eradication (in combination therapy)"
    ],
    
    mechanismOfAction: "Amoxicillin inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins, leading to bacterial cell death. It is bactericidal against susceptible organisms.",
    
    pharmacokinetics: {
      absorption: "Well absorbed orally, not affected by food",
      distribution: "Widely distributed in body tissues and fluids",
      metabolism: "Partially metabolized to inactive penicilloic acid",
      elimination: "60-70% excreted unchanged in urine within 6-8 hours"
    },
    
    dosage: {
      adults: "500mg every 8 hours or 875mg every 12 hours, depending on infection severity",
      children: {
        "Over 40kg": "Same as adult dose",
        "Under 40kg": "20-40mg/kg/day divided into 3 doses"
      },
      elderly: "No dosage adjustment needed unless severe renal impairment",
      specialPopulations: "Reduce dose in severe renal impairment (CrCl < 30 mL/min)"
    },
    
    contraindications: [
      "Hypersensitivity to penicillins or cephalosporins",
      "History of amoxicillin-associated cholestatic jaundice",
      "Infectious mononucleosis (high risk of rash)"
    ],
    
    warnings: [
      "Complete the full course even if symptoms improve",
      "May cause allergic reactions - stop use if rash develops",
      "Can reduce effectiveness of oral contraceptives",
      "May cause false positive glucose tests",
      "Risk of antibiotic-associated diarrhea"
    ],
    
    sideEffects: {
      common: [
        "Diarrhea",
        "Nausea",
        "Skin rash",
        "Vomiting"
      ],
      uncommon: [
        "Allergic reactions (urticaria, pruritus)",
        "Candidiasis (thrush)",
        "Dizziness",
        "Headache"
      ],
      serious: [
        "Anaphylactic reaction (rare but serious)",
        "Stevens-Johnson syndrome (very rare)",
        "Antibiotic-associated colitis"
      ]
    },
    
    interactions: [
      {
        drug: "Oral contraceptives",
        effect: "May reduce contraceptive effectiveness",
        recommendation: "Use additional contraception during treatment"
      },
      {
        drug: "Probenecid",
        effect: "Increases amoxicillin levels",
        recommendation: "May require dose adjustment"
      },
      {
        drug: "Allopurinol",
        effect: "Increased risk of skin rash",
        recommendation: "Monitor for rash development"
      }
    ],
    
    storage: "Store below 25°C in a dry place. Keep container tightly closed.",
    shelfLife: "24 months from manufacture date",
    
    registrationNumber: "VD-23456-15",
    barcode: "8934564120022",
    
    pregnancyCategory: "Category B - Generally safe in pregnancy",
    lactation: "Excreted in breast milk in small amounts - use with caution",
    
    qualityFeatures: [
      { icon: Shield, text: "WHO-GMP Certified" },
      { icon: CheckCircle, text: "Bioequivalence Tested" },
      { icon: Package, text: "Moisture-Protected Packaging" },
      { icon: Info, text: "Complete Prescribing Information" }
    ],
    
    relatedProducts: [
      {
        id: 7,
        name: "Augmentin 625mg",
        price: 120000,
        image: "/products/augmentin.jpg",
      },
      {
        id: 8,
        name: "Cefixime 200mg",
        price: 95000,
        image: "/products/cefixime.jpg",
      },
      {
        id: 9,
        name: "Azithromycin 500mg",
        price: 110000,
        image: "/products/azithromycin.jpg",
      }
    ],
    
    bundleProducts: [
      {
        id: 10,
        name: "Probiotic Capsules",
        price: 85000,
        image: "/products/probiotics.jpg"
      },
      {
        id: 11,
        name: "Vitamin B Complex",
        price: 45000,
        image: "/products/vitamin-b.jpg"
      }
    ]
  },
  {
    id: 3,
    name: "Omron HEM-7120 Blood Pressure Monitor",
    genericName: "Digital Blood Pressure Monitor",
    price: 850000,
    originalPrice: 1200000,
    image: "/products/bp-monitor-main.jpg",
    category: "Medical Devices",
    manufacturer: "Omron Healthcare",
    prescriptionRequired: false,
    inStock: true,
    packSize: "1 unit with arm cuff (22-32cm)",
    images: [
      "/products/bp-monitor-1.jpg",
      "/products/bp-monitor-2.jpg",
      "/products/bp-monitor-3.jpg",
    ],
    description: "The Omron HEM-7120 is a fully automatic digital blood pressure monitor designed for accurate and comfortable measurement at home. Features IntelliSense technology for automatic inflation and deflation at the optimum level for each use.",
    
    keyFeatures: {
      mainBenefit: "Clinically validated accuracy",
      duration: "5+ years with proper care",
      onset: "30-second measurement",
      form: "One-button operation"
    },
    
    // Device specifications instead of drug ingredients
    specifications: {
      measurementMethod: "Oscillometric method",
      measurementRange: {
        pressure: "0-299 mmHg",
        pulse: "40-180 beats/min"
      },
      accuracy: {
        pressure: "±3 mmHg",
        pulse: "±5% of displayed value"
      },
      memory: "30 measurements",
      display: "LCD digital display",
      powerSource: "4 AA batteries or AC adapter (optional)",
      cuffSize: "22-32cm (standard adult)",
      dimensions: "103 x 80 x 129mm",
      weight: "250g (without batteries)"
    },
    
    indications: [
      "Home blood pressure monitoring",
      "Hypertension management",
      "Pre-hypertension monitoring",
      "Cardiovascular risk assessment",
      "Treatment effectiveness monitoring",
      "White coat hypertension detection"
    ],
    
    features: [
      "IntelliSense automatic inflation technology",
      "Irregular heartbeat detection",
      "Body movement detection",
      "Average of last 3 readings",
      "Memory for 30 measurements with date/time",
      "Large, easy-to-read display",
      "Universal cuff fits most adult arms"
    ],
    
    // Usage instructions instead of dosage
    usage: {
      preparation: [
        "Rest for 5 minutes before measurement",
        "Sit with back supported, feet flat on floor",
        "Place arm at heart level",
        "Remove tight clothing from upper arm"
      ],
      steps: [
        "Wrap cuff around bare upper arm, 2-3cm above elbow",
        "Press START button",
        "Remain still during measurement",
        "Record results with date and time",
        "Wait 1-2 minutes between measurements"
      ],
      frequency: "Measure twice daily (morning and evening) or as directed by healthcare provider"
    },
    
    // Precautions for device use
    warnings: [
      "Not suitable for arrhythmia patients without doctor consultation",
      "Do not use on injured or inflamed arms",
      "Keep away from electromagnetic devices during use",
      "Not for use on infants or children without pediatric cuff",
      "Consult doctor if consistently abnormal readings"
    ],
    
    maintenance: {
      cleaning: "Wipe with soft, dry cloth. Do not use alcohol or solvents",
      storage: "Store in carrying case at room temperature",
      calibration: "Recommended every 2 years",
      batteryLife: "Approximately 300 measurements with alkaline batteries"
    },
    
    // Quality certifications
    certifications: [
      "FDA approved",
      "CE marked",
      "ISO 13485:2016",
      "Clinically validated (ESH protocol)",
      "Vietnam MOH registered"
    ],
    
    storage: "Store at -20°C to 60°C, humidity 10-95% (non-condensing)",
    warranty: "3 years manufacturer warranty",
    
    registrationNumber: "GMDN-12345-20",
    barcode: "8934564120039",
    
    qualityFeatures: [
      { icon: Shield, text: "Clinically Validated" },
      { icon: CheckCircle, text: "3-Year Warranty" },
      { icon: Package, text: "Complete Accessories" },
      { icon: Info, text: "User Manual in Vietnamese" }
    ],
    
    accessories: [
      "Standard adult cuff (22-32cm)",
      "Instruction manual",
      "Quick start guide",
      "4 AA batteries",
      "Carrying case"
    ],
    
    relatedProducts: [
      {
        id: 12,
        name: "Omron Large Cuff (32-42cm)",
        price: 250000,
        image: "/products/large-cuff.jpg",
      },
      {
        id: 13,
        name: "AC Adapter for Omron",
        price: 180000,
        image: "/products/ac-adapter.jpg",
      },
      {
        id: 14,
        name: "Digital Thermometer",
        price: 120000,
        image: "/products/thermometer.jpg",
      }
    ],
    
    bundleProducts: [
      {
        id: 15,
        name: "Blood Pressure Log Book",
        price: 25000,
        image: "/products/bp-logbook.jpg"
      },
      {
        id: 16,
        name: "Amlodipine 5mg (30 tablets)",
        price: 65000,
        image: "/products/amlodipine.jpg"
      }
    ]
  }
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number.parseInt(params.id)
  const product = products.find((p) => p.id === productId) || products[0]

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false)
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    if (product.prescriptionRequired && !showPrescriptionUpload) {
      setShowPrescriptionUpload(true)
      return
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      prescriptionRequired: product.prescriptionRequired
    })
  }

  const isDevice = product.category === "Medical Devices"

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-gray-900">Shop</Link>
            <span className="mx-2">/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-gray-900">{product.category}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 mb-4 border border-gray-100">
                <img
                  src={product.images?.[selectedImage] || product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-96 object-contain"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`bg-gray-50 rounded-xl p-4 cursor-pointer border-2 transition-all ${selectedImage === -1 ? 'border-gray-900' : 'border-transparent'}`}
                  onClick={() => setSelectedImage(-1)}
                >
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-20 object-contain"
                  />
                </motion.div>
                {product.images?.map((image, index) => (
                  <motion.div 
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-gray-50 rounded-xl p-4 cursor-pointer border-2 transition-all ${selectedImage === index ? 'border-gray-900' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-20 object-contain"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-sm text-gray-500">{product.manufacturer}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">Reg No: {product.registrationNumber}</span>
                  <span className="text-sm text-gray-400">|</span>
                  <span className="text-sm text-gray-500">Barcode: {product.barcode}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-light mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg mb-4">
                  {product.genericName} {product.strength && `• ${product.strength}`} • {product.packSize}
                </p>
                
                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-light text-gray-900">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        {product.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                        Save {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Prescription Alert */}
              {product.prescriptionRequired && (
                <Alert className="mb-6 border-blue-200 bg-blue-50">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Prescription Required:</strong> This medication requires a valid prescription from a licensed healthcare provider. Upload your prescription or consult with our pharmacist.
                  </AlertDescription>
                </Alert>
              )}

              {/* Key Features */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-6 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Main Benefit</p>
                  <p className="font-medium">{product.keyFeatures?.mainBenefit}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{isDevice ? 'Measurement Time' : 'Duration'}</p>
                  <p className="font-medium">{product.keyFeatures?.duration}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">{isDevice ? 'Response Time' : 'Onset of Action'}</p>
                  <p className="font-medium">{product.keyFeatures?.onset}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Form</p>
                  <p className="font-medium">{product.keyFeatures?.form}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Stock Status */}
              <div className="mb-8 flex items-center justify-between p-4 bg-green-50 rounded-xl">
                {product.inStock ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <span className="font-medium text-green-900">In Stock</span>
                      <p className="text-sm text-green-700">Available at Long Chau branches</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <span className="font-medium text-red-900">Out of Stock</span>
                      <p className="text-sm text-red-700">Notify me when available</p>
                    </div>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="text-blue-600">
                  Check branch availability
                </Button>
              </div>

              {/* Add to Cart Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center">
                    <span className="text-gray-700 mr-4">Quantity:</span>
                    <div className="flex items-center border border-gray-200 rounded-full">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-medium">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-xl font-medium">{(product.price * quantity).toLocaleString('vi-VN')}₫</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 rounded-full bg-gray-900 hover:bg-gray-800 text-white py-6 text-lg"
                  >
                    {product.prescriptionRequired ? (
                      <>
                        <FileText className="h-5 w-5 mr-2" />
                        Upload Prescription to Buy
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-14 h-14"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>

                {/* Express Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="rounded-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Pharmacist
                  </Button>
                  <Button variant="outline" className="rounded-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat Support
                  </Button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-4 gap-4 py-6 mt-8 border-t border-gray-200">
                <div className="text-center">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">100% Authentic</p>
                </div>
                <div className="text-center">
                  <Truck className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">Fast Delivery</p>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">24/7 Support</p>
                </div>
                <div className="text-center">
                  <Package className="h-8 w-8 mx-auto mb-2 text-gray-700" />
                  <p className="text-xs">Secure Package</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Features Section - Similar to original skincare features */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light mb-4">
              {isDevice ? (
                <>
                  <span className="italic">Accurate</span> measurements,
                  <br />
                  <span className="font-normal">trusted</span> results
                </>
              ) : (
                <>
                  <span className="italic">Effective</span> treatment,
                  <br />
                  <span className="font-normal">proven</span> results
                </>
              )}
            </h2>
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-w-1 aspect-h-1 rounded-2xl overflow-hidden">
                <img
                  src="/products/feature-image.jpg"
                  alt="Product feature"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-lg font-medium mb-3">RECOMMENDED FOR</h3>
                <ul className="space-y-2">
                  {product.indications?.slice(0, 3).map((item, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-3">QUALITY ASSURANCE</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.qualityFeatures?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <feature.icon className="h-5 w-5 text-gray-700" />
                      <span className="text-sm text-gray-600">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs - Enhanced for pharmacy products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">
            <span className="text-3xl font-light italic text-gray-700">comprehensive</span>
            <br />
            <span className="text-4xl font-light text-gray-900">PRODUCT INFORMATION</span>
          </h2>

          <Tabs defaultValue="details" className="max-w-6xl mx-auto">
            <TabsList className="w-full bg-white rounded-full p-1 mb-8 grid grid-cols-5">
              <TabsTrigger value="details" className="rounded-full">
                {isDevice ? 'Specifications' : 'Drug Details'}
              </TabsTrigger>
              <TabsTrigger value="usage" className="rounded-full">
                {isDevice ? 'How to Use' : 'Dosage'}
              </TabsTrigger>
              <TabsTrigger value="ingredients" className="rounded-full">
                {isDevice ? 'Features' : 'Composition'}
              </TabsTrigger>
              <TabsTrigger value="warnings" className="rounded-full">
                Warnings
              </TabsTrigger>
              <TabsTrigger value="faq" className="rounded-full">
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="bg-white p-8 rounded-2xl shadow-sm">
              {isDevice ? (
                // Device Specifications
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Technical Specifications</h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Measurement Method</dt>
                        <dd className="font-medium">{product.specifications?.measurementMethod}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Measurement Range</dt>
                        <dd className="font-medium">
                          Pressure: {product.specifications?.measurementRange?.pressure}<br />
                          Pulse: {product.specifications?.measurementRange?.pulse}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Accuracy</dt>
                        <dd className="font-medium">
                          Pressure: {product.specifications?.accuracy?.pressure}<br />
                          Pulse: {product.specifications?.accuracy?.pulse}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Power Source</dt>
                        <dd className="font-medium">{product.specifications?.powerSource}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Physical Specifications</h3>
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Display</dt>
                        <dd className="font-medium">{product.specifications?.display}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Memory Capacity</dt>
                        <dd className="font-medium">{product.specifications?.memory}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Dimensions</dt>
                        <dd className="font-medium">{product.specifications?.dimensions}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Weight</dt>
                        <dd className="font-medium">{product.specifications?.weight}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Cuff Size</dt>
                        <dd className="font-medium">{product.specifications?.cuffSize}</dd>
                      </div>
                    </dl>
                    
                    <h4 className="text-md font-medium mt-8 mb-4">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.certifications?.map((cert, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Drug Details
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Drug Information</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase mb-2">Active Ingredient</h4>
                        <p className="text-gray-700">{product.activeIngredient}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase mb-2">Mechanism of Action</h4>
                        <p className="text-gray-600 leading-relaxed">{product.mechanismOfAction}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase mb-2">Therapeutic Category</h4>
                        <p className="text-gray-700">{product.category}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Pharmacokinetics</h3>
                    
                    <dl className="space-y-4">
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Absorption</dt>
                        <dd className="text-gray-600">{product.pharmacokinetics?.absorption}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Distribution</dt>
                        <dd className="text-gray-600">{product.pharmacokinetics?.distribution}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Metabolism</dt>
                        <dd className="text-gray-600">{product.pharmacokinetics?.metabolism}</dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500 mb-1">Elimination</dt>
                        <dd className="text-gray-600">{product.pharmacokinetics?.elimination}</dd>
                      </div>
                    </dl>
                    
                    <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                      <h4 className="text-sm font-medium mb-2">Special Populations</h4>
                      <p className="text-sm text-gray-600">
                        <strong>Pregnancy:</strong> {product.pregnancyCategory}<br />
                        <strong>Lactation:</strong> {product.lactation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Usage Tab */}
            <TabsContent value="usage" className="bg-white p-8 rounded-2xl shadow-sm">
              {isDevice ? (
                // Device Usage Instructions
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">How to Use</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-3">Preparation</h4>
                        <ol className="space-y-2">
                          {product.usage?.preparation?.map((step, index) => (
                            <li key={index} className="flex">
                              <span className="text-gray-400 mr-3">{index + 1}.</span>
                              <span className="text-gray-600">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Measurement Steps</h4>
                        <ol className="space-y-2">
                          {product.usage?.steps?.map((step, index) => (
                            <li key={index} className="flex">
                              <span className="text-gray-400 mr-3">{index + 1}.</span>
                              <span className="text-gray-600">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Maintenance & Care</h3>
                    
                    <dl className="space-y-4">
                      <div>
                        <dt className="font-medium mb-2">Cleaning</dt>
                        <dd className="text-gray-600">{product.maintenance?.cleaning}</dd>
                      </div>
                      <div>
                        <dt className="font-medium mb-2">Storage</dt>
                        <dd className="text-gray-600">{product.maintenance?.storage}</dd>
                      </div>
                      <div>
                        <dt className="font-medium mb-2">Calibration</dt>
                        <dd className="text-gray-600">{product.maintenance?.calibration}</dd>
                      </div>
                      <div>
                        <dt className="font-medium mb-2">Battery Life</dt>
                        <dd className="text-gray-600">{product.maintenance?.batteryLife}</dd>
                      </div>
                    </dl>
                    
                    <Alert className="mt-6 border-blue-200 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        {product.usage?.frequency}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              ) : (
                // Drug Dosage Information
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Dosage Instructions</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium mb-3">Adults</h4>
                        <p className="text-gray-700">{product.dosage?.adults}</p>
                      </div>
                      
                      {product.dosage?.children && (
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <h4 className="font-medium mb-3">Children</h4>
                          {typeof product.dosage.children === 'string' ? (
                            <p className="text-gray-700">{product.dosage.children}</p>
                          ) : (
                            <dl className="space-y-2">
                              {Object.entries(product.dosage.children).map(([age, dose]) => (
                                <div key={age}>
                                  <dt className="font-medium text-sm">{age}:</dt>
                                  <dd className="text-gray-700 ml-4">{dose}</dd>
                                </div>
                              ))}
                            </dl>
                          )}
                        </div>
                      )}
                      
                      <div className="p-4 bg-amber-50 rounded-xl">
                        <h4 className="font-medium mb-3">Special Populations</h4>
                        <p className="text-gray-700 mb-2">
                          <strong>Elderly:</strong> {product.dosage?.elderly}
                        </p>
                        <p className="text-gray-700">
                          <strong>Renal/Hepatic Impairment:</strong> {product.dosage?.specialPopulations}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Administration</h3>
                    
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 rounded-xl">
                        <h4 className="font-medium mb-3">How to Take</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <span>Can be taken with or without food</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <span>Swallow whole with water</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                            <span>Take at evenly spaced intervals</span>
                          </li>
                        </ul>
                      </div>
                      
                      <Alert className="border-amber-200 bg-amber-50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800">
                          <strong>Important:</strong> Complete the full course of treatment even if you feel better. Do not skip doses or stop early without consulting your doctor.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium mb-3">Missed Dose</h4>
                        <p className="text-gray-600">
                          If you miss a dose, take it as soon as you remember. If it's almost time for your next dose, skip the missed dose. Never double up on doses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Ingredients/Features Tab */}
            <TabsContent value="ingredients" className="bg-white p-8 rounded-2xl shadow-sm">
              {isDevice ? (
                // Device Features
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Key Features</h3>
                    <ul className="space-y-4">
                      {product.features?.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">What's Included</h3>
                    <ul className="space-y-3">
                      {product.accessories?.map((item, index) => (
                        <li key={index} className="flex items-center">
                          <Package className="h-4 w-4 text-gray-400 mr-3" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-medium mb-2">Warranty Information</h4>
                      <p className="text-gray-700">{product.warranty}</p>
                    </div>
                  </div>
                </div>
              ) : (
                // Drug Composition
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Composition</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase mb-3">Active Ingredient</h4>
                        <div className="p-4 bg-blue-50 rounded-xl">
                          <p className="font-medium text-gray-900">{product.activeIngredient}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase mb-3">Inactive Ingredients</h4>
                        <p className="text-gray-600">{product.inactiveIngredients}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-gray-500 uppercase mb-3">Pharmaceutical Form</h4>
                        <p className="text-gray-700">{product.keyFeatures?.form}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-6 text-gray-900">Storage & Handling</h3>
                    
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium mb-2">Storage Conditions</h4>
                        <p className="text-gray-600">{product.storage}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-medium mb-2">Shelf Life</h4>
                        <p className="text-gray-600">{product.shelfLife}</p>
                      </div>
                      
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          Always check expiry date before use. Do not use if packaging is damaged.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Warnings Tab */}
            <TabsContent value="warnings" className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6 text-gray-900 flex items-center">
                    <XCircle className="h-6 w-6 text-red-500 mr-2" />
                    Contraindications
                  </h3>
                  <p className="text-gray-600 mb-4">Do not use this {isDevice ? 'device' : 'medication'} if you have:</p>
                  <ul className="space-y-2">
                    {product.contraindications?.map((item, index) => (
                      <li key={index} className="flex items-start pl-6">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-6 text-gray-900 flex items-center">
                    <AlertCircle className="h-6 w-6 text-amber-500 mr-2" />
                    Warnings & Precautions
                  </h3>
                  <ul className="space-y-3">
                    {product.warnings?.map((warning, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{warning}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {product.precautions && (
                    <div className="mt-6 p-4 bg-amber-50 rounded-xl">
                      <h4 className="font-medium mb-3">Additional Precautions</h4>
                      <ul className="space-y-2">
                        {product.precautions.map((precaution, index) => (
                          <li key={index} className="text-gray-700">• {precaution}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {!isDevice && (
                  <>
                    <div>
                      <h3 className="text-lg font-medium mb-6 text-gray-900">Side Effects</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2 text-green-700">Common (may affect up to 1 in 10 people)</h4>
                          <ul className="space-y-1">
                            {product.sideEffects?.common?.map((effect, index) => (
                              <li key={index} className="text-gray-600 pl-4">• {effect}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-amber-700">Uncommon (may affect up to 1 in 100 people)</h4>
                          <ul className="space-y-1">
                            {product.sideEffects?.uncommon?.map((effect, index) => (
                              <li key={index} className="text-gray-600 pl-4">• {effect}</li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-medium mb-2 text-red-700">Serious (seek immediate medical attention)</h4>
                          <ul className="space-y-1">
                            {product.sideEffects?.serious?.map((effect, index) => (
                              <li key={index} className="text-gray-600 pl-4">• {effect}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-6 text-gray-900">Drug Interactions</h3>
                      <div className="space-y-4">
                        {product.interactions?.map((interaction, index) => (
                          <div key={index} className="p-4 bg-gray-50 rounded-xl">
                            <h4 className="font-medium mb-1">{interaction.drug}</h4>
                            <p className="text-gray-600 text-sm mb-2">{interaction.effect}</p>
                            <p className="text-blue-700 text-sm">
                              <strong>Recommendation:</strong> {interaction.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="bg-white p-8 rounded-2xl shadow-sm">
              <div className="max-w-3xl mx-auto">
                <div className="space-y-6">
                  {[
                    {
                      question: isDevice ? "How accurate is this device?" : "Can I take this medication with other medicines?",
                      answer: isDevice 
                        ? "This device is clinically validated and meets international accuracy standards. Regular calibration ensures continued accuracy."
                        : "Always inform your doctor or pharmacist about all medications you're currently taking, including over-the-counter drugs and supplements. Some medications may interact with each other."
                    },
                    {
                      question: isDevice ? "How often should I replace the device?" : "What should I do if I miss a dose?",
                      answer: isDevice
                        ? "With proper care, the device should last 5+ years. Consider replacement if accuracy issues persist after calibration."
                        : "If you miss a dose, take it as soon as you remember. However, if it's almost time for your next dose, skip the missed dose and continue with your regular schedule. Never double up on doses."
                    },
                    {
                      question: "How should I store this product?",
                      answer: product.storage || "Store in a cool, dry place away from direct sunlight. Keep out of reach of children."
                    },
                    {
                      question: isDevice ? "Is this device suitable for elderly users?" : "Is this medication safe during pregnancy?",
                      answer: isDevice
                        ? "Yes, the large display and one-button operation make it ideal for elderly users. The universal cuff fits most arm sizes."
                        : `${product.pregnancyCategory}. ${product.lactation}. Always consult your doctor before taking any medication during pregnancy or breastfeeding.`
                    },
                    {
                      question: "What warranty or guarantee comes with this product?",
                      answer: isDevice
                        ? `This product comes with a ${product.warranty}. Register your product for warranty coverage.`
                        : "All medications are 100% authentic and sourced directly from licensed manufacturers. We guarantee product quality until expiry date when stored properly."
                    },
                    {
                      question: "Can I return this product?",
                      answer: isDevice
                        ? "Unopened devices can be returned within 30 days. Opened devices can be exchanged if defective within warranty period."
                        : "Due to pharmaceutical regulations, medications cannot be returned once dispensed. Please verify your order before purchase."
                    }
                  ].map((faq, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="border-b border-gray-200 pb-6 last:border-0"
                    >
                      <h3 className="text-lg font-medium mb-3 text-gray-900">{faq.question}</h3>
                      <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
                
                <Alert className="mt-8 border-blue-200 bg-blue-50">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Need more help?</strong> Our licensed pharmacists are available 24/7. 
                    Call <span className="font-medium">1900 6928</span> or use our live chat for immediate assistance.
                  </AlertDescription>
                </Alert>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Zero Toxics Section - Adapted for Pharmacy */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-light">
                Quality <span className="italic">assured</span>,
                <br />
                Safety <span className="font-normal">guaranteed</span>.
              </h2>
              
              <div className="h-px w-24 bg-gradient-to-r from-gray-400 to-transparent" />
              
              <p className="text-gray-600 leading-relaxed">
                At Long Chau, we ensure every product meets the highest pharmaceutical standards. 
                From sourcing to delivery, quality and safety are our top priorities.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase mb-1">100% AUTHENTIC PRODUCTS</h3>
                    <p className="text-gray-600 text-sm">
                      Direct sourcing from licensed manufacturers, verified with anti-counterfeit measures.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase mb-1">QUALITY CONTROLLED</h3>
                    <p className="text-gray-600 text-sm">
                      Temperature-controlled storage, regular quality audits, and batch tracking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase mb-1">SECURE PACKAGING</h3>
                    <p className="text-gray-600 text-sm">
                      Tamper-evident seals, protective packaging, and discreet delivery.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium uppercase mb-1">COMPLETE INFORMATION</h3>
                    <p className="text-gray-600 text-sm">
                      Full prescribing information, clear labeling, and pharmacist consultation available.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-lg font-medium mb-6">Our Quality Promise</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Licensed by Vietnam Ministry of Health</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">WHO-GMP certified suppliers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Cold chain maintained for sensitive products</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">Expiry date guarantee on all products</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">24/7 pharmacist support</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      All pharmaceutical products are stored and handled according to manufacturer specifications 
                      and Vietnamese pharmaceutical regulations.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frequently Bought Together */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">
            Frequently <span className="italic">bought together</span>
          </h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Main Product */}
                <div className="text-center">
                  <div className="bg-gray-50 rounded-xl p-6 mb-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-32 object-contain"
                    />
                  </div>
                  <h4 className="text-sm font-medium mb-1">{product.name}</h4>
                  <p className="text-gray-900 font-medium">{product.price.toLocaleString('vi-VN')}₫</p>
                </div>
                
                {/* Plus Sign */}
                <div className="flex items-center justify-center">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                
                {/* Bundle Products */}
                <div className="space-y-4">
                  {product.bundleProducts?.map((bundleProduct, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <img
                        src={bundleProduct.image || "/placeholder.svg"}
                        alt={bundleProduct.name}
                        className="w-16 h-16 object-contain"
                      />
                      <div className="flex-1">
                        <h5 className="text-sm font-medium">{bundleProduct.name}</h5>
                        <p className="text-sm text-gray-900">{bundleProduct.price.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-medium">Total Bundle Price:</span>
                  <div className="text-right">
                    <p className="text-2xl font-medium text-gray-900">
                      {(product.price + (product.bundleProducts?.reduce((sum, p) => sum + p.price, 0) || 0)).toLocaleString('vi-VN')}₫
                    </p>
                    <p className="text-sm text-green-600">Save 10% on bundle</p>
                  </div>
                </div>
                <Button className="w-full rounded-full bg-gray-900 hover:bg-gray-800">
                  Add Bundle to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">
            <span className="italic">Related</span> Products
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {product.relatedProducts?.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <Link href={`/shop/${relatedProduct.id}`} className="group block">
                  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                    <div className="bg-gradient-to-br from-gray-50 to-white p-6">
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-32 object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium mb-2 group-hover:text-blue-600 transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-lg font-medium text-gray-900">
                        {relatedProduct.price.toLocaleString('vi-VN')}₫
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/shop">
              <Button variant="outline" className="rounded-full">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}