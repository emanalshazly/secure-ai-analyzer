'use client'

import { useState } from 'react'

interface SecurityAnalysisFormProps {
  onSubmit: (
    systemDescription: string,
    analysisType: 'quick' | 'detailed',
    includeRecommendations: boolean
  ) => Promise<void>
  isLoading: boolean
}

export default function SecurityAnalysisForm({ onSubmit, isLoading }: SecurityAnalysisFormProps) {
  const [systemDescription, setSystemDescription] = useState('')
  const [analysisType, setAnalysisType] = useState<'quick' | 'detailed'>('quick')
  const [includeRecommendations, setIncludeRecommendations] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(systemDescription, analysisType, includeRecommendations)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="systemDescription" className="block text-sm font-medium mb-2">
          System Description
        </label>
        <textarea
          id="systemDescription"
          value={systemDescription}
          onChange={(e) => setSystemDescription(e.target.value)}
          className="w-full h-32 px-3 py-2 border rounded-md"
          placeholder="Describe your AI system and its components..."
          required
        />
      </div>

      <div>
        <label htmlFor="analysisType" className="block text-sm font-medium mb-2">
          Analysis Type
        </label>
        <select
          id="analysisType"
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value as 'quick' | 'detailed')}
          className="w-full px-3 py-2 border rounded-md"
        >
          <option value="quick">Quick Analysis</option>
          <option value="detailed">Detailed Analysis</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="includeRecommendations"
          checked={includeRecommendations}
          onChange={(e) => setIncludeRecommendations(e.target.checked)}
          className="h-4 w-4 text-blue-600"
        />
        <label htmlFor="includeRecommendations" className="ml-2 block text-sm">
          Include security recommendations
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || !systemDescription.trim()}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Analyzing...' : 'Analyze Security'}
      </button>
    </form>
  )
}