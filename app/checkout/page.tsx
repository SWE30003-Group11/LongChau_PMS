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
import { motion, AnimatePresence } from "@/lib/framer"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase/client"
import { useEffect } from "react"
import { useNotification } from '@/contexts/NotificationContext';

export default function CheckoutPage() {
  const { addNotification } = useNotification();
  // Dynamic branches from Supabase
  const [branches, setBranches] = useState<any[]>([])
  useEffect(() => {
    async function fetchBranches() {
      const { data, error } = await supabase.from('branches').select('*').order('id')
      if (!error && data) setBranches(data)
    }
    fetchBranches()
  }, [])
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
  
  // Add a state to store the last order id
  const [lastOrderId, setLastOrderId] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [savedAddresses, setSavedAddresses] = useState<any[]>([])
  const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>("")
  const [saveNewAddress, setSaveNewAddress] = useState(false)

  useEffect(() => {
    async function fetchUserAndProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user?.id) {
        const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setProfile(profileData)
        const { data: addresses } = await supabase.from('saved_addresses').select('*').eq('user_id', user.id)
        setSavedAddresses(addresses || [])
      }
    }
    fetchUserAndProfile()
  }, [])

  useEffect(() => {
    // Auto-fill customer info if profile is loaded
    if (profile) {
      setCustomerInfo((info) => ({
        ...info,
        fullName: profile.full_name || info.fullName,
        phone: profile.phone || info.phone,
        email: profile.email || info.email,
      }))
    }
  }, [profile])

  useEffect(() => {
    // If a saved address is selected, auto-fill address
    if (selectedSavedAddress && selectedSavedAddress !== 'new') {
      const addr = savedAddresses.find(a => a.id === selectedSavedAddress)
      if (addr) {
        setCustomerInfo((info) => ({ ...info, address: addr.address }))
      }
    }
  }, [selectedSavedAddress, savedAddresses])
  
  // State to hold inventory for all cart items at all branches
  const [branchStock, setBranchStock] = useState<Record<number, Record<number, number>>>({}) // {branchId: {productId: quantity}}

  // Fetch inventory for all cart items at all branches
  useEffect(() => {
    async function fetchBranchStock() {
      if (cart.length === 0) return
      const productIds = cart.map(item => item.id)
      const { data, error } = await supabase
        .from('inventory')
        .select('branch_id, product_id, quantity')
        .in('product_id', productIds)
      if (!error && data) {
        const stockMap: Record<number, Record<number, number>> = {}
        data.forEach((row: any) => {
          if (!stockMap[row.branch_id]) stockMap[row.branch_id] = {}
          stockMap[row.branch_id][row.product_id] = row.quantity
        })
        setBranchStock(stockMap)
      }
    }
    fetchBranchStock()
  }, [cart, branches])
  
  // Update stock quantities after successful order
  async function updateInventory(orderItems: any[]) {
    for (const item of orderItems) {
      const branchId = Number(selectedBranch);
      const qty = branchStock[branchId]?.[item.id] ?? 0;
      const newQty = qty - item.quantity;

      // Find inventory row id
      const { data: invRows, error: invErr } = await supabase
        .from('inventory')
        .select('id')
        .eq('branch_id', branchId)
        .eq('product_id', item.id)
        .single();

      if (invErr || !invRows) {
        addNotification({
          title: 'Inventory Update Failed',
          message: `Failed to update inventory for ${item.name}. Please contact support.`,
          type: 'error'
        });
        continue;
      }

      const { error: updateErr } = await supabase
        .from('inventory')
        .update({ quantity: newQty, updated_at: new Date().toISOString() })
        .eq('id', invRows.id);

      if (updateErr) {
        addNotification({
          title: 'Inventory Update Failed',
          message: `Failed to update inventory for ${item.name}. Please contact support.`,
          type: 'error'
        });
        continue;
      }

      // Check if new quantity is at critical levels
      if (newQty <= 5) {
        addNotification({
          title: 'Critical Stock Warning',
          message: `${item.name} has reached critical stock level (${newQty} units)`,
          type: 'error',
          duration: 0
        });
      } else if (newQty <= 20) {
        addNotification({
          title: 'Low Stock Warning',
          message: `${item.name} is running low (${newQty} units)`,
          type: 'warning',
          duration: 0
        });
      }
    }
  }

  // Handle order submission
  const handlePlaceOrder = async () => {
    // Validate required fields
    if (!customerInfo.fullName || !customerInfo.phone) {
      addNotification({
        title: 'Missing Information',
        message: 'Please fill in all required fields',
        type: 'warning'
      });
      return;
    }
    
    if (fulfillmentMethod === 'pickup' && !selectedBranch) {
      addNotification({
        title: 'Branch Required',
        message: 'Please select a pickup branch',
        type: 'warning'
      });
      return;
    }
    
    if (fulfillmentMethod === 'delivery' && !customerInfo.address) {
      addNotification({
        title: 'Address Required',
        message: 'Please enter delivery address',
        type: 'warning'
      });
      return;
    }
    
    if (!paymentMethod) {
      addNotification({
        title: 'Payment Method Required',
        message: 'Please select a payment method',
        type: 'warning'
      });
      return;
    }
    
    if (requiresPrescription && !uploadedPrescription) {
      addNotification({
        title: 'Prescription Required',
        message: 'Please upload prescription for prescription-required items',
        type: 'warning'
      });
      return;
    }
    
    // Check inventory before placing order (for pickup)
    if (fulfillmentMethod === 'pickup') {
      for (const item of cart) {
        const qty = branchStock[Number(selectedBranch)]?.[item.id] ?? 0
        if (qty < item.quantity) {
          addNotification({
            title: 'Insufficient Stock',
            message: `Not enough stock for ${item.name} at this branch. Please adjust your cart or choose another branch.`,
            type: 'error'
          });
          return;
        }
      }
    }
    // Simulate order creation
    try {
      const orderInsert = await supabase.from('orders').insert({
        user_id: user?.id,
        order_number: `LC${Date.now()}`,
        status: 'pending',
        total_amount: total,
        payment_method: paymentMethod,
        payment_status: paymentMethod === 'cash' ? 'pending' : 'paid',
        fulfillment_method: fulfillmentMethod,
        branch_id: fulfillmentMethod === 'pickup' ? Number(selectedBranch) : null,
        delivery_address: fulfillmentMethod === 'delivery' ? customerInfo.address : null,
        notes: customerInfo.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }).select('id').single()
      if (orderInsert.error || !orderInsert.data) {
        addNotification({
          title: 'Order Failed',
          message: 'Failed to create order. Please try again.',
          type: 'error'
        });
        return;
      }
      const orderId = orderInsert.data.id
      setLastOrderId(orderId)
      // Insert order items
      const orderItems = cart.map(item => ({
        order_id: orderId,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        prescription_required: !!item.prescriptionRequired
      }))
      const { error: orderItemsError } = await supabase.from('order_items').insert(orderItems)
      if (orderItemsError) {
        alert('Failed to record order items. Please contact support.')
        return
      }
      // Subtract inventory for pickup orders
      if (fulfillmentMethod === 'pickup') {
        await updateInventory(cart);
      }
      // Insert payment record
      const paymentInsert = await supabase.from('payments').insert({
        order_id: orderId,
        payment_method: paymentMethod,
        amount: total,
        status: paymentMethod === 'cash' ? 'pending' : 'paid',
        paid_at: paymentMethod === 'cash' ? null : new Date().toISOString(),
        created_at: new Date().toISOString(),
      })
      if (paymentInsert.error) {
        alert('Failed to create payment record. Please try again.')
        return
      }
      // Always insert delivery record if delivery
      if (fulfillmentMethod === 'delivery') {
        console.log('DELIVERY DEBUG:')
        console.log('User:', user)
        console.log('OrderId:', orderId)
        console.log('delivery_address:', customerInfo.address)
        console.log('delivery_method:', 'standard')
        console.log('status:', 'pending')
        console.log('created_at:', new Date().toISOString())
        if (!user?.id) console.error('User ID is missing!')
        if (!orderId) console.error('Order ID is missing!')
        if (!customerInfo.address) console.error('Delivery address is missing!')
        const deliveryInsert = await supabase.from('deliveries').insert({
          order_id: orderId,
          delivery_address: customerInfo.address,
          delivery_method: 'standard',
          status: 'pending',
          created_at: new Date().toISOString(),
        })
        if (deliveryInsert.error) {
          console.error('Delivery insert error:', deliveryInsert.error)
          alert('Failed to create delivery record. Error: ' + deliveryInsert.error.message)
          return
        } else {
          console.log('Delivery insert success:', deliveryInsert)
        }
      }
      // Process payment
      if (paymentMethod === "cash") {
        setOrderPlaced(true)
        clearCart()
        addNotification({
          title: 'Order Placed Successfully',
          message: 'Your order has been placed. Please pay at pickup.',
          type: 'success'
        });
      } else {
        await processPayment()
        addNotification({
          title: 'Payment Successful',
          message: 'Your order has been placed and payment processed successfully.',
          type: 'success'
        });
      }

      if (fulfillmentMethod === 'delivery' && saveNewAddress && user?.id && customerInfo.address) {
        const alreadyExists = savedAddresses.some(addr => addr.address === customerInfo.address)
        if (!alreadyExists) {
          await supabase.from('saved_addresses').insert({
            user_id: user.id,
            label: 'Saved Address',
            address: customerInfo.address,
            is_default: false,
            created_at: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      addNotification({
        title: 'Order Failed',
        message: 'An error occurred while processing your order. Please try again.',
        type: 'error'
      });
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
                ? `Your order will be ready for pickup at ${branches.find((loc: any) => loc.id.toString() === selectedBranch)?.name}`
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
                          {branches.map((location: any) => {
                            // For each branch, check if all cart items are in stock
                            const allInStock = cart.every(item => {
                              const qty = branchStock[location.id]?.[item.id] ?? 0
                              return qty >= item.quantity
                            })
                            return (
                              <label key={location.id} className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer ${!allInStock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                                style={{ pointerEvents: allInStock ? 'auto' : 'none' }}>
                                <RadioGroupItem value={location.id.toString()} disabled={!allInStock} />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium">{location.name}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-1">{location.address}</p>
                                  <div className="flex flex-col gap-1 text-xs text-gray-500">
                                    {cart.map(item => {
                                      const qty = branchStock[location.id]?.[item.id] ?? 0
                                      return (
                                        <span key={item.id} className={qty < item.quantity ? 'text-red-600' : ''}>
                                          {item.name}: {qty} in stock {qty < item.quantity && '(not enough stock)'}
                                        </span>
                                      )
                                    })}
                                  </div>
                                  <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {location.phone}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </RadioGroup>
                    </div>
                  )}
                  
                  {/* Delivery Address */}
                  {fulfillmentMethod === "delivery" && (
                    <div className="mt-6">
                      <Label htmlFor="address">Delivery Address *</Label>
                      {savedAddresses.length > 0 && (
                        <select
                          className="w-full rounded-full border border-gray-200 px-4 py-2 mb-2"
                          value={selectedSavedAddress}
                          onChange={e => setSelectedSavedAddress(e.target.value)}
                        >
                          <option value="">Choose a saved address</option>
                          {savedAddresses.map(addr => (
                            <option key={addr.id} value={addr.id}>{addr.label || addr.address}</option>
                          ))}
                          <option value="new">Enter new address</option>
                        </select>
                      )}
                      {(selectedSavedAddress === 'new' || savedAddresses.length === 0 || !selectedSavedAddress) && (
                        <>
                          <Textarea
                            id="address"
                            placeholder="Enter your full delivery address"
                            value={customerInfo.address}
                            onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                            className="mt-2"
                            rows={3}
                          />
                          {user?.id && (
                            <label className="flex items-center gap-2 mt-2 text-sm">
                              <input
                                type="checkbox"
                                checked={saveNewAddress}
                                onChange={e => setSaveNewAddress(e.target.checked)}
                                className="rounded"
                              />
                              Save this address to my account
                            </label>
                          )}
                        </>
                      )}
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
                            <img src="/payments/momopay.png" alt="MoMo" className="h-12 mx-auto mb-2" />
                            <span className="text-sm font-medium">MoMo</span>
                          </div>
                        </label>
                        
                        <label className="relative cursor-pointer">
                          <RadioGroupItem value="zalopay" className="absolute opacity-0" />
                          <div className={cn(
                            "p-4 border-2 rounded-lg text-center transition-all",
                            selectedWallet === "zalopay" ? "border-blue-500 bg-blue-50" : "border-gray-200"
                          )}>
                            <img src="/payments/zalopay.png" alt="ZaloPay" className="h-12 mx-auto mb-2" />
                            <span className="text-sm font-medium">ZaloPay</span>
                          </div>
                        </label>
                        
                        <label className="relative cursor-pointer">
                          <RadioGroupItem value="vnpay" className="absolute opacity-0" />
                          <div className={cn(
                            "p-4 border-2 rounded-lg text-center transition-all",
                            selectedWallet === "vnpay" ? "border-red-500 bg-red-50" : "border-gray-200"
                          )}>
                            <img src="/payments/vnpay.jpg" alt="VNPay" className="h-12 mx-auto mb-2" />
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