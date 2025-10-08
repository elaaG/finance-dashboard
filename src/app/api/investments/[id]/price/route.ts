import { NextRequest, NextResponse } from 'next/server'
import { getStockPrice } from '@/lib/services/stockService'
import { getInvestment, updateInvestment } from '@/lib/services/investmentService'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const investment = await getInvestment(params.id)
    
    if (!investment) {
      return NextResponse.json(
        { error: 'Investment not found' },
        { status: 404 }
      )
    }

    const currentPrice = await getStockPrice(investment.symbol)
    
    if (!currentPrice) {
      return NextResponse.json(
        { error: 'Could not fetch current price' },
        { status: 500 }
      )
    }

    const updatedInvestment = await updateInvestment(params.id, {
      currentPrice: currentPrice.price
    })

    return NextResponse.json(updatedInvestment)
  } catch (error) {
    console.error('Error updating investment price:', error)
    return NextResponse.json(
      { error: 'Failed to update investment price' },
      { status: 500 }
    )
  }
}