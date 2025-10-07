'use client'

import { Investment } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { TrendingUp, TrendingDown, Edit, Trash2 } from 'lucide-react'

interface InvestmentCardProps {
  investment: Investment
  onEdit?: (investment: Investment) => void
  onDelete?: (investmentId: string) => void
}

export default function InvestmentCard({ investment, onEdit, onDelete }: InvestmentCardProps) {
  const {
    symbol,
    name,
    shares,
    purchasePrice,
    currentPrice,
    purchaseDate,
    type
  } = investment

  const totalCost = shares * purchasePrice
  const currentValue = shares * currentPrice
  const gain = currentValue - totalCost
  const gainPercentage = (gain / totalCost) * 100
  const isPositive = gain >= 0

  const getTypeColor = (investmentType: string) => {
    switch (investmentType) {
      case 'stock': return 'bg-blue-100 text-blue-800'
      case 'crypto': return 'bg-orange-100 text-orange-800'
      case 'etf': return 'bg-green-100 text-green-800'
      case 'mutual-fund': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-gray-900 text-lg">{symbol}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
              {type.toUpperCase()}
            </span>
          </div>
          <p className="text-gray-600 text-sm">{name}</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(investment)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(investment.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Investment Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Shares</p>
          <p className="font-semibold text-gray-900">{shares}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Avg. Price</p>
          <p className="font-semibold text-gray-900">{formatCurrency(purchasePrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="font-semibold text-gray-900">{formatCurrency(currentPrice)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Purchase Date</p>
          <p className="font-semibold text-gray-900">{formatDate(purchaseDate)}</p>
        </div>
      </div>

      {/* Performance */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total Value</span>
          <span className="font-bold text-gray-900">{formatCurrency(currentValue)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Total Gain/Loss</span>
          <div className="flex items-center space-x-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(gain)} ({gainPercentage.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Gain/Loss Bar */}
      <div className="mt-3">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${isPositive ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ 
              width: `${Math.min(Math.abs(gainPercentage), 100)}%`,
              marginLeft: gainPercentage < 0 ? `${100 - Math.abs(gainPercentage)}%` : '0%'
            }}
          />
        </div>
      </div>
    </div>
  )
}