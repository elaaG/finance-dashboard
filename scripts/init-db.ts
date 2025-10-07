import 'dotenv/config';
import { query } from '@/lib/database'
import fs from 'fs'
import path from 'path'

export async function initializeDatabase() {
  try {
    console.log('🔄 Initializing database...')
    
    // Read and execute the SQL schema
    const sqlPath = path.join(process.cwd(), 'scripts', 'init-database.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(statement => statement.trim())
    
    for (const statement of statements) {
      if (statement.trim()) {
        await query(statement)
      }
    }
    
    console.log('✅ Database initialized successfully!')
  } catch (error) {
    console.error('❌ Database initialization failed:', error)
    throw error
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}