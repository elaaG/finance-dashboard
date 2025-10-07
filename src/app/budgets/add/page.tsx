'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import BudgetForm from '@/components/BudgetForm'
import { Budget } from '@/types'

export default function AddBudget() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      console.log('Creating budget:', budgetData)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to budgets list
      router.push('/budgets')
    } catch (error) {
      console.error('Failed to create budget:', error)
      alert('Failed to create budget. Please try again.')
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
        <h1 className="text-3xl font-bold text-gray-900">Create Budget</h1>
        <p className="text-gray-600 mt-2">Set a monthly spending limit for a category</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {isSubmitting && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
            Creating budget...
          </div>
        )}
        
        <BudgetForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>

      {/* Tips Section */}
      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Budgeting Tips</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• Start with categories where you spend the most money</li>
          <li>• Review your past spending to set realistic limits</li>
          <li>• Remember to include occasional expenses</li>
          <li>• Adjust your budgets as your spending habits change</li>
        </ul>
      </div>
    </div>
  )
}