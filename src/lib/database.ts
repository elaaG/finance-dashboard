import { Pool } from 'pg'

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect()
    console.log('✅ Database connected successfully')
    client.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Generic query function
export async function query(text: string, params?: any[]) {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('✅ Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('❌ Query error', { text, error })
    throw error
  }
}

// Get a client for transactions
export async function getClient() {
  const client = await pool.connect()
  const query = client.query
  const release = client.release

  // Set a timeout of 5 seconds
  const timeout = setTimeout(() => {
    console.error('❌ A client has been checked out for more than 5 seconds!')
  }, 5000)

  // Monkey patch the query method to track the last query executed
  const originalQuery = client.query.bind(client);

client.query = (queryConfig: any, values?: any) => {
  console.log('Executing query:', typeof queryConfig === 'string' ? queryConfig : queryConfig.text); // optional tracking
  return originalQuery(queryConfig, values);
}


  client.release = () => {
    clearTimeout(timeout)
    client.release = release
    return release.apply(client)
  }

  return client
}

export default pool