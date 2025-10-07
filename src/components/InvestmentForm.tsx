'use client'

import { useState } from 'react'
import { Investment } from '@/types'

interface InvestmentFormProps {
  onSubmit: (investment: Omit<Investment, 'id' | 'currentPrice'>) => void
  onCancel?: () => void
  initialData?: Partial<Investment>
}

const investmentTypes = [
  { value: 'stock', label: 'Stock' },
  { value: 'crypto', label: 'Cryptocurrency' },
  { value: 'etf', label: 'ETF' },
  { value: 'mutual-fund', label: 'Mutual Fund' }
]

export default function InvestmentForm({ onSubmit, onCancel, initialData }: InvestmentFormProps) {
  const [formData, setFormData] = useState({
    symbol: initialData?.symbol || '',
    name: initialData?.name || '',
    shares: initialData?.shares || '',
    purchasePrice: initialData?.purchasePrice || '',
    purchaseDate: initialData?.purchaseDate || new Date().toISOString().split('T')[0],
    type: initialData?.type || 'stock'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.symbol || !formData.name || !formData.shares || !formData.purchasePrice) {
      alert('Please fill in all required fields')
      return
    }

    onSubmit({
      symbol: formData.symbol.toUpperCase(),
      name: formData.name,
      shares: Number(formData.shares),
      purchasePrice: Number(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
      type: formData.type as any
    })

    // Reset form
    setFormData({
      symbol: '',
      name: '',
      shares: '',
      purchasePrice: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      type: 'stock'
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
      {/* Symbol and Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Symbol *
          </label>
          <input
            type="text"
            required
            value={formData.symbol}
            onChange={(e) => handleChange('symbol', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
            placeholder="AAPL"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Investment Type *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {investmentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Investment Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Apple Inc."
        />
      </div>

      {/* Shares and Purchase Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shares/Units *
          </label>
          <input
            type="number"
            step="0.0001"
            min="0"
            required
            value={formData.shares}
            onChange={(e) => handleChange('shares', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Price per Share *
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
              value={formData.purchasePrice}
              onChange={(e) => handleChange('purchasePrice', e.target.value)}
              className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="150.00"
            />
          </div>
        </div>
      </div>

      {/* Purchase Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Purchase Date *
        </label>
        <input
          type="date"
          required
          value={formData.purchaseDate}
          onChange={(e) => handleChange('purchaseDate', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
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
          {initialData ? 'Update Investment' : 'Add Investment'}
        </button>
      </div>
    </form>
  )
}