'use client'

import { useState, useEffect } from 'react'
import { Bell, Check, Trash2 } from 'lucide-react'
import { notificationManager, Notification } from '@/lib/services/notificationService'

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    // Load initial notifications
    setNotifications(notificationManager.getNotifications())
    setUnreadCount(notificationManager.getUnreadCount())

    // Subscribe to notification updates
    const handleNotificationsUpdate = (updatedNotifications: Notification[]) => {
      setNotifications(updatedNotifications)
      setUnreadCount(notificationManager.getUnreadCount())
    }

    notificationManager.addListener(handleNotificationsUpdate)

    return () => {
      notificationManager.removeListener(handleNotificationsUpdate)
    }
  }, [])

  const markAsRead = (notificationId: string) => {
    notificationManager.markAsRead(notificationId)
  }

  const markAllAsRead = () => {
    notificationManager.markAllAsRead()
  }

  const clearAll = () => {
    // This would typically call an API to clear notifications
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notification.severity === 'error'
                              ? 'bg-red-500'
                              : notification.severity === 'warning'
                              ? 'bg-yellow-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <h4 className="font-medium text-gray-900 text-sm">
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.createdAt.toLocaleDateString()} at{' '}
                        {notification.createdAt.toLocaleTimeString()}
                      </p>
                    </div>
                    
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700"
                      onClick={() => setIsOpen(false)}
                    >
                      View details →
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Close when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}