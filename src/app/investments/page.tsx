'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, TrendingUp, DollarSign, PieChart } from 'lucide-react'
import InvestmentCard from '@/components/InvestmentCard'
import { Investment, PortfolioSummary } from '@/types'

// Sample investment data
const sampleInvestments: Investment[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    shares: 10,
    purchasePrice: 150.00,
    currentPrice: 185.00,
    purchaseDate: '2024-01-10',
    type: 'stock'
  },
  {
    id: '2',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    shares: 5,
    purchasePrice: 380.00,
    currentPrice: 420.00,
    purchaseDate: '2024-01-15',
    type: 'stock'
  },
  {
    id: '3',
    symbol: 'BTC',
    name: 'Bitcoin',
    shares: 0.05,
    purchasePrice: 45000.00,
    currentPrice: 52000.00,
    purchaseDate: '2024-01-20',
    type: 'crypto'
  },
  {
    id: '4',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    shares: 8,
    purchasePrice: 450.00,
    currentPrice: 470.00,
    purchaseDate: '2024-01-25',
    type: 'etf'
  }
]

export default function Investments() {
  const [investments, setInvestments] = useState<Investment[]>(sampleInvestments)

  // Calculate portfolio summary
  const portfolioSummary: PortfolioSummary = investments.reduce((summary, investment) => {
    const cost = investment.shares * investment.purchasePrice
    const value = investment.shares * investment.currentPrice
    const gain = value - cost
    
    return {
      totalValue: summary.totalValue + value,
      totalCost: summary.totalCost + cost,
      totalGain: summary.totalGain + gain,
      dailyChange: summary.dailyChange + (gain * 0.01), // Simulated daily change
      gainPercentage: 0 // Will calculate after
    }
  }, {
    totalValue: 0,
    totalCost: 0,
    totalGain: 0,
    dailyChange: 0,
    gainPercentage: 0
  })

  portfolioSummary.gainPercentage = (portfolioSummary.totalGain / portfolioSummary.totalCost) * 100

  const handleAddInvestment = (investmentData: Omit<Investment, 'id' | 'currentPrice'>) => {
    const newInvestment: Investment = {
      ...investmentData,
      id: Math.random().toString(36).substr(2, 9),
      currentPrice: investmentData.purchasePrice // Start with purchase price
    }
    setInvestments([...investments, newInvestment])
  }

  const handleEditInvestment = (investment: Investment) => {
    // TODO: Implement edit functionality
    console.log('Edit investment:', investment)
    alert('Edit functionality will be implemented soon')
  }

  const handleDeleteInvestment = (investmentId: string) => {
    if (confirm('Are you sure you want to delete this investment?')) {
      const updatedInvestments = investments.filter(i => i.id !== investmentId)
      setInvestments(updatedInvestments)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio</h1>
          <p className="text-gray-600 mt-2">Track your stocks, crypto, and other investments</p>
        </div>
        
        <Link
          href="/investments/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Investment
        </Link>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ${portfolioSummary.totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gain/Loss</p>
              <p className={`text-2xl font-bold ${
                portfolioSummary.totalGain >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                ${portfolioSummary.totalGain.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <PieChart className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Return</p>
              <p className={`text-2xl font-bold ${
                portfolioSummary.gainPercentage >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioSummary.gainPercentage.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-orange-600 font-bold text-sm">24H</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Daily Change</p>
              <p className={`text-2xl font-bold ${
                portfolioSummary.dailyChange >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {portfolioSummary.dailyChange >= 0 ? '+' : ''}
                ${Math.abs(portfolioSummary.dailyChange).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Investments</h2>
        
        {investments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                investment={investment}
                onEdit={handleEditInvestment}
                onDelete={handleDeleteInvestment}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No investments yet</h3>
            <p className="text-gray-500 mb-6">
              Start building your portfolio by adding your first investment.
            </p>
            <Link
              href="/investments/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Investment
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}