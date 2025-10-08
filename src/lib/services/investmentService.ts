import { query } from '@/lib/database'
import { Investment, PortfolioSummary } from '@/types'

//  Get all investments
export async function getInvestments(): Promise<Investment[]> {
  const sql = `
    SELECT 
      id,
      symbol,
      name,
      shares,
      purchase_price AS "purchasePrice",
      current_price AS "currentPrice",
      purchase_date AS "purchaseDate",
      type,
      created_at AS "createdAt"
    FROM investments 
    ORDER BY created_at DESC
  `
  const result = await query(sql)
  return result.rows
}

//  Get one investment by ID
export async function getInvestment(id: string): Promise<Investment | null> {
  const sql = `
    SELECT 
      id,
      symbol,
      name,
      shares,
      purchase_price AS "purchasePrice",
      current_price AS "currentPrice",
      purchase_date AS "purchaseDate",
      type,
      created_at AS "createdAt"
    FROM investments 
    WHERE id = $1
  `
  const result = await query(sql, [id])
  return result.rows[0] || null
}

// Create a new investment
export async function createInvestment(investment: Omit<Investment, 'id'>): Promise<Investment> {
  const sql = `
    INSERT INTO investments (symbol, name, shares, purchase_price, current_price, purchase_date, type)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING 
      id,
      symbol,
      name,
      shares,
      purchase_price AS "purchasePrice",
      current_price AS "currentPrice",
      purchase_date AS "purchaseDate",
      type,
      created_at AS "createdAt"
  `
  const params = [
    investment.symbol,
    investment.name,
    investment.shares,
    investment.purchasePrice,
    investment.currentPrice,
    investment.purchaseDate,
    investment.type
  ]

  const result = await query(sql, params)
  return result.rows[0]
}

//  Update specific fields of an investment
export async function updateInvestment(id: string, investment: Partial<Investment>): Promise<Investment> {
  const updates: string[] = []
  const params: any[] = []
  let paramCount = 0

  if (investment.symbol !== undefined) {
    paramCount++
    updates.push(`symbol = $${paramCount}`)
    params.push(investment.symbol)
  }
  if (investment.name !== undefined) {
    paramCount++
    updates.push(`name = $${paramCount}`)
    params.push(investment.name)
  }
  if (investment.shares !== undefined) {
    paramCount++
    updates.push(`shares = $${paramCount}`)
    params.push(investment.shares)
  }
  if (investment.purchasePrice !== undefined) {
    paramCount++
    updates.push(`purchase_price = $${paramCount}`)
    params.push(investment.purchasePrice)
  }
  if (investment.currentPrice !== undefined) {
    paramCount++
    updates.push(`current_price = $${paramCount}`)
    params.push(investment.currentPrice)
  }
  if (investment.purchaseDate !== undefined) {
    paramCount++
    updates.push(`purchase_date = $${paramCount}`)
    params.push(investment.purchaseDate)
  }
  if (investment.type !== undefined) {
    paramCount++
    updates.push(`type = $${paramCount}`)
    params.push(investment.type)
  }

  if (updates.length === 0) {
    throw new Error('No fields to update')
  }

  // Always update timestamp
  updates.push(`updated_at = CURRENT_TIMESTAMP`)

  paramCount++
  params.push(id)

  const sql = `
    UPDATE investments 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING 
      id,
      symbol,
      name,
      shares,
      purchase_price AS "purchasePrice",
      current_price AS "currentPrice",
      purchase_date AS "purchaseDate",
      type,
      created_at AS "createdAt"
  `

  const result = await query(sql, params)
  return result.rows[0]
}

// Delete an investment
export async function deleteInvestment(id: string): Promise<void> {
  const sql = 'DELETE FROM investments WHERE id = $1'
  await query(sql, [id])
}

//  Get portfolio summary
export async function getPortfolioSummary(): Promise<PortfolioSummary> {
  const sql = `
    SELECT 
      SUM(shares * current_price) AS total_value,
      SUM(shares * purchase_price) AS total_cost,
      SUM(shares * (current_price - purchase_price)) AS total_gain
    FROM investments
  `
  const result = await query(sql)
  const row = result.rows[0]

  const totalValue = parseFloat(row.total_value) || 0
  const totalCost = parseFloat(row.total_cost) || 0
  const totalGain = parseFloat(row.total_gain) || 0
  const gainPercentage = totalCost > 0 ? (totalGain / totalCost) * 100 : 0
  const dailyChange = totalGain * 0.01 // Simulated daily change

  return {
    totalValue,
    totalCost,
    totalGain,
    gainPercentage,
    dailyChange
  }
}
