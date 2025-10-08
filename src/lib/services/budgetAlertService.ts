import { Budget, Transaction } from '@/types'
import { notificationManager } from './notificationService'

export class BudgetAlertService {
  private lastChecked: Date | null = null

  checkForAlerts(budgets: Budget[], transactions: Transaction[]) {
    const now = new Date()
    
    // Only check once per hour to avoid spam
    if (this.lastChecked && now.getTime() - this.lastChecked.getTime() < 60 * 60 * 1000) {
      return
    }

    this.lastChecked = now

    // Check budget utilization
    budgets.forEach(budget => {
      const utilization = (budget.spent / budget.amount) * 100
      
      if (utilization >= 100) {
        notificationManager.addNotification({
          type: 'budget_alert',
          title: 'Budget Exceeded!',
          message: `You've exceeded your ${budget.category} budget by $${(budget.spent - budget.amount).toFixed(2)}`,
          severity: 'error',
          actionUrl: '/budgets'
        })
      } else if (utilization >= 90) {
        notificationManager.addNotification({
          type: 'budget_alert',
          title: 'Budget Warning',
          message: `You're close to your ${budget.category} budget limit (${utilization.toFixed(1)}% used)`,
          severity: 'warning',
          actionUrl: '/budgets'
        })
      }
    })

    // Check for unusual spending patterns
    this.checkSpendingPatterns(transactions)
  }

  private checkSpendingPatterns(transactions: Transaction[]) {
    const today = new Date()
    const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const recentTransactions = transactions.filter(
      t => new Date(t.date) >= oneWeekAgo && t.type === 'expense'
    )

    const dailySpending = recentTransactions.reduce((acc, transaction) => {
      const date = transaction.date
      acc[date] = (acc[date] || 0) + transaction.amount
      return acc
    }, {} as Record<string, number>)

    const averageDailySpend = Object.values(dailySpending).reduce((sum, amount) => sum + amount, 0) / Object.keys(dailySpending).length

    // Alert if today's spending is 50% higher than average
    const todaySpend = dailySpending[today.toISOString().split('T')[0]] || 0
    if (todaySpend > averageDailySpend * 1.5 && todaySpend > 0) {
      notificationManager.addNotification({
        type: 'system',
        title: 'High Spending Today',
        message: `You've spent $${todaySpend.toFixed(2)} today, which is higher than your recent average.`,
        severity: 'warning',
        actionUrl: '/transactions'
      })
    }
  }
}

export const budgetAlertService = new BudgetAlertService()