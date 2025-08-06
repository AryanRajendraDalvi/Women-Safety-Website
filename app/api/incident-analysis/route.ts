import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Incident analysis will use fallback responses.')
}

const ANALYSIS_PROMPT = `You are a legal AI assistant specializing in workplace harassment and safety analysis. Your role is to analyze incident descriptions and provide:

1. **Severity Assessment**: Classify the incident as:
   - "critical" - Immediate danger, physical violence, threats to life
   - "high" - Serious harassment, stalking, repeated incidents
   - "medium" - Moderate harassment, inappropriate behavior
   - "low" - Minor incidents, isolated inappropriate comments

2. **Recommendations**: Provide specific, actionable advice based on severity

3. **Legal Implications**: Explain relevant legal aspects (POSH Act, IPC sections, etc.)

4. **Immediate Actions**: Suggest next steps for the victim

Analyze the following incident description and provide a structured response in JSON format:

{
  "severity": "critical|high|medium|low",
  "confidence": 0.95,
  "recommendation": "Detailed recommendation text",
  "legalImplications": "Legal context and implications",
  "immediateActions": ["Action 1", "Action 2", "Action 3"],
  "policeIntervention": true/false,
  "poshApplicable": true/false,
  "riskFactors": ["Factor 1", "Factor 2"],
  "evidenceNeeded": ["Evidence 1", "Evidence 2"]
}

Focus on:
- Safety and immediate protection
- Legal rights and remedies
- Evidence preservation
- Professional support options
- Escalation procedures

Be empathetic but objective. Prioritize victim safety and legal compliance.`

const FALLBACK_ANALYSIS = {
  severity: "medium",
  confidence: 0.7,
  recommendation: "Based on the description, this appears to be a moderate incident. Document all details, preserve any evidence, and consider reporting to HR or appropriate authorities. Seek support from workplace safety resources.",
  legalImplications: "This may fall under workplace harassment policies. Consider consulting with legal professionals for specific guidance.",
  immediateActions: [
    "Document the incident in detail",
    "Preserve any evidence (messages, emails, photos)",
    "Report to HR or management",
    "Seek emotional support if needed"
  ],
  policeIntervention: false,
  poshApplicable: true,
  riskFactors: ["Workplace environment", "Power dynamics"],
  evidenceNeeded: ["Written documentation", "Witness statements", "Digital evidence"]
}

export async function POST(request: NextRequest) {
  try {
    const { description, location, witnesses } = await request.json()

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Incident description is required' },
        { status: 400 }
      )
    }

    // Use Gemini API if available
    if (GEMINI_API_KEY) {
      try {
        const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `${ANALYSIS_PROMPT}\n\nIncident Description: ${description}\nLocation: ${location || 'Not specified'}\nWitnesses: ${witnesses || 'None mentioned'}\n\nPlease provide a JSON response with the analysis.`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1000,
            },
            safetySettings: [
              {
                category: "HARM_CATEGORY_HARASSMENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_HATE_SPEECH",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
            ]
          })
        })

        if (geminiResponse.ok) {
          const data = await geminiResponse.json()
          const response = data.candidates?.[0]?.content?.parts?.[0]?.text
          
          if (response) {
            try {
              // Try to parse JSON response
              const analysis = JSON.parse(response)
              return NextResponse.json(analysis)
            } catch (parseError) {
              console.error('Failed to parse AI response:', parseError)
              // Fall through to fallback
            }
          }
        }
      } catch (error) {
        console.error('Gemini API error:', error)
        // Fall through to fallback
      }
    }

    // Fallback analysis with basic keyword detection
    const lowerDescription = description.toLowerCase()
    
    // Critical indicators
    if (lowerDescription.includes('physical') || 
        lowerDescription.includes('assault') || 
        lowerDescription.includes('attack') ||
        lowerDescription.includes('threat') ||
        lowerDescription.includes('kill') ||
        lowerDescription.includes('weapon')) {
      return NextResponse.json({
        severity: "critical",
        confidence: 0.9,
        recommendation: "This appears to be a critical incident involving physical violence or serious threats. IMMEDIATE ACTION REQUIRED: Contact police immediately, seek medical attention if injured, and ensure your safety. This is a criminal offense that requires immediate law enforcement intervention.",
        legalImplications: "This constitutes a criminal offense under Indian Penal Code (IPC) sections 354, 354A, 354B, 354C, 354D, 509, 506, 307, 323, 324, 325, 326. File an FIR immediately.",
        immediateActions: [
          "Call police immediately (100)",
          "Seek medical attention if injured",
          "Document injuries with photos",
          "Preserve all evidence",
          "Contact emergency contacts"
        ],
        policeIntervention: true,
        poshApplicable: true,
        riskFactors: ["Physical violence", "Immediate danger", "Criminal offense"],
        evidenceNeeded: ["Medical reports", "Photographs", "Witness statements", "Police report"]
      })
    }
    
    // High severity indicators
    if (lowerDescription.includes('stalking') || 
        lowerDescription.includes('harassment') || 
        lowerDescription.includes('repeated') ||
        lowerDescription.includes('following') ||
        lowerDescription.includes('intimidate') ||
        lowerDescription.includes('blackmail')) {
      return NextResponse.json({
        severity: "high",
        confidence: 0.85,
        recommendation: "This appears to be a serious case of harassment or stalking. Consider filing a police complaint and seek legal assistance. Document all incidents and preserve evidence. This behavior may constitute criminal harassment under IPC Section 354D.",
        legalImplications: "This may constitute criminal harassment under IPC Section 354D (stalking) and workplace harassment under POSH Act. Consider filing an FIR.",
        immediateActions: [
          "Document all incidents in detail",
          "Preserve digital evidence (messages, calls)",
          "Consider filing police complaint",
          "Inform trusted family/friends",
          "Seek legal counsel"
        ],
        policeIntervention: true,
        poshApplicable: true,
        riskFactors: ["Stalking behavior", "Repeated incidents", "Intimidation"],
        evidenceNeeded: ["Incident logs", "Digital evidence", "Witness statements", "Communication records"]
      })
    }
    
    // Medium severity indicators
    if (lowerDescription.includes('inappropriate') || 
        lowerDescription.includes('comment') || 
        lowerDescription.includes('behavior') ||
        lowerDescription.includes('uncomfortable') ||
        lowerDescription.includes('verbal')) {
      return NextResponse.json({
        severity: "medium",
        confidence: 0.8,
        recommendation: "This appears to be inappropriate workplace behavior that should be addressed. Report to HR or management, document the incident, and consider seeking support from workplace safety resources.",
        legalImplications: "This may constitute workplace harassment under POSH Act. The organization has a legal obligation to investigate and take appropriate action.",
        immediateActions: [
          "Report to HR or management",
          "Document the incident in detail",
          "Preserve any evidence",
          "Seek support from workplace safety resources",
          "Consider filing internal complaint"
        ],
        policeIntervention: false,
        poshApplicable: true,
        riskFactors: ["Workplace environment", "Power dynamics", "Inappropriate behavior"],
        evidenceNeeded: ["Written documentation", "Witness statements", "Communication records"]
      })
    }

    // Default fallback
    return NextResponse.json(FALLBACK_ANALYSIS)

  } catch (error) {
    console.error('Incident analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 