'use client'

import { lazy, Suspense } from 'react'
import LoadingSpinner from './LoadingSpinner'

// Lazy load heavy components
const SpendingChart = lazy(() => import('./SpendingChart'))
const PortfolioPerformanceChart = lazy(() => import('./PortfolioPerformanceChart'))
const AdvancedSpendingChart = lazy(() => import('./AdvancedSpendingChart'))

export default function LazyDashboard() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<LoadingSpinner />}>
        <SpendingChart transactions={[]} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <PortfolioPerformanceChart investments={[]} />
      </Suspense>
      
      <Suspense fallback={<LoadingSpinner />}>
        <AdvancedSpendingChart transactions={[]} />
      </Suspense>
    </div>
  )
}