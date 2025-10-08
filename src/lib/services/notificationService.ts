import { Budget, Transaction } from '@/types'

export interface Notification {
  id: string
  type: 'budget_alert' | 'price_alert' | 'system'
  title: string
  message: string
  severity: 'info' | 'warning' | 'error'
  read: boolean
  createdAt: Date
  actionUrl?: string
}

export class NotificationManager {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  addNotification(notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date()
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()
    
    // Show browser notification if available
    this.showBrowserNotification(newNotification)
  }

  checkBudgetAlerts(budgets: Budget[], recentTransactions: Transaction[]) {
    budgets.forEach(budget => {
      const utilization = (budget.spent / budget.amount) * 100
      
      if (utilization >= 100) {
        this.addNotification({
          type: 'budget_alert',
          title: 'Budget Exceeded',
          message: `You've exceeded your ${budget.category} budget by $${(budget.spent - budget.amount).toFixed(2)}`,
          severity: 'error',
          actionUrl: '/budgets'
        })
      } else if (utilization >= 90) {
        this.addNotification({
          type: 'budget_alert',
          title: 'Budget Warning',
          message: `You're close to your ${budget.category} budget limit (${utilization.toFixed(1)}% used)`,
          severity: 'warning',
          actionUrl: '/budgets'
        })
      }
    })
  }

  checkLargeTransactions(transactions: Transaction[]) {
    const largeTransactions = transactions.filter(
      t => t.type === 'expense' && t.amount > 500
    )

    largeTransactions.forEach(transaction => {
      this.addNotification({
        type: 'system',
        title: 'Large Transaction',
        message: `Large expense recorded: $${transaction.amount} for ${transaction.description}`,
        severity: 'info',
        actionUrl: '/transactions'
      })
    })
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  markAllAsRead() {
    this.notifications.forEach(notification => {
      notification.read = true
    })
    this.notifyListeners()
  }

  getNotifications(): Notification[] {
    return this.notifications
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length
  }

  addListener(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
  }

  removeListener(listener: (notifications: Notification[]) => void) {
    this.listeners = this.listeners.filter(l => l !== listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener([...this.notifications]))
  }

  private showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      })
    }
  }
}

// Request browser notification permission
export async function requestNotificationPermission() {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }
  return false
}

export const notificationManager = new NotificationManager()