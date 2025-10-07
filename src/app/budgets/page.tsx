'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Target, TrendingUp } from 'lucide-react'
import BudgetCard from '@/components/BudgetCard'
import { Budget } from '@/types'
import { sampleBudgets, sampleTransactions } from '@/lib/sampleData'

export default function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets)

  // Calculate total budget and spent
  const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
  const budgetUtilization = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0

  const handleAddBudget = (budgetData: Omit<Budget, 'id' | 'spent'>) => {
    const newBudget: Budget = {
      ...budgetData,
      id: Math.random().toString(36).substr(2, 9),
      spent: 0
    }
    setBudgets([...budgets, newBudget])
  }

  const handleEditBudget = (budget: Budget) => {
    // TODO: Implement edit functionality
    console.log('Edit budget:', budget)
    alert('Edit functionality will be implemented soon')
  }

  const handleDeleteBudget = (budgetId: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      const updatedBudgets = budgets.filter(b => b.id !== budgetId)
      setBudgets(updatedBudgets)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-2">Set and track your spending limits</p>
        </div>
        
        <Link
          href="/budgets/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Budget
        </Link>
      </div>

      {/* Budget Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalBudget.toFixed(2)}
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
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">
                ${totalSpent.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <div className="w-6 h-6 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-sm">
                  {budgetUtilization.toFixed(0)}%
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Used</p>
              <p className="text-2xl font-bold text-gray-900">
                {budgetUtilization.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Utilization Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Utilization</h2>
        <div className="space-y-4">
          {budgets.map((budget) => {
            const percentage = (budget.spent / budget.amount) * 100
            return (
              <div key={budget.id} className="flex items-center space-x-4">
                <div className="w-32">
                  <span className="text-sm font-medium text-gray-700">
                    {budget.category}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${
                        percentage > 100 ? 'bg-red-500' : 
                        percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className="text-sm text-gray-600">
                    ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Budgets</h2>
        
        {budgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => (
              <BudgetCard
                key={budget.id}
                budget={budget}
                onEdit={handleEditBudget}
                onDelete={handleDeleteBudget}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets created yet</h3>
            <p className="text-gray-500 mb-6">
              Create your first budget to start tracking your spending limits.
            </p>
            <Link
              href="/budgets/add"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Budget
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}