'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Transaction } from '@/types'
import { Calendar, PieChart as PieChartIcon, BarChart3, TrendingUp } from 'lucide-react'

interface AdvancedSpendingChartProps {
  transactions: Transaction[]
}

const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']

export default function AdvancedSpendingChart({ transactions }: AdvancedSpendingChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')

  // Filter transactions by time range
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date)
    const now = new Date()
    let startDate: Date

    switch (timeRange) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    return transactionDate >= startDate && transaction.type === 'expense'
  })

  // Prepare data for charts
  const categoryData = filteredTransactions.reduce((acc, transaction) => {
    const existing = acc.find(item => item.name === transaction.category)
    if (existing) {
      existing.amount += transaction.amount
    } else {
      acc.push({ name: transaction.category, amount: transaction.amount })
    }
    return acc
  }, [] as { name: string; amount: number }[])

  const monthlyData = filteredTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date)
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
    const existing = acc.find(item => item.month === monthKey)
    
    if (existing) {
      existing.amount += transaction.amount
    } else {
      acc.push({ 
        month: monthKey, 
        amount: transaction.amount,
        display: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      })
    }
    return acc
  }, [] as { month: string; amount: number; display: string }[])

  const dailyData = filteredTransactions.reduce((acc, transaction) => {
    const date = transaction.date
    const existing = acc.find(item => item.date === date)
    
    if (existing) {
      existing.amount += transaction.amount
    } else {
      acc.push({ 
        date, 
        amount: transaction.amount,
        display: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      })
    }
    return acc
  }, [] as { date: string; amount: number; display: string }[]).sort((a, b) => a.date.localeCompare(b.date))

  const chartData = chartType === 'bar' ? categoryData : 
                   chartType === 'line' ? (timeRange === 'week' ? dailyData : monthlyData) : 
                   categoryData

  const totalSpent = categoryData.reduce((sum, item) => sum + item.amount, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Spending Analytics</h2>
          <p className="text-gray-600 mt-1">
            Total spent: <span className="font-semibold text-red-600">${totalSpent.toFixed(2)}</span>
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 sm:mt-0">
          {/* Time Range Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: 'week', label: 'Week', icon: Calendar },
              { value: 'month', label: 'Month', icon: TrendingUp },
              { value: 'year', label: 'Year', icon: BarChart3 }
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value as any)}
                className={`flex items-center space-x-1 px-3 py-1 text-sm rounded-md transition-colors ${
                  timeRange === value 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { value: 'bar', icon: BarChart3, label: 'Bar' },
              { value: 'pie', icon: PieChartIcon, label: 'Pie' },
              { value: 'line', icon: TrendingUp, label: 'Line' }
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setChartType(value as any)}
                className={`p-2 rounded-md transition-colors ${
                  chartType === value 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={label}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <>
              {chartType === 'bar' && (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Bar dataKey="amount" name="Spending">
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {chartType === 'pie' && (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => `${props.name} (${typeof props.percent === 'number' ? (props.percent * 100).toFixed(0) : 0}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                </PieChart>
              )}

              {chartType === 'line' && (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="display" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#8884d8" 
                    name="Daily Spending"
                    strokeWidth={2}
                    dot={{ fill: '#8884d8' }}
                  />
                </LineChart>
              )}
            </>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No spending data available for the selected period
          </div>
        )}
      </div>

      {/* Spending Insights */}
      {categoryData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600 mb-1">Top Category</p>
            <p className="font-semibold text-blue-900">
              {categoryData.sort((a, b) => b.amount - a.amount)[0]?.name || 'N/A'}
            </p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600 mb-1">Average Daily</p>
            <p className="font-semibold text-green-900">
              ${(totalSpent / (timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365)).toFixed(2)}
            </p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-600 mb-1">Categories Used</p>
            <p className="font-semibold text-purple-900">
              {categoryData.length}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}