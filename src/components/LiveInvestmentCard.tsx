'use client'

import { useState, useEffect } from 'react'
import { Investment } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'

interface LiveInvestmentCardProps {
  investment: Investment
  onPriceUpdate?: (investment: Investment) => void
}

export default function LiveInvestmentCard({ investment, onPriceUpdate }: LiveInvestmentCardProps) {
  const [currentPrice, setCurrentPrice] = useState(investment.currentPrice)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  const totalValue = investment.shares * currentPrice
  const totalCost = investment.shares * investment.purchasePrice
  const gain = totalValue - totalCost
  const gainPercentage = (gain / totalCost) * 100
  const isPositive = gain >= 0

  const refreshPrice = async () => {
    setIsUpdating(true)
    try {
      const response = await fetch(`/api/investments/${investment.id}/price`, {
        method: 'POST'
      })
      const updatedInvestment = await response.json()
      
      setCurrentPrice(updatedInvestment.currentPrice)
      setLastUpdate(new Date())
      
      if (onPriceUpdate) {
        onPriceUpdate(updatedInvestment)
      }
    } catch (error) {
      console.error('Error refreshing price:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshPrice, 30000)
    return () => clearInterval(interval)
  }, [investment.id])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-gray-900 text-lg">{investment.symbol}</h3>
          <p className="text-gray-600 text-sm">{investment.name}</p>
        </div>
        
        <button
          onClick={refreshPrice}
          disabled={isUpdating}
          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Current Price</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(currentPrice)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Shares</p>
          <p className="text-lg font-semibold text-gray-900">
            {investment.shares}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Total Value</span>
          <span className="font-bold text-gray-900">{formatCurrency(totalValue)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Gain/Loss</span>
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

      <div className="mt-3 text-xs text-gray-500 text-right">
        Updated: {lastUpdate.toLocaleTimeString()}
      </div>
    </div>
  )
}