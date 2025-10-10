import { Pool } from 'pg'
import { withPerformance } from './performance'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Enhanced query function with performance monitoring
export const query = withPerformance(
  async (text: string, params?: any[]) => {
    const start = Date.now()
    try {
      const res = await pool.query(text, params)
      const duration = Date.now() - start
      
      // Log slow queries
      if (duration > 100) {
        console.warn(`🐌 Slow query (${duration}ms):`, text.substring(0, 100))
      }
      
      return res
    } catch (error) {
      console.error('❌ Query error:', { text, error })
      throw error
    }
  },
  'databaseQuery'
)