import { NextRequest, NextResponse } from 'next/server'
import { 
  getTransactions, 
  createTransaction, 
  getTransactionStats 
} from '@/lib/services/transactionService'
import { auth } from '@/lib/auth' 

export async function GET(request: NextRequest) {
  const session = await auth() 

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as 'income' | 'expense' | undefined
    const category = searchParams.get('category') || undefined
    const startDate = searchParams.get('startDate') || undefined
    const endDate = searchParams.get('endDate') || undefined

    
    const transactions = await getTransactions(session.user.id, {
      type,
      category,
      startDate,
      endDate
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const transactionData = await request.json()
    
    if (!transactionData.amount || !transactionData.description || !transactionData.category || !transactionData.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const transaction = await createTransaction(
      session.user.id,
      { ...transactionData }
    )

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error('Failed to create transaction:', error)
    return NextResponse.json(
      { error: 'Failed to create transaction' },
      { status: 500 }
    )
  }
}
