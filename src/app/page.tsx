'use client'

import { useState } from 'react'
import SecurityAnalysisForm from '../components/ui/SecurityAnalysisForm'
import AnalysisResults from '../components/ui/AnalysisResults'

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
  const [analysisResult, setAnalysisResult] = useState<SecurityAnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnalysis = async (
    systemDescription: string,
    analysisType: 'quick' | 'detailed',
    includeRecommendations: boolean
  ) => {
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
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis request failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
    } catch (err) {
      setError('Failed to perform security analysis. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AI System Security Analyzer</h1>
      
      <SecurityAnalysisForm onSubmit={handleAnalysis} isLoading={loading} />
      
      {error && (
        <div className="text-red-500 my-4 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {loading && (
        <div className="my-4 p-4 text-center">
          Analyzing system security...
        </div>
      )}
      
      {analysisResult && !loading && (
        <AnalysisResults result={analysisResult} />
      )}
    </main>
  )
}