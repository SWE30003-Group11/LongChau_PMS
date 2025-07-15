"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, MapPin, Truck, Store, CreditCard, Wallet, DollarSign, AlertCircle, FileText, Clock, Phone, CheckCircle, User, Mail, Info, Loader2, Smartphone, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

// Real Long Chau pharmacy locations
const pharmacyLocations = [
  {
    id: 1,
    name: "Long Chau - Hai Ba Trung HQ",
    address: "379-381 Hai Ba Trung, Vo Thi Sau Ward, District 3",
    phone: "1800 6928",
    hours: "7:00 AM - 10:00 PM",
    is24h: false,
    isHeadquarters: true,
    estimatedTime: "Ready in 30 minutes"
  },
  {
    id: 2,
    name: "Long Chau - Nguyen Trai",
    address: "123 Nguyen Trai, Nguyen Cu Trinh Ward, District 1",
    phone: "1800 6928",
    hours: "24/7",
    is24h: true,
    estimatedTime: "Ready in 20 minutes"
  },
  {
    id: 3,
    name: "Long Chau - Pham Ngu Lao",
    address: "185 Pham Ngu Lao, Pham Ngu Lao Ward, District 1",
    phone: "1800 6928",
    hours: "24/7",
    is24h: true,
    estimatedTime: "Ready in 25 minutes"
  },
  {
    id: 4,
    name: "Long Chau - District 7",
    address: "S2.01 SC Vivo City, 1058 Nguyen Van Linh, Tan Phong Ward, District 7",
    phone: "1800 6928",
    hours: "8:00 AM - 10:00 PM",
    is24h: false,
    estimatedTime: "Ready in 45 minutes"
  },
  {
    id: 5,
    name: "Long Chau - Bach Dang",
    address: "161 Bach Dang, Ward 2, Tan Binh District",
    phone: "1800 6928",
    hours: "24/7",
    is24h: true,
    estimatedTime: "Ready in 35 minutes"
  }
]

export default function CheckoutPage() {
  const { cart, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"pickup" | "delivery">("pickup")
  const [selectedBranch, setSelectedBranch] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [uploadedPrescription, setUploadedPrescription] = useState<File | null>(null)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentModal, setPaymentModal] = useState<"card" | "ewallet" | null>(null)
  
  // E-wallet states
  const [selectedWallet, setSelectedWallet] = useState("")
  const [walletPhone, setWalletPhone] = useState("")
  
  // Card details state
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  })
  
  // Customer information
  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  })
  
  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  const deliveryFee = fulfillmentMethod === "delivery" ? 30000 : 0
  const total = subtotal + deliveryFee
  
  // Check if any items require prescription
  const requiresPrescription = cart.some(item => item.prescriptionRequired)
  
  // Handle prescription upload
  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedPrescription(file)
    }
  }
  
  // Card number formatting
  const handleCardNumberChange = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    setCardDetails({...cardDetails, number: formatted})
  }
  
  // Expiry date formatting
  const handleExpiryChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      const formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
      setCardDetails({...cardDetails, expiry: formatted})
    } else {
      setCardDetails({...cardDetails, expiry: cleaned})
    }
  }
  
  // Detect card type
  const getCardType = () => {
    const number = cardDetails.number.replace(/\s/g, '')
    if (number.startsWith('4')) return 'visa'
    if (number.startsWith('5')) return 'mastercard'
    if (number.startsWith('35')) return 'jcb'
    return null
  }
  
  // Process payment simulation
  const processPayment = async () => {
    setProcessingPayment(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    if (paymentMethod === "card") {
      // Simulate card processing
      setPaymentModal("card")
      await new Promise(resolve => setTimeout(resolve, 3000))
    } else if (paymentMethod === "ewallet") {
      // Simulate e-wallet flow
      setPaymentModal("ewallet")
      await new Promise(resolve => setTimeout(resolve, 3000))
    }
    
    setProcessingPayment(false)
    setPaymentModal(null)
    setOrderPlaced(true)
    clearCart()
  }
  
  // Handle order submission
  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!customerInfo.fullName || !customerInfo.phone) {
      alert("Please fill in all required fields")
      return
    }
    
    if (fulfillmentMethod === "pickup" && !selectedBranch) {
      alert("Please select a pickup branch")
      return
    }
    
    if (fulfillmentMethod === "delivery" && !customerInfo.address) {
      alert("Please enter delivery address")
      return
    }
    
    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }
    
    if (requiresPrescription && !uploadedPrescription) {
      alert("Please upload prescription for prescription-required items")
      return
    }
    
    if (paymentMethod === "card") {
      // Validate card details
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        alert("Please fill in all card details")
        return
      }
    }
    
    if (paymentMethod === "ewallet" && !selectedWallet) {
      alert("Please select an e-wallet provider")
      return
    }
    
    // Process payment
    if (paymentMethod === "cash") {
      setOrderPlaced(true)
      clearCart()
    } else {
      await processPayment()
    }
  }
  
  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-20">
            <h1 className="text-4xl font-light mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add products to your cart to proceed with checkout</p>
            <Button asChild className="rounded-full">
              <Link href="/shop">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  if (orderPlaced) {
    return (
      <div className="min-h-screen pt-24 pb-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center py-20"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-light mb-4">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-2">Thank you for your order. Order number: #LC{Date.now()}</p>
            <p className="text-gray-600 mb-8">
              {fulfillmentMethod === "pickup" 
                ? `Your order will be ready for pickup at ${pharmacyLocations.find(loc => loc.id.toString() === selectedBranch)?.name}`
                : "Your order will be delivered to your address within 2-3 hours"
              }
            </p>
            <div className="space-y-4">
              <Button asChild className="rounded-full">
                <Link href="/shop">Continue Shopping</Link>
              </Button>
              <p className="text-sm text-gray-600">
                You will receive an SMS confirmation at {customerInfo.phone}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/shop" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
          <h1 className="text-3xl font-light">Checkout</h1>
        </div>
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-2xl">
            <div className={`flex items-center ${step >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Cart Review</span>
            </div>
            <div className={`flex-1 h-px mx-4 ${step >= 2 ? 'bg-gray-900' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Delivery Info</span>
            </div>
            <div className={`flex-1 h-px mx-4 ${step >= 3 ? 'bg-gray-900' : 'bg-gray-300'}`} />
            <div className={`flex items-center ${step >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-gray-900 bg-gray-900 text-white' : 'border-gray-300'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Cart Review */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-medium mb-6">Review Your Cart</h2>
                
                {/* Prescription Alert */}
                {requiresPrescription && (
                  <Alert className="mb-6 border-blue-200 bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      <strong>Prescription Required:</strong> Some items in your cart require a valid prescription. 
                      You'll need to upload it in the next step.
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-20 h-20 object-contain bg-white rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">Quantity: {item.quantity}</p>
                        {item.prescriptionRequired && (
                          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                            Prescription Required
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                        <p className="text-sm text-gray-500">{item.price.toLocaleString('vi-VN')}₫ each</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full rounded-full"
                  onClick={() => setStep(2)}
                >
                  Continue to Delivery Info
                </Button>
              </motion.div>
            )}
            
            {/* Step 2: Delivery Information */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Customer Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-medium mb-6">Customer Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        value={customerInfo.fullName}
                        onChange={(e) => setCustomerInfo({...customerInfo, fullName: e.target.value})}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="Enter phone number"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                        className="rounded-full"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email for order updates"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                        className="rounded-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Prescription Upload */}
                {requiresPrescription && (
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-medium mb-6">Upload Prescription</h2>
                    
                    <Alert className="mb-4 border-amber-200 bg-amber-50">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                      <AlertDescription className="text-amber-800">
                        A valid prescription is required for some items in your order. 
                        Our pharmacist will verify it before dispensing.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        id="prescription"
                        accept="image/*,.pdf"
                        onChange={handlePrescriptionUpload}
                        className="hidden"
                      />
                      <label htmlFor="prescription" className="cursor-pointer">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          {uploadedPrescription 
                            ? `Uploaded: ${uploadedPrescription.name}`
                            : "Click to upload prescription"
                          }
                        </p>
                        <p className="text-sm text-gray-500">Accepts JPG, PNG, PDF (Max 5MB)</p>
                      </label>
                    </div>
                  </div>
                )}
                
                {/* Fulfillment Method */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-medium mb-6">Fulfillment Method</h2>
                  
                  <RadioGroup value={fulfillmentMethod} onValueChange={(value: "pickup" | "delivery") => setFulfillmentMethod(value)}>
                    <div className="space-y-4">
                      <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="pickup" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Store className="h-5 w-5 text-gray-700" />
                            <span className="font-medium">Store Pickup</span>
                            <span className="text-sm text-green-600">Free</span>
                          </div>
                          <p className="text-sm text-gray-600">Pick up your order from a Long Chau branch</p>
                        </div>
                      </label>
                      
                      <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="delivery" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Truck className="h-5 w-5 text-gray-700" />
                            <span className="font-medium">Home Delivery</span>
                            <span className="text-sm text-gray-600">30,000₫</span>
                          </div>
                          <p className="text-sm text-gray-600">Same-day delivery within Ho Chi Minh City</p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>
                  
                  {/* Branch Selection for Pickup */}
                  {fulfillmentMethod === "pickup" && (
                    <div className="mt-6">
                      <Label>Select Pickup Branch</Label>
                      <RadioGroup value={selectedBranch} onValueChange={setSelectedBranch}>
                        <div className="space-y-3 mt-3">
                          {pharmacyLocations.map((location) => (
                            <label key={location.id} className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                              <RadioGroupItem value={location.id.toString()} />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{location.name}</span>
                                  {location.is24h && (
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">24/7</span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {location.hours}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {location.phone}
                                  </span>
                                </div>
                                <p className="text-sm text-green-600 mt-1">{location.estimatedTime}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {/* Delivery Address */}
                  {fulfillmentMethod === "delivery" && (
                    <div className="mt-6">
                      <Label htmlFor="address">Delivery Address *</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter your full delivery address"
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
                
                {/* Additional Notes */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-xl font-medium mb-4">Additional Notes (Optional)</h2>
                  <Textarea
                    placeholder="Add any special instructions for your order..."
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 rounded-full"
                    onClick={() => setStep(3)}
                    disabled={
                      !customerInfo.fullName || 
                      !customerInfo.phone || 
                      (fulfillmentMethod === "pickup" && !selectedBranch) ||
                      (fulfillmentMethod === "delivery" && !customerInfo.address) ||
                      (requiresPrescription && !uploadedPrescription)
                    }
                  >
                    Continue to Payment
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Step 3: Payment */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h2 className="text-xl font-medium mb-6">Payment Method</h2>
                
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="cash" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <DollarSign className="h-5 w-5 text-gray-700" />
                          <span className="font-medium">Cash on Delivery/Pickup</span>
                        </div>
                        <p className="text-sm text-gray-600">Pay when you receive your order</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="card" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CreditCard className="h-5 w-5 text-gray-700" />
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <p className="text-sm text-gray-600">Visa, Mastercard, JCB</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <RadioGroupItem value="ewallet" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Wallet className="h-5 w-5 text-gray-700" />
                          <span className="font-medium">E-Wallet</span>
                        </div>
                        <p className="text-sm text-gray-600">MoMo, ZaloPay, VNPay</p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>
                
                {/* Credit Card Form */}
                {paymentMethod === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="font-medium mb-4">Card Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={cardDetails.number}
                            onChange={(e) => handleCardNumberChange(e.target.value)}
                            maxLength={19}
                            className="rounded-full pr-12"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2">
                            {getCardType() && (
                              <img 
                                src={`/card-icons/${getCardType()}.svg`} 
                                alt={getCardType() || undefined}
                                className="h-6"
                              />
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={cardDetails.expiry}
                            onChange={(e) => handleExpiryChange(e.target.value)}
                            maxLength={5}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                            maxLength={4}
                            className="rounded-full"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="cardName">Cardholder Name</Label>
                        <Input
                          id="cardName"
                          placeholder="NGUYEN VAN A"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({...cardDetails, name: e.target.value.toUpperCase()})}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                    
                    <Alert className="mt-4 border-blue-200 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-blue-800">
                        <strong>Demo Mode:</strong> This is a simulated payment. No real charges will be made.
                        Use test card: 4242 4242 4242 4242
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                {/* E-Wallet Selection */}
                {paymentMethod === "ewallet" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-6"
                  >
                    <h3 className="font-medium mb-4">Select E-Wallet</h3>
                    <RadioGroup value={selectedWallet} onValueChange={setSelectedWallet}>
                      <div className="grid grid-cols-3 gap-4">
                        <label className="relative cursor-pointer">
                          <RadioGroupItem value="momo" className="absolute opacity-0" />
                          <div className={cn(
                            "p-4 border-2 rounded-lg text-center transition-all",
                            selectedWallet === "momo" ? "border-pink-500 bg-pink-50" : "border-gray-200"
                          )}>
                            <img src="/wallet-icons/momo.png" alt="MoMo" className="h-12 mx-auto mb-2" />
                            <span className="text-sm font-medium">MoMo</span>
                          </div>
                        </label>
                        
                        <label className="relative cursor-pointer">
                          <RadioGroupItem value="zalopay" className="absolute opacity-0" />
                          <div className={cn(
                            "p-4 border-2 rounded-lg text-center transition-all",
                            selectedWallet === "zalopay" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          )}>
                            <img src="/wallet-icons/zalopay.png" alt="ZaloPay" className="h-12 mx-auto mb-2" />
                            <span className="text-sm font-medium">ZaloPay</span>
                          </div>
                        </label>
                        
                        <label className="relative cursor-pointer">
                          <RadioGroupItem value="vnpay" className="absolute opacity-0" />
                          <div className={cn(
                            "p-4 border-2 rounded-lg text-center transition-all",
                            selectedWallet === "vnpay" ? "border-red-500 bg-red-50" : "border-gray-200"
                          )}>
                            <img src="/wallet-icons/vnpay.png" alt="VNPay" className="h-12 mx-auto mb-2" />
                            <span className="text-sm font-medium">VNPay</span>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                    
                    {selectedWallet && (
                      <Alert className="mt-4 border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription className="text-blue-800">
                          <strong>Demo Mode:</strong> Clicking "Place Order" will simulate {selectedWallet.toUpperCase()} payment flow.
                          You'll see a QR code demo without actual payment.
                        </AlertDescription>
                      </Alert>
                    )}
                  </motion.div>
                )}
                
                <div className="mt-8 flex gap-4">
                  <Button 
                    variant="outline" 
                    className="rounded-full"
                    onClick={() => setStep(2)}
                  >
                    Back
                  </Button>
                  <Button 
                    className="flex-1 rounded-full bg-gray-900 hover:bg-gray-800"
                    onClick={handlePlaceOrder}
                    disabled={!paymentMethod || (paymentMethod === "ewallet" && !selectedWallet)}
                  >
                    {processingPayment ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Place Order • {total.toLocaleString('vi-VN')}₫</>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-medium mb-6">Order Summary</h2>
              
              {/* Summary Items */}
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.name} × {item.quantity}
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{subtotal.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span>{deliveryFee > 0 ? `${deliveryFee.toLocaleString('vi-VN')}₫` : 'Free'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-medium text-lg">{total.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Need help?</p>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">1800 6928</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">24/7 Pharmacist Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Payment Processing Modals */}
      <AnimatePresence>
        {paymentModal === "card" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-medium mb-2">Processing Payment</h3>
                <p className="text-gray-600 mb-6">Securely processing your card payment...</p>
                
                <div className="space-y-3 text-left bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Card Number</span>
                    <span className="font-medium">•••• {cardDetails.number.slice(-4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount</span>
                    <span className="font-medium">{total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <span className="text-gray-600">Verifying with your bank...</span>
                </div>
                
                <p className="text-xs text-gray-500">Demo Mode: No real charges will be made</p>
              </div>
            </motion.div>
          </motion.div>
        )}
        
        {paymentModal === "ewallet" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full"
            >
              <div className="text-center">
                <div className="mb-4">
                  <img 
                    src={`/wallet-icons/${selectedWallet}.png`} 
                    alt={selectedWallet}
                    className="h-16 mx-auto mb-4"
                  />
                </div>
                <h3 className="text-2xl font-medium mb-2">
                  {selectedWallet === "momo" && "MoMo Payment"}
                  {selectedWallet === "zalopay" && "ZaloPay Payment"}
                  {selectedWallet === "vnpay" && "VNPay Payment"}
                </h3>
                <p className="text-gray-600 mb-6">Scan QR code to complete payment</p>
                
                {/* QR Code Placeholder */}
                <div className="bg-gray-100 rounded-xl p-8 mb-6">
                  <QrCode className="h-32 w-32 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-500 mt-4">Demo QR Code</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    Amount to pay: <span className="font-bold">{total.toLocaleString('vi-VN')}₫</span>
                  </p>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
                  <Smartphone className="h-5 w-5" />
                  <span className="text-sm">Open {selectedWallet} app to scan</span>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-600" />
                  <span className="text-sm text-gray-600">Waiting for payment...</span>
                </div>
                
                <p className="text-xs text-gray-500 mt-4">Demo Mode: Payment will auto-complete</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}