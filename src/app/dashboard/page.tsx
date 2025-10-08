'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import StatsCard from '@/components/StatsCard'
import SpendingChart from '@/components/SpendingChart'
import RecentTransactions from '@/components/RecentTransactions'
import BudgetProgress from '@/components/BudgetProgress'
import { Transaction, Budget } from '@/types'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    monthlyGrowth: 0
  })
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth/signin')
      return
    }

    loadDashboardData()
  }, [session, status, router])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load transactions
      const transactionsResponse = await fetch('/api/transactions?limit=5')
      const transactions = await transactionsResponse.json()
      setRecentTransactions(transactions)

      // Load budgets
      const budgetsResponse = await fetch('/api/budgets')
      const budgetsData = await budgetsResponse.json()
      setBudgets(budgetsData)

      // Calculate stats
      const income = transactions
        .filter((t: Transaction) => t.type === 'income')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

      const expenses = transactions
        .filter((t: Transaction) => t.type === 'expense')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)

      setStats({
        totalBalance: income - expenses,
        totalIncome: income,
        totalExpenses: expenses,
        monthlyGrowth: 8.2 // This would come from comparing with previous month
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-blue-100">
          Here's your financial overview for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Balance" 
          value={stats.totalBalance}
          change={stats.monthlyGrowth}
          type="currency"
        />
        <StatsCard 
          title="Monthly Income" 
          value={stats.totalIncome}
          change={5.1}
          type="currency"
        />
        <StatsCard 
          title="Monthly Expenses" 
          value={stats.totalExpenses}
          change={-3.2}
          type="currency"
        />
        <StatsCard 
          title="Savings Rate" 
          value={stats.totalIncome > 0 ? ((stats.totalIncome - stats.totalExpenses) / stats.totalIncome) * 100 : 0}
          change={2.5}
          type="percentage"
        />
      </div>

      {/* Charts and Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart transactions={recentTransactions} />
        <RecentTransactions transactions={recentTransactions} />
      </div>

      {/* Budget Progress */}
      <BudgetProgress budgets={budgets} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Add Transaction</h3>
          <p className="text-gray-600 text-sm mb-4">Record new income or expense</p>
          <button 
            onClick={() => router.push('/transactions/add')}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add New
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Manage Budgets</h3>
          <p className="text-gray-600 text-sm mb-4">Set and track spending limits</p>
          <button 
            onClick={() => router.push('/budgets')}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            View Budgets
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-center">
          <h3 className="font-semibold text-gray-900 mb-2">Portfolio</h3>
          <p className="text-gray-600 text-sm mb-4">Track your investments</p>
          <button 
            onClick={() => router.push('/investments')}
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            View Portfolio
          </button>
        </div>
      </div>
    </div>
  )
}