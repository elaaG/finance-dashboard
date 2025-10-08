'use client'

import { Budget } from '@/types'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface BudgetProgressProps {
  budgets: Budget[]
}

export default function BudgetProgress({ budgets }: BudgetProgressProps) {
  const overBudget = budgets.filter(b => b.spent > b.amount)
  const nearBudget = budgets.filter(b => (b.spent / b.amount) >= 0.8 && b.spent <= b.amount)
  const onTrack = budgets.filter(b => (b.spent / b.amount) < 0.8)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Budget Health</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Over Budget */}
        <div className="border-l-4 border-red-500 pl-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">Over Budget</h3>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-1">{overBudget.length}</p>
          <p className="text-sm text-gray-600">Categories exceeding limits</p>
          
          {overBudget.length > 0 && (
            <div className="mt-3 space-y-1">
              {overBudget.map(budget => (
                <div key={budget.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{budget.category}</span>
                  <span className="text-red-600 font-medium">
                    ${(budget.spent - budget.amount).toFixed(2)} over
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Near Limit */}
        <div className="border-l-4 border-yellow-500 pl-4">
          <div className="flex items-center space-x-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <h3 className="font-semibold text-gray-900">Near Limit</h3>
          </div>
          <p className="text-2xl font-bold text-yellow-600 mb-1">{nearBudget.length}</p>
          <p className="text-sm text-gray-600">Close to budget limits</p>
          
          {nearBudget.length > 0 && (
            <div className="mt-3 space-y-1">
              {nearBudget.map(budget => (
                <div key={budget.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{budget.category}</span>
                  <span className="text-yellow-600 font-medium">
                    {((budget.spent / budget.amount) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* On Track */}
        <div className="border-l-4 border-green-500 pl-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-gray-900">On Track</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 mb-1">{onTrack.length}</p>
          <p className="text-sm text-gray-600">Within budget limits</p>
          
          {onTrack.length > 0 && (
            <div className="mt-3 space-y-1">
              {onTrack.slice(0, 3).map(budget => (
                <div key={budget.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{budget.category}</span>
                  <span className="text-green-600 font-medium">
                    {((budget.spent / budget.amount) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
              {onTrack.length > 3 && (
                <div className="text-sm text-gray-500">
                  +{onTrack.length - 3} more categories
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {budgets.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No budgets set up yet. Create budgets to track your spending limits.
        </div>
      )}
    </div>
  )
}