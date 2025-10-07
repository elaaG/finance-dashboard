import { NextRequest, NextResponse } from 'next/server'
import { getInvestments, createInvestment, getPortfolioSummary } from '@/lib/services/investmentService'

export async function GET() {
  try {
    const investments = await getInvestments()
    return NextResponse.json(investments)
  } catch (error) {
    console.error('Failed to fetch investments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch investments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const investmentData = await request.json()
    
    // Validate required fields
    const requiredFields = ['symbol', 'name', 'shares', 'purchasePrice', 'purchaseDate', 'type']
    const missingFields = requiredFields.filter(field => !investmentData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Set current price to purchase price initially
    const investmentWithCurrentPrice = {
      ...investmentData,
      currentPrice: investmentData.purchasePrice
    }

    const investment = await createInvestment(investmentWithCurrentPrice)
    return NextResponse.json(investment, { status: 201 })
  } catch (error) {
    console.error('Failed to create investment:', error)
    return NextResponse.json(
      { error: 'Failed to create investment' },
      { status: 500 }
    )
  }
}