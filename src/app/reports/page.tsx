'use client'

import { useState, useEffect } from 'react'
import { Download, FileText, PieChart, BarChart3 } from 'lucide-react'
import { Transaction, Budget, Investment } from '@/types'
import { exportToCSV, exportFinancialReport } from '@/lib/exportUtils'

export default function Reports() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [investments, setInvestments] = useState<Investment[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    loadData()
  }, [dateRange])

  const loadData = async () => {
    try {
      setLoading(true)
      
      const [transactionsRes, budgetsRes, investmentsRes] = await Promise.all([
        fetch(`/api/transactions?startDate=${dateRange.start}&endDate=${dateRange.end}`),
        fetch('/api/budgets'),
        fetch('/api/investments')
      ])

      const [transactionsData, budgetsData, investmentsData] = await Promise.all([
        transactionsRes.json(),
        budgetsRes.json(),
        investmentsRes.json()
      ])

      setTransactions(transactionsData)
      setBudgets(budgetsData)
      setInvestments(investmentsData)
    } catch (error) {
      console.error('Error loading report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExportTransactions = () => {
    exportToCSV(transactions, 'transactions')
  }

  const handleExportBudgets = () => {
    exportToCSV(budgets, 'budgets')
  }

  const handleExportInvestments = () => {
    exportToCSV(investments, 'investments')
  }

  const handleExportFullReport = () => {
    const report = exportFinancialReport(transactions, budgets, investments)
    const blob = new Blob([report], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    window.URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading reports...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600 mt-2">Export and analyze your financial data</p>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Report Period</h2>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Transactions Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Transactions</h3>
          <p className="text-gray-600 text-sm mb-4">
            Export all transactions as CSV
          </p>
          <button
            onClick={handleExportTransactions}
            disabled={transactions.length === 0}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export ({transactions.length})</span>
          </button>
        </div>

        {/* Budgets Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <PieChart className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Budgets</h3>
          <p className="text-gray-600 text-sm mb-4">
            Export budget data and progress
          </p>
          <button
            onClick={handleExportBudgets}
            disabled={budgets.length === 0}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export ({budgets.length})</span>
          </button>
        </div>

        {/* Investments Export */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Investments</h3>
          <p className="text-gray-600 text-sm mb-4">
            Export portfolio and performance data
          </p>
          <button
            onClick={handleExportInvestments}
            disabled={investments.length === 0}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export ({investments.length})</span>
          </button>
        </div>

        {/* Full Report */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Download className="h-6 w-6 text-orange-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Full Report</h3>
          <p className="text-gray-600 text-sm mb-4">
            Complete financial report (JSON)
          </p>
          <button
            onClick={handleExportFullReport}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Transactions</h3>
          <p className="text-3xl font-bold text-blue-600">{transactions.length}</p>
          <p className="text-sm text-gray-600">Total transactions in period</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Budget Utilization</h3>
          <p className="text-3xl font-bold text-green-600">
            {budgets.length > 0 
              ? `${((budgets.reduce((sum, b) => sum + b.spent, 0) / budgets.reduce((sum, b) => sum + b.amount, 0)) * 100).toFixed(1)}%`
              : '0%'
            }
          </p>
          <p className="text-sm text-gray-600">Of total budget spent</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">Portfolio Value</h3>
          <p className="text-3xl font-bold text-purple-600">
            ${investments.reduce((sum, i) => sum + (i.shares * i.currentPrice), 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">Current investment value</p>
        </div>
      </div>
    </div>
  )
}