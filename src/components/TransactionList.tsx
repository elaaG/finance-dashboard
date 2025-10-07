'use client'

import { useState } from 'react'
import { Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ArrowUpRight, ArrowDownLeft, Edit, Trash2, Filter } from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit?: (transaction: Transaction) => void
  onDelete?: (transactionId: string) => void
}

export default function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  // Sort transactions
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return b.amount - a.amount
    }
  })

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header with filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Transactions</h2>
            <p className="text-gray-600 mt-1">
              {filteredTransactions.length} transactions found
            </p>
          </div>
          
          <div className="flex space-x-3">
            {/* Filter Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'all' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('income')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'income' 
                    ? 'bg-white text-green-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilter('expense')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  filter === 'expense' 
                    ? 'bg-white text-red-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Expenses
              </button>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="flex space-x-6 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-lg font-semibold text-green-600">
              +{formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-lg font-semibold text-red-600">
              -{formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Net</p>
            <p className={`text-lg font-semibold ${
              totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="divide-y divide-gray-200">
        {sortedTransactions.map((transaction) => (
          <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {/* Icon */}
                <div className={`p-2 rounded-full ${
                  transaction.type === 'income' 
                    ? 'bg-green-100 text-green-600' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-500">{transaction.category}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(transaction.date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount and Actions */}
              <div className="flex items-center space-x-4">
                <span className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>

                {/* Action Buttons */}
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(transaction)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(transaction.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedTransactions.length === 0 && (
        <div className="text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'Get started by adding your first transaction.' 
              : `No ${filter} transactions found. Try changing your filters.`
            }
          </p>
        </div>
      )}
    </div>
  )
}