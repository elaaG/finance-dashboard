import cron from 'node-cron'
import { updateInvestmentPrices } from './stockService'

export class PriceScheduler {
  private isRunning = false

  start() {
    if (this.isRunning) return

    console.log('🔄 Starting price update scheduler...')
    this.isRunning = true

    // Update prices every 5 minutes during market hours (9 AM - 4 PM, Monday-Friday)
    cron.schedule('*/5 9-16 * * 1-5', async () => {
      console.log('🔄 Scheduled price update running...')
      await updateInvestmentPrices()
    })

    // Update once at startup
    setTimeout(() => {
      updateInvestmentPrices()
    }, 5000)
  }

  stop() {
    this.isRunning = false
    console.log('⏹️ Price update scheduler stopped')
  }
}

export const priceScheduler = new PriceScheduler()