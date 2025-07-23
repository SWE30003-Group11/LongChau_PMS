"use client"

import { useEffect, useState } from "react"
import { Save, Package } from "lucide-react"
import { motion } from "framer-motion"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from '@/contexts/AuthContext'

export default function PMSSettingsPage() {
  const { profile, setCurrentBranch } = useAuth();
  const [branches, setBranches] = useState<any[]>([])
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null)
  const [settings, setSettings] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch branches and settings on mount or branch change
  useEffect(() => {
    async function fetchBranchesAndSettings() {
      setLoading(true)
      // Fetch branches
      const { data: branchData } = await supabase.from("branches").select("id, name")
      setBranches(branchData || [])
      // Default to first branch if not set
      if ((!selectedBranch) && branchData && branchData.length > 0) {
        setSelectedBranch(branchData[0].id)
      }
      // Fetch settings for selected branch (and global)
      if ((selectedBranch || (branchData && branchData.length > 0)) && branchData) {
        const branchId = selectedBranch || branchData[0].id
        const { data: settingsData } = await supabase
          .from("settings")
          .select("key, value")
          .or(`branch_id.is.null,branch_id.eq.${branchId}`)
        // Merge settings by key (branch-specific overrides global)
        const merged: Record<string, any> = {}
        if (settingsData) {
          for (const s of settingsData) merged[s.key] = s.value
        }
        setSettings(merged)
      }
      setLoading(false)
    }
    fetchBranchesAndSettings()
    // eslint-disable-next-line
  }, [selectedBranch])

  // Always use profile.current_branch_id as the selected branch
  useEffect(() => {
    if (profile && profile.current_branch_id && profile.current_branch_id !== selectedBranch) {
      setSelectedBranch(profile.current_branch_id)
    }
  }, [profile, selectedBranch])

  // Save settings handler
  async function handleSaveSettings() {
    setSaving(true)
    const updates: { key: string, value: any, branch_id: number | null }[] = []
    updates.push({ key: "primary_branch", value: selectedBranch, branch_id: null })
    updates.push({ key: "business_hours_start", value: settings.business_hours_start, branch_id: selectedBranch })
    updates.push({ key: "business_hours_end", value: settings.business_hours_end, branch_id: selectedBranch })
    updates.push({ key: "time_zone", value: settings.time_zone, branch_id: null })
    updates.push({ key: "low_stock_alert", value: settings.low_stock_alert, branch_id: selectedBranch })
    updates.push({ key: "critical_stock_level", value: settings.critical_stock_level, branch_id: selectedBranch })
    updates.push({ key: "notification_email", value: settings.notification_email, branch_id: null })
    for (const u of updates) {
      await supabase.from("settings").upsert({ key: u.key, value: u.value, branch_id: u.branch_id }, { onConflict: "key,branch_id" })
    }
    setSaving(false)
  }

  function updateSetting(key: string, value: any) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Helper to get setting with default
  function getSetting(key: string, fallback: any) {
    const v = settings[key];
    return v === undefined || v === null || v === '' ? fallback : v;
  }

  // When admin changes branch, update DB and reload settings
  const handleBranchChange = async (branchId: number) => {
    if (profile?.role === 'admin') {
      setSelectedBranch(branchId)
      await setCurrentBranch(branchId)
      // settings will reload due to selectedBranch effect
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8">
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
          <div className="p-6 border-b border-gray-100 flex flex-wrap gap-2 items-center">
            <div className="ml-auto">
              <label className="text-xs text-gray-500 mr-2">Branch:</label>
              {profile?.role === 'admin' ? (
                <select
                  className="px-3 py-2 rounded-full border border-gray-200"
                  value={selectedBranch || ''}
                  onChange={e => handleBranchChange(Number(e.target.value))}
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              ) : (
                <span className="px-3 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                  {branches.find(b => b.id === selectedBranch)?.name || 'No branch'}
                </span>
              )}
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center text-gray-500">Loading settings...</div>
            ) : (
              <>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-medium mb-6">Branch & Inventory Settings</h3>
                    <div className="space-y-6">
                      {/* Remove Primary Branch setting from the form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-sm text-gray-600 mb-2 block">Low Stock Alert Threshold</label>
                          <input
                            type="number"
                            value={getSetting('low_stock_alert', 20)}
                            onChange={e => updateSetting('low_stock_alert', e.target.value)}
                            className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-gray-600 mb-2 block">Critical Stock Level</label>
                          <input
                            type="number"
                            value={getSetting('critical_stock_level', 5)}
                            onChange={e => updateSetting('critical_stock_level', e.target.value)}
                            className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Time Zone</label>
                        <select
                          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                          value={getSetting('time_zone', 'Asia/Ho_Chi_Minh (UTC+7)')}
                          onChange={e => updateSetting('time_zone', e.target.value)}
                        >
                          <option value="Asia/Ho_Chi_Minh (UTC+7)">Asia/Ho_Chi_Minh (UTC+7)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-2 block">Notification Email</label>
                        <input
                          type="email"
                          value={getSetting('notification_email', 'notifications@longchau.com')}
                          onChange={e => updateSetting('notification_email', e.target.value)}
                          className="w-full md:w-1/2 px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      className="px-6 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors flex items-center"
                      onClick={handleSaveSettings}
                      disabled={saving}
                    >
                      <Save size={16} className="mr-2" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}