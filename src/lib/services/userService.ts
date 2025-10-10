import { query } from '@/lib/database'
import bcrypt from 'bcryptjs'

export interface User {
  id: string
  email: string
  name: string | null
  email_verified: Date | null
  created_at: Date
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const passwordHash = await bcrypt.hash(password, 12)
  
  const result = await query(
    `INSERT INTO users (email, name, password_hash) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, name, email_verified, created_at`,
    [email, name, passwordHash]
  )
  
  return result.rows[0]
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, name, email_verified, created_at FROM users WHERE email = $1',
    [email]
  )
  
  return result.rows[0] || null
}

export async function verifyPassword(email: string, password: string): Promise<User | null> {
  const result = await query(
    'SELECT id, email, name, password_hash, email_verified, created_at FROM users WHERE email = $1',
    [email]
  )
  
  const user = result.rows[0]
  if (!user) return null
  
  const isValid = await bcrypt.compare(password, user.password_hash)
  return isValid ? user : null
}

export async function updateUser(userId: string, updates: { name?: string; email?: string }): Promise<User> {
  const fields = []
  const values = []
  let paramCount = 0
  
  if (updates.name !== undefined) {
    paramCount++
    fields.push(`name = $${paramCount}`)
    values.push(updates.name)
  }
  
  if (updates.email !== undefined) {
    paramCount++
    fields.push(`email = $${paramCount}`)
    values.push(updates.email)
  }
  
  if (fields.length === 0) {
    throw new Error('No fields to update')
  }
  
  paramCount++
  fields.push(`updated_at = CURRENT_TIMESTAMP`)
  values.push(userId)
  
  const result = await query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} 
     RETURNING id, email, name, email_verified, created_at`,
    values
  )
  
  return result.rows[0]
}