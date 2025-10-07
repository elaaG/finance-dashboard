'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TransactionForm from '@/components/TransactionForm'
import { Transaction } from '@/types'

export default function AddTransaction() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (transactionData: Omit<Transaction, 'id'>) => {
    setIsSubmitting(true)
    
    // Simulate API call
    try {
      console.log('Adding transaction:', transactionData)
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to transactions list
      router.push('/transactions')
    } catch (error) {
      console.error('Failed to add transaction:', error)
      alert('Failed to add transaction. Please try again.')
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
        <h1 className="text-3xl font-bold text-gray-900">Add Transaction</h1>
        <p className="text-gray-600 mt-2">Record a new income or expense</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {isSubmitting && (
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg">
            Adding transaction...
          </div>
        )}
        
        <TransactionForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}