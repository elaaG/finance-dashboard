import { getTransactions } from "./services/transactionService"

export function withPerformance<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  name: string
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    const start = performance.now()
    
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(`⏱️ Slow operation: ${name} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`❌ Operation failed: ${name} failed after ${duration.toFixed(2)}ms`, error)
      throw error
    }
  }
}

// Usage example in services
export const getTransactionsWithPerf = withPerformance(getTransactions, 'getTransactions')