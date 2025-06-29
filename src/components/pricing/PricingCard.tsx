'use client'

import { Check } from 'lucide-react'
import { PRICING_PLANS } from '@/lib/stripe/config'

interface PricingCardProps {
  plan: keyof typeof PRICING_PLANS
  isCurrentPlan?: boolean
  onSelectPlan: (plan: keyof typeof PRICING_PLANS) => void
}

export default function PricingCard({ plan, isCurrentPlan, onSelectPlan }: PricingCardProps) {
  const planData = PRICING_PLANS[plan]
  const isPopular = plan === 'pro'

  return (
    <div className={`relative bg-white rounded-lg shadow-lg p-6 ${isPopular ? 'ring-2 ring-blue-500' : ''}`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{planData.name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">${planData.price}</span>
          {planData.price > 0 && <span className="text-gray-600">/month</span>}
        </div>
        <p className="text-gray-600 mb-6">
          {planData.analyses_per_month === -1 
            ? 'Unlimited analyses' 
            : `${planData.analyses_per_month} analyses per month`
          }
        </p>
      </div>

      <ul className="space-y-3 mb-6">
        {planData.features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onSelectPlan(plan)}
        disabled={isCurrentPlan}
        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
          isCurrentPlan
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : isPopular
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {isCurrentPlan ? 'Current Plan' : `Choose ${planData.name}`}
      </button>
    </div>
  )
}