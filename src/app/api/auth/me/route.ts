import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserFromToken } from '@/lib/auth'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const user = await getUserFromToken(token)
    return NextResponse.json({ user })
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ user: null })
  }
}