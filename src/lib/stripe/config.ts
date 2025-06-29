import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    analyses_per_month: 5,
    features: ['Basic security analysis', 'Risk categorization', 'Email support']
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: 'price_pro_monthly', // Replace with actual Stripe price ID
    analyses_per_month: 100,
    features: ['Advanced security analysis', 'Detailed recommendations', 'Priority support', 'Analysis history', 'Export reports']
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    priceId: 'price_enterprise_monthly', // Replace with actual Stripe price ID
    analyses_per_month: -1, // Unlimited
    features: ['Unlimited analyses', 'Custom integrations', 'Dedicated support', 'Team collaboration', 'Advanced reporting']
  }
}