import { Transaction, Budget, Stats } from '@/types'

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 1200,
    description: 'Monthly Salary',
    category: 'Income',
    type: 'income',
    date: '2025-01-15'
  },
  {
    id: '2',
    amount: 65.50,
    description: 'Groceries',
    category: 'Food',
    type: 'expense',
    date: '2025-01-14'
  },
  {
    id: '3',
    amount: 45.00,
    description: 'Gas Station',
    category: 'Transportation',
    type: 'expense',
    date: '2025-01-13'
  },
  {
    id: '4',
    amount: 29.99,
    description: 'Netflix Subscription',
    category: 'Entertainment',
    type: 'expense',
    date: '2025-01-12'
  },
  {
    id: '5',
    amount: 120.00,
    description: 'Restaurant Dinner',
    category: 'Food',
    type: 'expense',
    date: '2025-01-11'
  }
]

export const sampleBudgets: Budget[] = [
  { id: '1', category: 'Food', amount: 400, spent: 185.50 },
  { id: '2', category: 'Transportation', amount: 200, spent: 45.00 },
  { id: '3', category: 'Entertainment', amount: 150, spent: 29.99 },
  { id: '4', category: 'Shopping', amount: 300, spent: 0 }
]

export const sampleStats: Stats = {
  totalBalance: 879.51,
  totalIncome: 1200,
  totalExpenses: 320.49
}

export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const newTransaction: Transaction = {
    ...transaction,
    id: Math.random().toString(36).substr(2, 9) 
  }
  
  sampleTransactions.unshift(newTransaction)
  return newTransaction
}