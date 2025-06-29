'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import PricingCard from '@/components/pricing/PricingCard'
import { PRICING_PLANS } from '@/lib/stripe/config'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PricingPage() {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelectPlan = async (plan: keyof typeof PRICING_PLANS) => {
    if (!user) {
      window.location.href = '/auth'
      return
    }

    if (plan === 'free') {
      // Handle downgrade to free plan
      return
    }

    setLoading(plan)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: PRICING_PLANS[plan].priceId,
          userId: user.id,
        }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error creating checkout session:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your security analysis needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {(Object.keys(PRICING_PLANS) as Array<keyof typeof PRICING_PLANS>).map((plan) => (
            <PricingCard
              key={plan}
              plan={plan}
              isCurrentPlan={profile?.subscription_tier === plan}
              onSelectPlan={handleSelectPlan}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            All plans include our core security analysis features with 24/7 support
          </p>
        </div>
      </div>
    </div>
  )
}