"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase/client"
import { format } from "date-fns"
import { Package, Clock, CheckCircle, XCircle, Truck, ChevronRight, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

interface Order {
  id: string
  order_number: string
  status: 'pending' | 'processing' | 'ready' | 'delivered' | 'cancelled'
  total_amount: number
  payment_method: string
  payment_status: 'pending' | 'paid' | 'failed'
  fulfillment_method: 'pickup' | 'delivery'
  delivery_address?: string
  notes?: string
  created_at: string
  order_items: OrderItem[]
  updated_at?: string
}

interface OrderItem {
  id: string
  product_id: number
  product_name: string
  quantity: number
  unit_price: number
  prescription_required: boolean
}

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-800' },
  ready: { label: 'Ready', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  delivered: { label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' },
}

export default function AccountOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'delivered'>('all')
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true
    if (activeTab === 'pending') return ['pending', 'processing', 'ready'].includes(order.status)
    if (activeTab === 'delivered') return order.status === 'delivered'
    return true
  })

  const getStatusIcon = (status: Order['status']) => {
    const Icon = statusConfig[status].icon
    return <Icon className="h-4 w-4" />
  }

  // Defensive: ensure order_items is always an array
  const safeOrderItems = (order: Order | null) => Array.isArray(order?.order_items) ? order!.order_items : []

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4"
              onClick={() => router.push('/account/dashboard')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Account
            </Button>
            <h1 className="text-3xl font-light mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your pharmacy orders</p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="bg-white mb-6">
              <TabsTrigger value="all">All Orders ({orders.length})</TabsTrigger>
              <TabsTrigger value="pending">
                Active ({orders.filter(o => ['pending', 'processing', 'ready'].includes(o.status)).length})
              </TabsTrigger>
              <TabsTrigger value="delivered">
                Completed ({orders.filter(o => o.status === 'delivered').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              {filteredOrders.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-6">
                      {activeTab === 'all' 
                        ? "You haven't placed any orders yet"
                        : `No ${activeTab} orders`}
                    </p>
                    <Button asChild className="rounded-full">
                      <Link href="/shop">Browse Products</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="overflow-hidden">
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-4 mb-2">
                              <CardTitle className="text-lg">
                                Order #{order.order_number}
                              </CardTitle>
                              <Badge 
                                variant="secondary" 
                                className={statusConfig[order.status].color}
                              >
                                {getStatusIcon(order.status)}
                                <span className="ml-1">{statusConfig[order.status].label}</span>
                              </Badge>
                            </div>
                            <CardDescription>
                              Placed on {format(new Date(order.created_at), 'MMM d, yyyy at h:mm a')}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDetailsOrder(order)}
                          >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Payment</p>
                            <p className="font-medium capitalize">
                              {order.payment_method.replace('_', ' ')}
                              {order.payment_status === 'paid' && (
                                <span className="text-green-600 text-sm ml-2">✓ Paid</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Fulfillment</p>
                            <p className="font-medium capitalize flex items-center">
                              {order.fulfillment_method === 'delivery' && <Truck className="h-4 w-4 mr-1" />}
                              {order.fulfillment_method}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="font-medium text-lg">
                              {order.total_amount.toLocaleString('vi-VN')}₫
                            </p>
                          </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-500 mb-2">
                            {order.order_items.length} item{order.order_items.length > 1 ? 's' : ''}
                          </p>
                          <div className="space-y-2">
                            {order.order_items.slice(0, 2).map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  {item.product_name} x{item.quantity}
                                  {item.prescription_required && (
                                    <Badge variant="outline" className="ml-2 text-xs">
                                      Rx Required
                                    </Badge>
                                  )}
                                </span>
                                <span className="text-gray-900">
                                  {(item.unit_price * item.quantity).toLocaleString('vi-VN')}₫
                                </span>
                              </div>
                            ))}
                            {order.order_items.length > 2 && (
                              <p className="text-sm text-gray-500">
                                +{order.order_items.length - 2} more items
                              </p>
                            )}
                          </div>
                        </div>

                        {order.delivery_address && (
                          <div className="border-t pt-4 mt-4">
                            <p className="text-sm text-gray-500">Delivery Address</p>
                            <p className="text-sm text-gray-700 mt-1">{order.delivery_address}</p>
                          </div>
                        )}

                        {order.notes && (
                          <div className="border-t pt-4 mt-4">
                            <p className="text-sm text-gray-500">Order Notes</p>
                            <p className="text-sm text-gray-700 mt-1">{order.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Order Details Dialog */}
        <Dialog open={!!detailsOrder} onOpenChange={open => { if (!open) setDetailsOrder(null) }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                {detailsOrder && (
                  <span>
                    <span className="font-semibold">Order #{detailsOrder.order_number}</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      Placed: {format(new Date(detailsOrder.created_at), 'MMM d, yyyy h:mm a')}
                      {detailsOrder.updated_at && (
                        <> | Updated: {format(new Date(detailsOrder.updated_at), 'MMM d, yyyy h:mm a')}</>
                      )}
                    </span>
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            {detailsOrder && (
              <div className="space-y-6">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge className={statusConfig[detailsOrder.status].color}>
                      {getStatusIcon(detailsOrder.status)}
                      <span className="ml-1">{statusConfig[detailsOrder.status].label}</span>
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Payment</p>
                    <span className="font-medium capitalize">
                      {detailsOrder.payment_method.replace('_', ' ')}
                      {detailsOrder.payment_status === 'paid' && (
                        <span className="text-green-600 text-sm ml-2">✓ Paid</span>
                      )}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fulfillment</p>
                    <span className="font-medium capitalize flex items-center">
                      {detailsOrder.fulfillment_method === 'delivery' && <Truck className="h-4 w-4 mr-1" />}
                      {detailsOrder.fulfillment_method}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <span className="font-medium text-lg">
                      {detailsOrder.total_amount.toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Order Items</p>
                  <div className="divide-y">
                    {safeOrderItems(detailsOrder).length === 0 && (
                      <div className="text-gray-400 text-sm py-2">No items found for this order.</div>
                    )}
                    {safeOrderItems(detailsOrder).map(item => (
                      <div key={item.id} className="flex justify-between py-2 text-sm">
                        <span className="text-gray-700">
                          {item.product_name} x{item.quantity}
                          {item.prescription_required && (
                            <Badge variant="outline" className="ml-2 text-xs">Rx Required</Badge>
                          )}
                        </span>
                        <span className="text-gray-900">
                          {(item.unit_price * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {detailsOrder.delivery_address && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="text-sm text-gray-700 mt-1">{detailsOrder.delivery_address}</p>
                  </div>
                )}
                {detailsOrder.notes && (
                  <div>
                    <p className="text-sm text-gray-500">Order Notes</p>
                    <p className="text-sm text-gray-700 mt-1">{detailsOrder.notes}</p>
                  </div>
                )}
                <div className="text-xs text-gray-400 pt-2">
                  <div>Order ID: {detailsOrder.id}</div>
                  {detailsOrder.updated_at && <div>Last updated: {format(new Date(detailsOrder.updated_at), 'MMM d, yyyy h:mm a')}</div>}
                </div>
              </div>
            )}
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}