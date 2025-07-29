"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from '@/lib/framer'
import { Bell, X, ArrowRight, Package, FileText, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'order' | 'prescription' | 'system'
  status: 'unread' | 'read'
  created_at: string
  action_url?: string
}

export function NotificationsPopup() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Subscribe to notifications channel for real-time updates
    const subscription = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
      }, payload => {
        const newNotification = payload.new as Notification
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)
      })
      .subscribe()

    // Fetch initial notifications
    fetchNotifications()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchNotifications = async () => {
    const { data: user } = await supabase.auth.getUser()
    if (!user.user?.id) return

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (data) {
      setNotifications(data)
      setUnreadCount(data.filter(n => n.status === 'unread').length)
    }
  }

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({ status: 'read' })
      .eq('id', id)

    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, status: 'read' } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order':
        return Package
      case 'prescription':
        return FileText
      default:
        return Bell
    }
  }

  const getStatusColor = (status: 'unread' | 'read') => {
    return status === 'unread' ? 'bg-blue-500' : 'bg-gray-300'
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-6 w-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 h-5 w-5 flex items-center justify-center text-xs text-white bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-[400px] bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {notifications.map((notification) => {
                    const Icon = getIcon(notification.type)
                    return (
                      <motion.div
                        key={notification.id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 hover:bg-gray-50 transition-colors relative ${
                          notification.status === 'unread' ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className="flex gap-4">
                          <div className={`rounded-full p-2 ${
                            notification.type === 'order' ? 'bg-green-100 text-green-600' :
                            notification.type === 'prescription' ? 'bg-blue-100 text-blue-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium mb-1">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                            {notification.action_url && (
                              <a
                                href={notification.action_url}
                                className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 mt-2"
                              >
                                View Details
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </a>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.created_at).toLocaleString()}
                            </p>
                          </div>
                          {notification.status === 'unread' && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              <span className="sr-only">Mark as read</span>
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => {/* Implement view all */}}
                  className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center w-full"
                >
                  View All Notifications
                  <ArrowRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}