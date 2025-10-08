import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    // For now, just return success
    // We'll add actual user creation later
    return NextResponse.json({ 
      success: true,
      message: 'User created successfully (demo mode)'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    )
  }
}