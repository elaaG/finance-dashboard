'use client'

import { Budget } from '@/types'
import { formatCurrency } from '@/lib/utils'
import { Edit, Trash2, AlertTriangle } from 'lucide-react'

interface BudgetCardProps {
  budget: Budget
  onEdit?: (budget: Budget) => void
  onDelete?: (budgetId: string) => void
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { category, amount, spent } = budget
  const remaining = amount - spent
  const percentage = (spent / amount) * 100
  const isOverBudget = spent > amount
  const isNearLimit = percentage >= 80 && !isOverBudget

  const getProgressBarColor = () => {
    if (isOverBudget) return 'bg-red-500'
    if (isNearLimit) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-600 bg-red-50 border-red-200'
    if (isNearLimit) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  const getStatusText = () => {
    if (isOverBudget) return `Over budget by ${formatCurrency(Math.abs(remaining))}`
    if (isNearLimit) return 'Approaching budget limit'
    return `${formatCurrency(remaining)} remaining`
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">{category}</h3>
          <p className="text-gray-600 text-sm">Monthly Budget</p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2">
          {onEdit && (
            <button
              onClick={() => onEdit(budget)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(budget.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Spent</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(spent)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Budget</p>
          <p className="text-lg font-semibold text-gray-900">
            {formatCurrency(amount)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{percentage.toFixed(1)}% spent</span>
          <span>{getStatusText()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${getProgressBarColor()} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Warning Alert */}
      {(isOverBudget || isNearLimit) && (
        <div className={`flex items-center space-x-2 p-3 rounded-lg border ${getStatusColor()}`}>
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">
            {isOverBudget 
              ? `You've exceeded your ${category} budget!` 
              : `You're close to your ${category} budget limit.`
            }
          </span>
        </div>
      )}
    </div>
  )
}