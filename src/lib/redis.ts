import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

export async function getCache<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

export async function setCache(key: string, data: any, expiration: number = 3600): Promise<void> {
  try {
    await redis.setex(key, expiration, JSON.stringify(data))
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch (error) {
    console.error('Redis invalidate error:', error)
  }
}

export default redis