import { NextRequest, NextResponse } from 'next/server'
import { getBudgets, createBudget, getBudgetSummary } from '@/lib/services/budgetService'

export async function GET() {
  try {
    const budgets = await getBudgets()
    return NextResponse.json(budgets)
  } catch (error) {
    console.error('Failed to fetch budgets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch budgets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const budgetData = await request.json()
    
    if (!budgetData.category || !budgetData.amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const budget = await createBudget(budgetData)
    return NextResponse.json(budget, { status: 201 })
  } catch (error) {
    console.error('Failed to create budget:', error)
    return NextResponse.json(
      { error: 'Failed to create budget' },
      { status: 500 }
    )
  }
}