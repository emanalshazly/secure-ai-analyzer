import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // للاستخدام في جانب العميل
});

interface SecurityAnalysisRequest {
  targetSystem: string;
  analysisType: 'quick' | 'detailed';
  includeRecommendations: boolean;
}

export async function performSecurityAnalysis(request: SecurityAnalysisRequest) {
  try {
    const prompt = generateSecurityPrompt(request);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a cybersecurity expert specialized in analyzing systems and identifying security risks. 
                   Provide your analysis in a structured format with clear risk levels (High, Medium, Low) 
                   and specific recommendations.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    return parseAnalysisResponse(response, request.includeRecommendations);

  } catch (error) {
    console.error('Analysis failed:', error);
    throw new Error('Failed to perform security analysis');
  }
}

function generateSecurityPrompt({ targetSystem, analysisType, includeRecommendations }: SecurityAnalysisRequest): string {
  return `
Please perform a ${analysisType} security analysis for the following system:

${targetSystem}

Analyze and present your findings in the following format:

1. SUMMARY
[Brief overview of security analysis findings]

2. HIGH RISK ISSUES
[List each high-risk security issue with description]

3. MEDIUM RISK ISSUES
[List each medium-risk security issue with description]

4. LOW RISK ISSUES
[List each low-risk security issue with description]

${includeRecommendations ? `
5. RECOMMENDATIONS
[Specific recommendations for each identified issue]
` : ''}

Please be specific and actionable in your analysis.
`;
}

function parseAnalysisResponse(response: string, includeRecommendations: boolean) {
  const sections = response.split(/\d+\./);
  
  const risks = {
    high: [] as any[],
    medium: [] as any[],
    low: [] as any[]
  };
  
  let summary = '';
  let recommendations: string[] = [];

  sections.forEach((section) => {
    const trimmedSection = section.trim();
    
    if (trimmedSection.toLowerCase().includes('summary')) {
      summary = trimmedSection.replace(/summary/i, '').trim();
    }
    else if (trimmedSection.toLowerCase().includes('high risk')) {
      const issues = trimmedSection
        .split('\n')
        .filter(line => line.trim() && !line.toLowerCase().includes('high risk'))
        .map(issue => ({
          description: issue.trim(),
          riskLevel: 'high',
          recommendation: ''
        }));
      risks.high.push(...issues);
    }
    else if (trimmedSection.toLowerCase().includes('medium risk')) {
      const issues = trimmedSection
        .split('\n')
        .filter(line => line.trim() && !line.toLowerCase().includes('medium risk'))
        .map(issue => ({
          description: issue.trim(),
          riskLevel: 'medium',
          recommendation: ''
        }));
      risks.medium.push(...issues);
    }
    else if (trimmedSection.toLowerCase().includes('low risk')) {
      const issues = trimmedSection
        .split('\n')
        .filter(line => line.trim() && !line.toLowerCase().includes('low risk'))
        .map(issue => ({
          description: issue.trim(),
          riskLevel: 'low',
          recommendation: ''
        }));
      risks.low.push(...issues);
    }
    else if (includeRecommendations && trimmedSection.toLowerCase().includes('recommendations')) {
      recommendations = trimmedSection
        .split('\n')
        .filter(line => line.trim() && !line.toLowerCase().includes('recommendations'))
        .map(rec => rec.trim());
    }
  });

  return {
    timestamp: new Date().toISOString(),
    risks,
    summary: summary || 'Analysis completed successfully.',
    recommendations
  };
}