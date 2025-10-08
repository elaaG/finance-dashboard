'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { Investment } from '@/types'

interface PortfolioPerformanceChartProps {
  investments: Investment[]
}

// Generate mock historical data for portfolio performance
function generateHistoricalData(investments: Investment[]) {
  const totalValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0)
  const totalCost = investments.reduce((sum, inv) => sum + (inv.shares * inv.purchasePrice), 0)
  const currentGain = totalValue - totalCost

  const data = []
  const days = 30
  
  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    
    // Simulate daily fluctuations
    const dailyChange = (Math.random() - 0.5) * 0.02 // ±1% daily change
    const simulatedValue = totalValue * (1 + dailyChange * (days - i) / days)
    const simulatedGain = simulatedValue - totalCost

    data.push({
      date: date.toISOString().split('T')[0],
      display: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat(simulatedValue.toFixed(2)),
      gain: parseFloat(simulatedGain.toFixed(2))
    })
  }

  return data
}

export default function PortfolioPerformanceChart({ investments }: PortfolioPerformanceChartProps) {
  const [timeRange, setTimeRange] = useState<'1m' | '3m' | '1y'>('1m')
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (investments.length > 0) {
      const data = generateHistoricalData(investments)
      setChartData(data)
    }
  }, [investments, timeRange])

  const currentValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0)
  const totalGain = investments.reduce((sum, inv) => sum + (inv.shares * (inv.currentPrice - inv.purchasePrice)), 0)

  if (investments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Portfolio Performance</h2>
        <div className="h-80 flex items-center justify-center text-gray-500">
          No investment data available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Portfolio Performance</h2>
          <div className="flex space-x-4 mt-2">
            <div>
              <p className="text-sm text-gray-600">Current Value</p>
              <p className="text-lg font-bold text-gray-900">${currentValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Gain/Loss</p>
              <p className={`text-lg font-bold ${totalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${totalGain.toFixed(2)} ({((totalGain / (currentValue - totalGain)) * 100).toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex bg-gray-100 rounded-lg p-1 mt-4 sm:mt-0">
          {[
            { value: '1m', label: '1M' },
            { value: '3m', label: '3M' },
            { value: '1y', label: '1Y' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimeRange(value as any)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === value 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="display" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`$${value}`, 'Portfolio Value']}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#8884d8" 
                fillOpacity={1}
                fill="url(#colorValue)" 
                name="Portfolio Value"
              />
              <Line 
                type="monotone" 
                dataKey="gain" 
                stroke="#00C49F" 
                strokeWidth={2}
                dot={false}
                name="Total Gain/Loss"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading performance data...
          </div>
        )}
      </div>
    </div>
  )
}