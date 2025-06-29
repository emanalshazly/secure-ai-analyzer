import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 })
    }

    // Fetch recent analyses
    const analyses = await prisma.securityAnalysis.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        systemDescription: true,
        analysisType: true,
        createdAt: true
      }
    })

    // Fetch current month usage
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const currentUsage = await prisma.securityAnalysis.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: startOfMonth
        }
      }
    })

    return NextResponse.json({
      analyses,
      currentUsage
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}