'use client'

import { BarChart3, TrendingUp } from 'lucide-react'

interface UsageChartProps {
  currentUsage: number
  limit: number
  planName: string
}

export default function UsageChart({ currentUsage, limit, planName }: UsageChartProps) {
  const percentage = limit === -1 ? 0 : (currentUsage / limit) * 100
  const isUnlimited = limit === -1

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Usage This Month</h3>
        <BarChart3 className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Security Analyses</span>
            <span>
              {currentUsage} {!isUnlimited && `/ ${limit}`}
            </span>
          </div>
          {!isUnlimited && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  percentage > 80 ? 'bg-red-500' : percentage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm font-medium text-gray-900 capitalize">{planName} Plan</p>
            <p className="text-xs text-gray-500">
              {isUnlimited ? 'Unlimited usage' : `${limit - currentUsage} analyses remaining`}
            </p>
          </div>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
      </div>
    </div>
  )
}