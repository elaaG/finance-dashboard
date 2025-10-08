import { Transaction, Budget, Investment } from '@/types'

export function exportToCSV(data: any[], filename: string) {
  if (!data.length) return

  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle values that might contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export function generateTransactionReport(transactions: Transaction[]) {
  const income = transactions.filter(t => t.type === 'income')
  const expenses = transactions.filter(t => t.type === 'expense')

  const report = {
    summary: {
      totalIncome: income.reduce((sum, t) => sum + t.amount, 0),
      totalExpenses: expenses.reduce((sum, t) => sum + t.amount, 0),
      netSavings: income.reduce((sum, t) => sum + t.amount, 0) - expenses.reduce((sum, t) => sum + t.amount, 0),
      transactionCount: transactions.length
    },
    byCategory: expenses.reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>),
    topExpenses: expenses
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10)
  }

  return report
}

export function exportFinancialReport(
  transactions: Transaction[], 
  budgets: Budget[], 
  investments: Investment[]
) {
  const report = {
    generatedAt: new Date().toISOString(),
    transactions: generateTransactionReport(transactions),
    budgetSummary: {
      totalBudget: budgets.reduce((sum, b) => sum + b.amount, 0),
      totalSpent: budgets.reduce((sum, b) => sum + b.spent, 0),
      utilization: budgets.reduce((sum, b) => sum + b.spent, 0) / budgets.reduce((sum, b) => sum + b.amount, 0) * 100
    },
    investmentSummary: {
      totalValue: investments.reduce((sum, i) => sum + (i.shares * i.currentPrice), 0),
      totalGain: investments.reduce((sum, i) => sum + (i.shares * (i.currentPrice - i.purchasePrice)), 0)
    }
  }

  return JSON.stringify(report, null, 2)
}