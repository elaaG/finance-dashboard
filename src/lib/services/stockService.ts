import axios from 'axios'

// Free financial APIs (no API key required for basic usage)
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

// Cache to avoid hitting API limits
const priceCache = new Map()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export interface StockPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  lastUpdated: Date
}

export async function getStockPrice(symbol: string): Promise<StockPrice | null> {
  const cacheKey = symbol.toUpperCase()
  const cached = priceCache.get(cacheKey)
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  try {
    // Using Alpha Vantage (free tier)
    const response = await axios.get(ALPHA_VANTAGE_BASE_URL, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
        apikey: process.env.ALPHA_VANTAGE_API_KEY || 'demo' // Use demo key for testing
      }
    })

    const data = response.data['Global Quote']
    
    if (!data || !data['05. price']) {
      console.warn(`No price data found for symbol: ${symbol}`)
      return null
    }

    const stockPrice: StockPrice = {
      symbol: symbol.toUpperCase(),
      price: parseFloat(data['05. price']),
      change: parseFloat(data['09. change']),
      changePercent: parseFloat(data['10. change percent'].replace('%', '')),
      lastUpdated: new Date()
    }

    // Cache the result
    priceCache.set(cacheKey, {
      data: stockPrice,
      timestamp: Date.now()
    })

    return stockPrice
  } catch (error) {
    console.error(`Error fetching stock price for ${symbol}:`, error)
    
    // Fallback: Return a simulated price for demo purposes
    return getSimulatedPrice(symbol)
  }
}

// Fallback function for demo purposes
function getSimulatedPrice(symbol: string): StockPrice {
  const basePrice = getBasePrice(symbol)
  const changePercent = (Math.random() - 0.5) * 4 // Random change between -2% and +2%
  const change = basePrice * (changePercent / 100)
  const price = basePrice + change

  return {
    symbol: symbol.toUpperCase(),
    price: parseFloat(price.toFixed(2)),
    change: parseFloat(change.toFixed(2)),
    changePercent: parseFloat(changePercent.toFixed(2)),
    lastUpdated: new Date()
  }
}

function getBasePrice(symbol: string): number {
  const basePrices: { [key: string]: number } = {
    'AAPL': 185,
    'MSFT': 420,
    'GOOGL': 150,
    'AMZN': 180,
    'TSLA': 250,
    'META': 480,
    'NVDA': 900,
    'BTC': 52000,
    'ETH': 2800,
    'VOO': 470,
    'SPY': 520
  }
  
  return basePrices[symbol.toUpperCase()] || 100
}

export async function updateInvestmentPrices(): Promise<void> {
  try {
    const { getInvestments, updateInvestment } = await import('./investmentService')
    const investments = await getInvestments()
    
    const updatePromises = investments.map(async (investment) => {
      const currentPrice = await getStockPrice(investment.symbol)
      
      if (currentPrice && currentPrice.price !== investment.currentPrice) {
        await updateInvestment(investment.id, {
          currentPrice: currentPrice.price
        })
        
        console.log(`Updated ${investment.symbol} price to $${currentPrice.price}`)
      }
    })

    await Promise.all(updatePromises)
  } catch (error) {
    console.error('Error updating investment prices:', error)
  }
}