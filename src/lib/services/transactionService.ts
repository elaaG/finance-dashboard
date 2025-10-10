import { query } from '@/lib/database'
import { Transaction } from '@/types'

/**
 * Get all transactions for a user, with optional filters.
 */
export async function getTransactions(
  userId: string,
  filters?: { 
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  }
): Promise<Transaction[]> {
  let sql = `
    SELECT 
      id, 
      amount, 
      description, 
      category, 
      type, 
      date,
      created_at as "createdAt"
    FROM transactions 
    WHERE user_id = $1
  `

  const params: any[] = [userId]
  let paramCount = 1

  if (filters?.type) {
    paramCount++
    sql += ` AND type = $${paramCount}`
    params.push(filters.type)
  }

  if (filters?.category) {
    paramCount++
    sql += ` AND category = $${paramCount}`
    params.push(filters.category)
  }

  if (filters?.startDate) {
    paramCount++
    sql += ` AND date >= $${paramCount}`
    params.push(filters.startDate)
  }

  if (filters?.endDate) {
    paramCount++
    sql += ` AND date <= $${paramCount}`
    params.push(filters.endDate)
  }

  sql += ' ORDER BY date DESC, created_at DESC'

  const result = await query(sql, params)
  return result.rows
}

/**
 * Create a new transaction for a specific user.
 */
export async function createTransaction(
  userId: string,
  transaction: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const sql = `
    INSERT INTO transactions (user_id, amount, description, category, type, date)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, amount, description, category, type, date, created_at as "createdAt"
  `
  const params = [
    userId,
    transaction.amount,
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.date
  ]

  const result = await query(sql, params)
  return result.rows[0]
}

/**
 * Update a user's transaction.
 */
export async function updateTransaction(
  userId: string,
  id: string,
  transaction: Partial<Transaction>
): Promise<Transaction> {
  const updates: string[] = []
  const params: any[] = []
  let paramCount = 0

  if (transaction.amount !== undefined) {
    paramCount++
    updates.push(`amount = $${paramCount}`)
    params.push(transaction.amount)
  }

  if (transaction.description !== undefined) {
    paramCount++
    updates.push(`description = $${paramCount}`)
    params.push(transaction.description)
  }

  if (transaction.category !== undefined) {
    paramCount++
    updates.push(`category = $${paramCount}`)
    params.push(transaction.category)
  }

  if (transaction.type !== undefined) {
    paramCount++
    updates.push(`type = $${paramCount}`)
    params.push(transaction.type)
  }

  if (transaction.date !== undefined) {
    paramCount++
    updates.push(`date = $${paramCount}`)
    params.push(transaction.date)
  }

  if (updates.length === 0) {
    throw new Error('No fields to update')
  }

  // Always update timestamp
  updates.push(`updated_at = CURRENT_TIMESTAMP`)

  paramCount++
  params.push(id)
  paramCount++
  params.push(userId)

  const sql = `
    UPDATE transactions 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount - 1} AND user_id = $${paramCount}
    RETURNING id, amount, description, category, type, date, created_at as "createdAt"
  `

  const result = await query(sql, params)
  return result.rows[0]
}

/**
 * Delete a transaction (only if it belongs to the user).
 */
export async function deleteTransaction(userId: string, id: string): Promise<void> {
  const sql = 'DELETE FROM transactions WHERE id = $1 AND user_id = $2'
  await query(sql, [id, userId])
}

/**
 * Get monthly statistics for a user's transactions.
 */
export async function getTransactionStats(userId: string) {
  const sql = `
    SELECT 
      type,
      COUNT(*) as count,
      SUM(amount) as total,
      AVG(amount) as average
    FROM transactions 
    WHERE user_id = $1
      AND date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY type
  `
  const result = await query(sql, [userId])
  return result.rows
}
