import { query } from '@/lib/database'
import { Budget } from '@/types'

export async function getBudgets(): Promise<Budget[]> {
  const sql = `
    SELECT 
      b.id,
      b.category,
      b.amount,
      COALESCE(SUM(t.amount), 0) as spent
    FROM budgets b
    LEFT JOIN transactions t ON 
      t.category = b.category AND 
      t.type = 'expense' AND
      t.date >= DATE_TRUNC('month', CURRENT_DATE) AND
      t.date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY b.id, b.category, b.amount
    ORDER BY b.category
  `
  
  const result = await query(sql)
  return result.rows
}

export async function createBudget(budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget> {
  const sql = `
    INSERT INTO budgets (category, amount)
    VALUES ($1, $2)
    RETURNING id, category, amount
  `
  const params = [budget.category, budget.amount]

  const result = await query(sql, params)
  
  // Return with spent = 0 for new budget
  return {
    ...result.rows[0],
    spent: 0
  }
}

export async function updateBudget(id: string, budget: Partial<Budget>): Promise<Budget> {
  const updates: string[] = []
  const params: any[] = []
  let paramCount = 0

  if (budget.category !== undefined) {
    paramCount++
    updates.push(`category = $${paramCount}`)
    params.push(budget.category)
  }

  if (budget.amount !== undefined) {
    paramCount++
    updates.push(`amount = $${paramCount}`)
    params.push(budget.amount)
  }

  if (updates.length === 0) {
    throw new Error('No fields to update')
  }

  paramCount++
  updates.push(`updated_at = CURRENT_TIMESTAMP`)
  
  paramCount++
  params.push(id)

  const sql = `
    UPDATE budgets 
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING id, category, amount
  `

  const result = await query(sql, params)
  
  // Get the spent amount for this budget
  const spentSql = `
    SELECT COALESCE(SUM(amount), 0) as spent
    FROM transactions 
    WHERE category = $1 AND 
          type = 'expense' AND
          date >= DATE_TRUNC('month', CURRENT_DATE) AND
          date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
  `
  const spentResult = await query(spentSql, [result.rows[0].category])
  
  return {
    ...result.rows[0],
    spent: parseFloat(spentResult.rows[0].spent)
  }
}

export async function deleteBudget(id: string): Promise<void> {
  const sql = 'DELETE FROM budgets WHERE id = $1'
  await query(sql, [id])
}

export async function getBudgetSummary() {
  const sql = `
    SELECT 
      COUNT(*) as total_budgets,
      SUM(amount) as total_budget_amount,
      SUM(
        COALESCE((
          SELECT SUM(amount) 
          FROM transactions t 
          WHERE t.category = b.category AND 
                t.type = 'expense' AND
                t.date >= DATE_TRUNC('month', CURRENT_DATE) AND
                t.date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
        ), 0)
      ) as total_spent
    FROM budgets b
  `
  
  const result = await query(sql)
  return result.rows[0]
}