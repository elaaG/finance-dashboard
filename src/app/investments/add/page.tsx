'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import InvestmentForm from '@/components/InvestmentForm'
import { Investment } from '@/types'

export default function AddInvestment() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (investmentData: Omit<Investment, 'id' | 'currentPrice'>) => {
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      console.log('Adding investment:', investmentData)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to investments list
      router.push('/investments')
    } catch (error) {
      console.error('Failed to add investment:', error)
      alert('Failed to add investment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add Investment</h1>
        <p className="text-gray-600 mt-2">Track your stocks, crypto, and other assets</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {isSubmitting && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
            Adding investment...
          </div>
        )}
        
        <InvestmentForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-green-50 rounded-xl p-6">
        <h3 className="font-semibold text-green-900 mb-3">Investment Tips</h3>
        <ul className="text-green-800 space-y-2 text-sm">
          <li>• Diversify your portfolio across different asset types</li>
          <li>• Consider your risk tolerance when choosing investments</li>
          <li>• Regularly review and rebalance your portfolio</li>
          <li>• Think long-term rather than trying to time the market</li>
        </ul>
      </div>
    </div>
  )
}