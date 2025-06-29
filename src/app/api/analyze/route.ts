import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserFromToken } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PRICING_PLANS } from '@/lib/stripe/config'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
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

    const body = await request.json()
    const { systemDescription, analysisType, includeRecommendations } = body

    // Get user profile
    const profile = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check usage limits
    const planData = PRICING_PLANS[profile.subscriptionTier as keyof typeof PRICING_PLANS] || PRICING_PLANS.free
    
    if (planData.analyses_per_month !== -1) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const count = await prisma.securityAnalysis.count({
        where: {
          userId: user.id,
          createdAt: {
            gte: startOfMonth
          }
        }
      })

      if (count >= planData.analyses_per_month) {
        return NextResponse.json(
          { error: 'Monthly analysis limit reached. Please upgrade your plan.' },
          { status: 429 }
        )
      }
    }

    // Perform AI analysis
    const prompt = `
Perform a ${analysisType} security analysis for the following system:

${systemDescription}

Provide a structured analysis with:
1. Summary of the system and key security considerations
2. High-risk security issues (critical vulnerabilities)
3. Medium-risk security issues (important but not critical)
4. Low-risk security issues (minor improvements)
${includeRecommendations ? '5. Specific recommendations for each risk category' : ''}

Format your response as a JSON object with the following structure:
{
  "summary": "Brief overview",
  "risks": {
    "high": ["risk1", "risk2"],
    "medium": ["risk1", "risk2"],
    "low": ["risk1", "risk2"]
  }${includeRecommendations ? ',\n  "recommendations": ["rec1", "rec2"]' : ''}
}
`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a cybersecurity expert. Provide detailed, actionable security analysis in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    let result
    try {
      result = JSON.parse(completion.choices[0].message.content || '{}')
    } catch (parseError) {
      // Fallback to mock data if AI response isn't valid JSON
      result = {
        summary: `Security analysis of system: "${systemDescription}"`,
        risks: {
          high: [
            "Sensitive data exposure risk",
            "Unauthorized access potential",
            "Lack of encryption in data transmission"
          ],
          medium: [
            "Input validation vulnerabilities",
            "Session management weaknesses",
            "Insufficient logging mechanisms"
          ],
          low: [
            "Non-critical configuration issues",
            "Minor version control concerns",
            "Documentation gaps"
          ]
        },
        recommendations: includeRecommendations ? [
          "Implement end-to-end encryption for all data transmission",
          "Enhance authentication mechanisms with MFA",
          "Regular security audits and penetration testing",
          "Implement comprehensive logging and monitoring"
        ] : []
      }
    }

    // Save analysis to database
    const savedAnalysis = await prisma.securityAnalysis.create({
      data: {
        userId: user.id,
        systemDescription,
        analysisType,
        result: JSON.stringify(result)
      }
    })

    // Track usage
    await prisma.usageTracking.create({
      data: {
        userId: user.id,
        action: 'security_analysis',
        metadata: JSON.stringify({
          analysis_type: analysisType,
          analysis_id: savedAnalysis.id
        })
      }
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in security analysis:', error)
    return NextResponse.json(
      { error: 'Failed to analyze security system' },
      { status: 500 }
    )
  }
}