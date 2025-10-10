import { getStockPrice } from './stockService'
import { getCache, setCache } from '@/lib/redis'

const CACHE_DURATION = 300 // 5 minutes

export async function getCachedStockPrice(symbol: string) {
  const cacheKey = `stock:${symbol.toUpperCase()}`
  
  // Try to get from cache first
  const cached = await getCache(cacheKey)
  if (cached) {
    return cached
  }
  
  // Fetch from API
  const price = await getStockPrice(symbol)
  if (price) {
    // Cache the result
    await setCache(cacheKey, price, CACHE_DURATION)
  }
  
  return price
}

export async function getCachedPortfolioSummary(userId: string) {
  const cacheKey = `portfolio:${userId}`
  
  const cached = await getCache(cacheKey)
  if (cached) {
    return cached
  }
  
  const { getPortfolioSummary } = await import('./investmentService')
  const summary = await getPortfolioSummary()
  
  await setCache(cacheKey, summary, 60) // 1 minute cache
  
  return summary
}