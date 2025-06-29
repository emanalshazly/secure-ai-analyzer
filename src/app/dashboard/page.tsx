'use client'

import { useAuth } from '@/components/auth/AuthProvider'
import { useEffect, useState } from 'react'
import UsageChart from '@/components/dashboard/UsageChart'
import { PRICING_PLANS } from '@/lib/stripe/config'
import { Calendar, FileText, Shield, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface Analysis {
  id: string
  systemDescription: string
  analysisType: string
  createdAt: string
}

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [currentUsage, setCurrentUsage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/dashboard')
      if (response.ok) {
        const data = await response.json()
        setAnalyses(data.analyses || [])
        setCurrentUsage(data.currentUsage || 0)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل لوحة التحكم...</p>
        </div>
      </div>
    )
  }

  const planData = PRICING_PLANS[profile?.subscriptionTier as keyof typeof PRICING_PLANS] || PRICING_PLANS.free

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1>
          <p className="text-gray-600">مرحباً بعودتك، {profile?.fullName || user?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي التحليلات</p>
                <p className="text-2xl font-bold text-gray-900">{analyses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">هذا الشهر</p>
                <p className="text-2xl font-bold text-gray-900">{currentUsage}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">الخطة</p>
                <p className="text-2xl font-bold text-gray-900 capitalize">{profile?.subscriptionTier || 'مجاني'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FileText className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">المتبقي</p>
                <p className="text-2xl font-bold text-gray-900">
                  {planData.analyses_per_month === -1 
                    ? '∞' 
                    : Math.max(0, planData.analyses_per_month - currentUsage)
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Usage Chart */}
          <div className="lg:col-span-1">
            <UsageChart
              currentUsage={currentUsage}
              limit={planData.analyses_per_month}
              planName={profile?.subscriptionTier || 'free'}
            />
          </div>

          {/* Recent Analyses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">التحليلات الأخيرة</h3>
              </div>
              <div className="p-6">
                {analyses.length > 0 ? (
                  <div className="space-y-4">
                    {analyses.map((analysis) => (
                      <div key={analysis.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {analysis.systemDescription.substring(0, 50)}...
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(analysis.createdAt).toLocaleDateString('ar-SA')} • {analysis.analysisType}
                          </p>
                        </div>
                        <Link
                          href={`/analysis/${analysis.id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                          عرض
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">لا توجد تحليلات بعد</p>
                    <Link
                      href="/"
                      className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      إنشاء أول تحليل
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}