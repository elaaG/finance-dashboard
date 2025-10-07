import { query } from '@/lib/database'
import { Transaction } from '@/types'

export async function getTransactions(
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
    WHERE 1=1
  `
  const params: any[] = []
  let paramCount = 0

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

export async function createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
  const sql = `
    INSERT INTO transactions (amount, description, category, type, date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, amount, description, category, type, date, created_at as "createdAt"
  `
  const params = [
    transaction.amount,
    transaction.description,
    transaction.category,
    transaction.type,
    transaction.date
  ]

  const result = await query(sql, params)
  return result.rows[0]
}

export async function updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
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

  paramCount++
  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  
  paramCount++
  params.push(id)

  const sql = `
    UPDATE transactions 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, amount, description, category, type, date, created_at as "createdAt"
  `

  const result = await query(sql, params)
  return result.rows[0]
}

export async function deleteTransaction(id: string): Promise<void> {
  const sql = 'DELETE FROM transactions WHERE id = $1'
  await query(sql, [id])
}

export async function getTransactionStats() {
  const sql = `
    SELECT 
      type,
      COUNT(*) as count,
      SUM(amount) as total,
      AVG(amount) as average
    FROM transactions 
    WHERE date >= DATE_TRUNC('month', CURRENT_DATE)
    GROUP BY type
  `
  const result = await query(sql)
  return result.rows
}