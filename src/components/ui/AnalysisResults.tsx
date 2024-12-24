interface AnalysisResultsProps {
  result: {
    risks: {
      high: string[];
      medium: string[];
      low: string[];
    };
    recommendations: string[];
    summary: string;
  }
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const renderRiskList = (risks: string[], level: string) => {
    const colorClass = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    }[level.toLowerCase()] || 'text-gray-600'

    return (
      <div className="mb-6">
        <h3 className={`font-medium mb-2 ${colorClass}`}>
          {level.charAt(0).toUpperCase() + level.slice(1)} Priority Risks
        </h3>
        {risks.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {risks.map((risk, index) => (
              <li key={index} className="text-gray-700">{risk}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No {level.toLowerCase()} priority risks identified.</p>
        )}
      </div>
    )
  }

  return (
    <div className="mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Security Analysis Results</h2>
      
      {result.summary && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Summary</h3>
          <p className="text-gray-700">{result.summary}</p>
        </div>
      )}

      {renderRiskList(result.risks.high, 'High')}
      {renderRiskList(result.risks.medium, 'Medium')}
      {renderRiskList(result.risks.low, 'Low')}

      {result.recommendations && result.recommendations.length > 0 && (
        <div>
          <h3 className="font-medium mb-2">Recommendations</h3>
          <ul className="list-disc pl-5 space-y-1">
            {result.recommendations.map((recommendation, index) => (
              <li key={index} className="text-gray-700">{recommendation}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}