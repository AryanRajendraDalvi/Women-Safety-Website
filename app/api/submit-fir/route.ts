import { NextRequest, NextResponse } from 'next/server'

interface FIRData {
  incidentId: string
  complainantName: string
  complainantAddress: string
  complainantPhone: string
  incidentDate: string
  incidentTime: string
  incidentLocation: string
  incidentDescription: string
  accusedDetails: string
  witnesses: string
  evidence: string
  policeStation: {
    name: string
    address: string
    phone: string
    distance: number
    coordinates: {
      lat: number
      lng: number
    }
  }
  firNumber?: string
  status: 'draft' | 'submitted' | 'approved' | 'lodged'
  timestamp: string
}

// Generate FIR number
function generateFIRNumber(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  const stationCode = 'PS' // Police Station code
  return `${stationCode}/${year}/${randomNum}`
}

// Simulate FIR submission to police station
async function submitToPoliceStation(firData: FIRData): Promise<{ success: boolean; firNumber?: string; message: string }> {
  // In a real implementation, this would:
  // 1. Connect to police department APIs
  // 2. Submit FIR data to the specific police station
  // 3. Receive confirmation and FIR number
  // 4. Handle any errors or rejections

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Simulate success (90% success rate)
  const isSuccess = Math.random() > 0.1

  if (isSuccess) {
    const firNumber = generateFIRNumber()
    return {
      success: true,
      firNumber,
      message: `FIR successfully lodged at ${firData.policeStation.name}. FIR Number: ${firNumber}`
    }
  } else {
    return {
      success: false,
      message: `Failed to lodge FIR at ${firData.policeStation.name}. Please try again or contact the police station directly.`
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const firData: FIRData = await request.json()

    // Validate required fields
    if (!firData.incidentDescription || !firData.incidentLocation) {
      return NextResponse.json(
        { error: 'Incident description and location are required' },
        { status: 400 }
      )
    }

    if (!firData.policeStation) {
      return NextResponse.json(
        { error: 'Police station information is required' },
        { status: 400 }
      )
    }

    // Submit FIR to police station
    const submissionResult = await submitToPoliceStation(firData)

    if (submissionResult.success) {
      // Store FIR data (in a real app, this would be in a database)
      const storedFIR = {
        ...firData,
        firNumber: submissionResult.firNumber,
        status: 'lodged' as const,
        submittedAt: new Date().toISOString(),
        policeStationResponse: submissionResult.message
      }

      // In a real implementation, you would:
      // 1. Save FIR data to database
      // 2. Send confirmation email/SMS to user
      // 3. Log the submission for audit purposes
      // 4. Update incident status

      return NextResponse.json({
        success: true,
        firNumber: submissionResult.firNumber,
        message: submissionResult.message,
        firData: storedFIR
      })
    } else {
      return NextResponse.json({
        success: false,
        error: submissionResult.message
      }, { status: 500 })
    }

  } catch (error) {
    console.error('FIR submission error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 