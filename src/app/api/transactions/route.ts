import { NextRequest, NextResponse } from 'next/server'
import { getTransactions } from '@/lib/services/transactionService'
import { getCache, setCache } from '@/lib/redis'
import { auth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = ((): "income" | "expense" | undefined => {
      const value = searchParams.get('type');
      return value === "income" || value === "expense" ? value : undefined;
    })();
    const category = searchParams.get('category')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Create cache key based on request parameters
    const cacheKey = `transactions:${session.user.id}:${type}:${category}:${startDate}:${endDate}`
    
    // Try cache first
    const cached = await getCache(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }
    
    // Ensure session.user.id is a string
if (!session.user.id) {
  return NextResponse.json({ error: "User ID is missing" }, { status: 400 });
}

// Ensure other parameters are either string or undefined
const transactions = await getTransactions(session.user.id, {
  type: type ?? undefined, 
  category: category ?? undefined, 
  startDate: startDate ?? undefined, 
  endDate: endDate ?? undefined, 
});


return NextResponse.json(transactions);
    // Cache for 1 minute
    await setCache(cacheKey, transactions, 60)
    
    return NextResponse.json(transactions)
  } catch (error) {
    console.error('Failed to fetch transactions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}