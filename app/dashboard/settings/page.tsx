"use client"

import { useState } from "react"
import { Save, Store, Users, Package, FileText, Bell, Shield, Database, Activity } from "lucide-react"
import { motion } from "framer-motion"

export default function PMSSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "General", icon: Store },
    { id: "operations", label: "Operations", icon: Activity },
    { id: "inventory", label: "Inventory", icon: Package },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "backup", label: "Backup", icon: Database },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-light">System Settings</h1>
          <p className="text-gray-500 mt-1">Configure your pharmacy management system</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100"
        >
          {/* Tab Navigation */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-4 py-2 rounded-full text-sm transition-all
                    ${activeTab === tab.id 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <tab.icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "general" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">General Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">System Name</label>
                        <input
                          type="text"
                          defaultValue="Long Chau PMS"
                          className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Primary Branch</label>
                        <select className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400">
                          <option>District 1 - Main Store</option>
                          <option>District 2</option>
                          <option>District 3</option>
                          <option>District 7</option>
                          <option>Thu Duc</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Business Hours</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input
                          type="time"
                          defaultValue="08:00"
                          className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                        />
                        <input
                          type="time"
                          defaultValue="22:00"
                          className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Time Zone</label>
                      <select className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400">
                        <option>Asia/Ho_Chi_Minh (UTC+7)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "operations" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">Operations Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Auto-approve Orders</h4>
                        <p className="text-sm text-gray-500">Automatically approve orders under ₫500,000</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Express Checkout</h4>
                        <p className="text-sm text-gray-500">Enable quick checkout for regular customers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Multi-Branch Sync</h4>
                        <p className="text-sm text-gray-500">Sync inventory across all branches in real-time</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Default Payment Terms</label>
                      <select className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400">
                        <option>Immediate Payment</option>
                        <option>Net 30 Days</option>
                        <option>Net 60 Days</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "inventory" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">Inventory Management</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Low Stock Alert Threshold</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            defaultValue="20"
                            className="w-24 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                          />
                          <span className="ml-3 text-gray-600">units</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Critical Stock Level</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            defaultValue="5"
                            className="w-24 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                          />
                          <span className="ml-3 text-gray-600">units</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Auto-reorder</h4>
                        <p className="text-sm text-gray-500">Automatically create purchase orders for low stock items</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Expiry Date Alerts</h4>
                        <p className="text-sm text-gray-500">Alert 90 days before product expiration</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "prescriptions" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">Prescription Management</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Prescription Validity Period</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-24 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                        />
                        <span className="ml-3 text-gray-600">days</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Digital Prescription Upload</h4>
                        <p className="text-sm text-gray-500">Allow customers to upload prescription images</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Pharmacist Verification Required</h4>
                        <p className="text-sm text-gray-500">Require pharmacist approval for all prescriptions</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Authorized Pharmacists</label>
                      <div className="space-y-2">
                        {["Dr. Tran Van A", "Dr. Nguyen Thi B", "Dr. Le Van C"].map((name) => (
                          <div key={name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <span className="text-sm">{name}</span>
                            <span className="text-xs text-gray-500">License: PH-2025-XXX</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">System Notifications</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {[
                        { title: "Low Stock Alerts", desc: "Notify when inventory is below threshold", defaultChecked: true },
                        { title: "New Orders", desc: "Alert staff when new orders are placed", defaultChecked: true },
                        { title: "Prescription Approvals", desc: "Notify pharmacists of pending prescriptions", defaultChecked: true },
                        { title: "Payment Confirmations", desc: "Send confirmations for successful payments", defaultChecked: true },
                        { title: "System Maintenance", desc: "Alert about scheduled maintenance", defaultChecked: false },
                        { title: "Daily Reports", desc: "Send daily summary reports to managers", defaultChecked: true },
                      ].map((notification) => (
                        <div key={notification.title} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-500">{notification.desc}</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" defaultChecked={notification.defaultChecked} className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                          </label>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Notification Email</label>
                      <input
                        type="email"
                        defaultValue="notifications@longchau.com"
                        className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">Security Settings</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Require 2FA for all staff accounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Session Timeout</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-24 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                        />
                        <span className="ml-3 text-gray-600">minutes</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Password Policy</label>
                      <div className="space-y-3">
                        {[
                          "Minimum 8 characters",
                          "At least one uppercase letter",
                          "At least one number",
                          "At least one special character",
                          "Password expires every 90 days"
                        ].map((policy) => (
                          <label key={policy} className="flex items-center">
                            <input type="checkbox" defaultChecked className="rounded mr-3" />
                            <span className="text-sm text-gray-600">{policy}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-xl">
                      <h4 className="font-medium text-yellow-900 mb-2">Security Audit</h4>
                      <p className="text-sm text-yellow-700 mb-3">Last security audit: May 15, 2025</p>
                      <button className="text-sm text-yellow-900 underline">Schedule Next Audit</button>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center">
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "backup" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-6">Backup & Recovery</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <h4 className="font-medium">Automatic Backups</h4>
                        <p className="text-sm text-gray-500">Backup system data daily at 2:00 AM</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gray-900"></div>
                      </label>
                    </div>

                    <div>
                      <label className="text-sm text-gray-600 mb-2 block">Backup Retention</label>
                      <select className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400">
                        <option>7 days</option>
                        <option>14 days</option>
                        <option>30 days</option>
                        <option>90 days</option>
                      </select>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <h4 className="font-medium mb-3">Recent Backups</h4>
                      <div className="space-y-2">
                        {[
                          { date: "June 10, 2025 2:00 AM", size: "1.2 GB", status: "success" },
                          { date: "June 9, 2025 2:00 AM", size: "1.2 GB", status: "success" },
                          { date: "June 8, 2025 2:00 AM", size: "1.1 GB", status: "success" },
                        ].map((backup) => (
                          <div key={backup.date} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <div>
                              <p className="text-sm font-medium">{backup.date}</p>
                              <p className="text-xs text-gray-500">{backup.size}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full">
                              {backup.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button className="mt-4 text-sm text-gray-600 hover:text-gray-900">View all backups →</button>
                    </div>

                    <div className="flex gap-3">
                      <button className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors">
                        Backup Now
                      </button>
                      <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors">
                        Restore from Backup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}