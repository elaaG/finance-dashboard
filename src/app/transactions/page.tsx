'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import TransactionList from '@/components/TransactionList'
import { Transaction } from '@/types'
import { sampleTransactions, addTransaction } from '@/lib/sampleData'

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions)

  const handleAddTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const newTransaction = addTransaction(transactionData)
    setTransactions([newTransaction, ...transactions])
  }

  const handleEditTransaction = (transaction: Transaction) => {
    // TODO: Implement edit functionality
    console.log('Edit transaction:', transaction)
    alert('Edit functionality will be implemented in future days')
  }

  const handleDeleteTransaction = (transactionId: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      const updatedTransactions = transactions.filter(t => t.id !== transactionId)
      setTransactions(updatedTransactions)
    }
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