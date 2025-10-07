'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import TransactionList from '@/components/TransactionList'
import { Transaction } from '@/types'
import { transactionsApi } from '@/lib/api'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await transactionsApi.getAll()
      setTransactions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load transactions')
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  const handleAddTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await transactionsApi.create(transactionData)
      setTransactions(prev => [newTransaction, ...prev])
    } catch (err) {
      alert('Failed to add transaction. Please try again.')
      console.error('Error adding transaction:', err)
    }
  }

  const handleEditTransaction = (transaction: Transaction) => {
    // TODO: Implement edit functionality
    console.log('Edit transaction:', transaction)
    alert('Edit functionality will be implemented soon')
  }

  const handleDeleteTransaction = async (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsApi.delete(transactionId)
        setTransactions(prev => prev.filter(t => t.id !== transactionId))
      } catch (err) {
        alert('Failed to delete transaction. Please try again.')
        console.error('Error deleting transaction:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-lg text-gray-600">Loading transactions...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600 mt-2">Manage your income and expenses</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Transactions</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={loadTransactions}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-2">Manage your income and expenses</p>
        </div>
        
        <Link
          href="/transactions/add"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-4 sm:mt-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Link>
      </div>

      {/* Transactions List */}
      <TransactionList 
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  )
}