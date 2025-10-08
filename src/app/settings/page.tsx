'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Save, User, Bell, Shield, CreditCard } from 'lucide-react'

export default function Settings() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const [profile, setProfile] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  })

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    budgetAlerts: true,
    investmentUpdates: false,
    weeklyReports: true,
    monthlySummaries: true
  })

  const handleSave = async (section: string) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage(`${section} settings saved successfully!`)
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Error saving settings')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'billing', name: 'Billing', icon: CreditCard },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
      </div>

      {message && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">{message}</p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Currency
                  </label>
                  <select
                    value={profile.currency}
                    onChange={(e) => setProfile(prev => ({ ...prev, currency: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                    <option value="JPY">Japanese Yen (¥)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={profile.dateFormat}
                    onChange={(e) => setProfile(prev => ({ ...prev, dateFormat: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Profile')}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {key === 'emailNotifications' && 'Receive email notifications'}
                        {key === 'budgetAlerts' && 'Get alerts when approaching budget limits'}
                        {key === 'investmentUpdates' && 'Receive investment performance updates'}
                        {key === 'weeklyReports' && 'Get weekly financial summaries'}
                        {key === 'monthlySummaries' && 'Receive monthly financial reports'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setNotifications(prev => ({
                          ...prev,
                          [key]: e.target.checked
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSave('Notification')}
                  disabled={loading}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">
                  Security features will be implemented in future updates.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">Billing Information</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">
                  Finance Dashboard is completely free! No billing information required.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}