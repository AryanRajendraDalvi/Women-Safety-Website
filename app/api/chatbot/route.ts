import { NextRequest, NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'

if (!GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Chatbot will use fallback responses.')
}

const SAFETY_PROMPT = `You are SafeSpace, a compassionate AI companion designed to support women who have experienced workplace sexual harassment. Your role is to:

1. **Provide emotional support and validation** - Acknowledge their feelings and experiences without judgment
2. **Offer practical guidance** - Share information about legal rights, reporting procedures, and safety measures
3. **Maintain confidentiality** - Remind users that their privacy is protected
4. **Encourage professional help** - Suggest appropriate resources and professional support when needed
5. **Prioritize safety** - If someone is in immediate danger, provide emergency contact information
6. **Be trauma-informed** - Use sensitive, supportive language that doesn't retraumatize
7. **Stay within scope** - Focus on workplace harassment and safety, refer to professionals for other issues

Key guidelines:
- Always respond with empathy and understanding
- Use supportive, non-judgmental language
- Provide actionable, practical advice when appropriate
- Include relevant legal information (POSH Act, workplace rights)
- Suggest professional resources (counselors, legal aid, helplines)
- Never ask for personal identifying information
- If someone mentions immediate danger, provide emergency contacts
- Keep responses concise but comprehensive
- Use a warm, caring tone throughout

Remember: You are a supportive companion, not a replacement for professional help. Always encourage seeking professional support when appropriate.`

const FALLBACK_RESPONSES = [
  "I hear you, and I want you to know that what you're experiencing is not okay. You deserve to feel safe at work. Would you like to talk more about what happened, or would you prefer information about your legal rights and next steps?",
  
  "I'm so sorry you're going through this. Your feelings are valid, and you're not alone. There are people and resources available to help you. What would be most helpful for you right now - emotional support, practical guidance, or information about your rights?",
  
  "Thank you for sharing this with me. It takes courage to speak up about workplace harassment. You have legal protections under the POSH Act, and there are steps you can take to address this situation. Would you like to know more about your options?",
  
  "I want you to know that you're not to blame for what happened. Workplace harassment is never acceptable. You have the right to a safe work environment. Let me help you understand your rights and the resources available to you.",
  
  "I'm here to listen and support you. What you're experiencing is serious and deserves attention. There are several ways to address this situation, from internal reporting to legal action. What would you like to know more about?"
]

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Check for emergency keywords
    const emergencyKeywords = ['suicide', 'kill myself', 'want to die', 'end my life', 'hurt myself']
    const hasEmergencyKeywords = emergencyKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    if (hasEmergencyKeywords) {
      return NextResponse.json({
        response: `I'm very concerned about what you're sharing. Please know that you're not alone and help is available right now. 

**Emergency Resources:**
• National Suicide Prevention Lifeline (India): 1800-599-0019
• Crisis Helpline: 988
• Emergency Services: 112

Please reach out to one of these numbers immediately, or go to the nearest emergency room. Your life has value, and there are people who want to help you.

If you're not in immediate crisis but need ongoing support, please consider speaking with a mental health professional or counselor.`
      })
    }

    // Check for immediate danger keywords
    const dangerKeywords = ['immediate danger', 'right now', 'currently', 'happening now', 'urgent']
    const hasDangerKeywords = dangerKeywords.some(keyword => 
      message.toLowerCase().includes(keyword)
    )

    if (hasDangerKeywords) {
      return NextResponse.json({
        response: `If you're in immediate danger right now, please:

1. **Call emergency services immediately**: 112
2. **Remove yourself from the dangerous situation** if possible
3. **Contact a trusted friend or family member**
4. **Call the National Women's Helpline**: 181

Your safety is the most important thing right now. Once you're safe, we can discuss longer-term solutions and support options.

Are you currently in a safe place?`
      })
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
                text: `${SAFETY_PROMPT}\n\nUser message: ${message}\n\nPlease provide a supportive, helpful response that addresses their concerns while maintaining the safety-focused approach outlined above.`
              }]
            }],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 800,
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
            return NextResponse.json({ response })
          }
        }
      } catch (error) {
        console.error('Gemini API error:', error)
        // Fall through to fallback responses
      }
    }

    // Fallback response if Gemini API is not available or fails
    const fallbackResponse = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
    
    return NextResponse.json({
      response: fallbackResponse
    })

  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 