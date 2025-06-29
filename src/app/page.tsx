'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/AuthProvider'
import SecurityAnalysisForm from '../components/ui/SecurityAnalysisForm'
import AnalysisResults from '../components/ui/AnalysisResults'
import { Shield, Zap, Users, Award } from 'lucide-react'
import Link from 'next/link'

interface SecurityAnalysisResult {
  risks: {
    high: string[];
    medium: string[];
    low: string[];
  };
  recommendations: string[];
  summary: string;
}

export default function HomePage() {
  const { user, profile, loading: authLoading } = useAuth()
  const [analysisResult, setAnalysisResult] = useState<SecurityAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/auth'
    }
  }, [user, authLoading])

  const handleAnalysis = async (
    systemDescription: string,
    analysisType: 'quick' | 'detailed',
    includeRecommendations: boolean
  ) => {
    if (!user) {
      window.location.href = '/auth'
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemDescription,
          analysisType,
          includeRecommendations,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Analysis request failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err: any) {
      setError(err.message || 'Failed to perform security analysis. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              AI-Powered Security Analysis
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Get comprehensive security assessments for your systems in minutes
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Enterprise-grade security
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Instant analysis
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Trusted by professionals
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Analysis Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Security Analysis
              </h2>
              <SecurityAnalysisForm onSubmit={handleAnalysis} isLoading={loading} />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                  {error}
                </div>
              )}
              
              {loading && (
                <div className="mt-4 p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  Analyzing system security...
                </div>
              )}
            </div>

            {analysisResult && !loading && (
              <div className="mt-8">
                <AnalysisResults result={analysisResult} />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Your Plan</h3>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900 capitalize">
                  {profile?.subscription_tier || 'Free'}
                </p>
                <p className="text-sm text-gray-600">
                  {profile?.subscription_tier === 'free' 
                    ? '5 analyses per month'
                    : profile?.subscription_tier === 'pro'
                    ? '100 analyses per month'
                    : 'Unlimited analyses'
                  }
                </p>
                {profile?.subscription_tier === 'free' && (
                  <Link
                    href="/pricing"
                    className="inline-block mt-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Upgrade Plan →
                  </Link>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View Dashboard
                </Link>
                <Link
                  href="/pricing"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Upgrade Plan
                </Link>
                <Link
                  href="/billing"
                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Billing Settings
                </Link>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI-powered risk assessment</li>
                <li>• Detailed security recommendations</li>
                <li>• Risk categorization (High/Medium/Low)</li>
                <li>• Analysis history tracking</li>
                <li>• Export capabilities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}