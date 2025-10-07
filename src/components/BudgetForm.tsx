'use client'

import { useState } from 'react'
import { Budget } from '@/types'

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'spent'>) => void
  onCancel?: () => void
  initialData?: Partial<Budget>
}

const categories = [
  'Food',
  'Transportation',
  'Entertainment',
  'Shopping',
  'Healthcare',
  'Utilities',
  'Personal Care',
  'Education',
  'Travel',
  'Other'
]

export default function BudgetForm({ onSubmit, onCancel, initialData }: BudgetFormProps) {
  const [formData, setFormData] = useState({
    category: initialData?.category || '',
    amount: initialData?.amount || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      category: formData.category,
      amount: Number(formData.amount)
    })

    // Reset form
    setFormData({
      category: '',
      amount: ''
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          required
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Monthly Budget Amount *
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
            $
          </span>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {initialData ? 'Update Budget' : 'Create Budget'}
        </button>
      </div>
    </form>
  )
}