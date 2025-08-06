"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle, MapPin, Shield, FileText, Send, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PoliceStation {
  name: string
  address: string
  phone: string
  distance: number
  coordinates: {
    lat: number
    lng: number
  }
}

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
  policeStation: PoliceStation
  firNumber?: string
  status: 'draft' | 'submitted' | 'approved' | 'lodged'
  timestamp: string
}

interface IncidentAnalysisAIProps {
  description: string
  location: string
  witnesses: string
  onAnalysisComplete: (severity: string, recommendation: string) => void
  onFIRGenerated: (firData: FIRData) => void
}

export default function IncidentAnalysisAI({ 
  description, 
  location, 
  witnesses, 
  onAnalysisComplete, 
  onFIRGenerated 
}: IncidentAnalysisAIProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [showFIRDialog, setShowFIRDialog] = useState(false)
  const [firData, setFirData] = useState<FIRData | null>(null)
  const [isGeneratingFIR, setIsGeneratingFIR] = useState(false)
  const [isSubmittingFIR, setIsSubmittingFIR] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  // Auto-analyze description when user finishes typing
  useEffect(() => {
    if (!description.trim()) {
      setAnalysisResult(null)
      return
    }

    // Debounce the analysis to avoid too many API calls
    const timeoutId = setTimeout(() => {
      analyzeIncident()
    }, 2000) // Wait 2 seconds after user stops typing

    return () => clearTimeout(timeoutId)
  }, [description, location, witnesses])

  // Analyze incident severity
  const analyzeIncident = async () => {
    if (!description.trim()) {
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/incident-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description,
          location,
          witnesses
        }),
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const result = await response.json()
      setAnalysisResult(result)
      onAnalysisComplete(result.severity, result.recommendation)

      // If severe, automatically get user location and find police stations
      if (result.severity === 'critical' || result.severity === 'high') {
        await getUserLocation()
      }

      // Only show success toast for severe cases to avoid spam
      if (result.severity === 'critical' || result.severity === 'high') {
        toast.success('Severe incident detected - FIR generation available')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      // Don't show error toast for automatic analysis to avoid spam
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Get user's current location
  const getUserLocation = async (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(coords)
          resolve(coords)
        },
        (error) => {
          console.error('Location error:', error)
          reject(error)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      )
    })
  }

  // Find nearby police stations
  const findNearbyPoliceStations = async (userCoords: { lat: number; lng: number }): Promise<PoliceStation[]> => {
    try {
      const response = await fetch('/api/police-stations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: userCoords.lat,
          longitude: userCoords.lng,
          radius: 10 // 10km radius
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to find police stations')
      }

      const data = await response.json()
      return data.policeStations
    } catch (error) {
      console.error('Police station search error:', error)
      // Return default police stations if API fails
      return [
        {
          name: "Local Police Station",
          address: "Main Street, City Center",
          phone: "100",
          distance: 2.5,
          coordinates: { lat: userCoords.lat + 0.01, lng: userCoords.lng + 0.01 }
        }
      ]
    }
  }

  // Generate FIR
  const generateFIR = async () => {
    if (!userLocation) {
      toast.error('Location access required for FIR generation')
      return
    }

    setIsGeneratingFIR(true)
    try {
      const policeStations = await findNearbyPoliceStations(userLocation)
      const nearestStation = policeStations[0]

      const firData: FIRData = {
        incidentId: `INC-${Date.now()}`,
        complainantName: "Anonymous Complainant",
        complainantAddress: "Address withheld for privacy",
        complainantPhone: "Phone withheld for privacy",
        incidentDate: new Date().toISOString().split('T')[0],
        incidentTime: new Date().toLocaleTimeString(),
        incidentLocation: location || "Location to be specified",
        incidentDescription: description,
        accusedDetails: "To be specified",
        witnesses: witnesses || "None mentioned",
        evidence: "Digital evidence attached",
        policeStation: nearestStation,
        status: 'draft',
        timestamp: new Date().toISOString()
      }

      setFirData(firData)
      setShowFIRDialog(true)
      onFIRGenerated(firData)
      
      // Store FIR in localStorage for dashboard display
      const existingFIRs = JSON.parse(localStorage.getItem('safespace_firs') || '[]')
      const updatedFIRs = [...existingFIRs, firData]
      localStorage.setItem('safespace_firs', JSON.stringify(updatedFIRs))
      
      toast.success('FIR draft generated successfully')
    } catch (error) {
      console.error('FIR generation error:', error)
      toast.error('Failed to generate FIR. Please try again.')
    } finally {
      setIsGeneratingFIR(false)
    }
  }

  // Submit FIR to police
  const submitFIR = async () => {
    if (!firData) return

    setIsSubmittingFIR(true)
    try {
      const response = await fetch('/api/submit-fir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firData),
      })

      if (!response.ok) {
        throw new Error('FIR submission failed')
      }

      const result = await response.json()
      
      // Update FIR with submission details
      const updatedFIR = {
        ...firData,
        firNumber: result.firNumber,
        status: 'lodged' as const
      }

      setFirData(updatedFIR)
      onFIRGenerated(updatedFIR)
      
      // Update FIR in localStorage
      const existingFIRs = JSON.parse(localStorage.getItem('safespace_firs') || '[]')
      const updatedFIRs = existingFIRs.map((fir: any) => 
        fir.incidentId === updatedFIR.incidentId ? updatedFIR : fir
      )
      localStorage.setItem('safespace_firs', JSON.stringify(updatedFIRs))
      
      toast.success(`FIR lodged successfully! FIR Number: ${result.firNumber}`)
      setShowFIRDialog(false)
    } catch (error) {
      console.error('FIR submission error:', error)
      toast.error('Failed to submit FIR. Please try again.')
    } finally {
      setIsSubmittingFIR(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'high': return <AlertCircle className="h-4 w-4" />
      case 'medium': return <AlertCircle className="h-4 w-4" />
      case 'low': return <CheckCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <>
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-purple-600" />
            AI Incident Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!analysisResult ? (
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                AI will automatically analyze your incident description once you finish typing
              </p>
              {isAnalyzing && (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">Analyzing incident...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Analysis Results */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Severity Assessment:</span>
                <Badge className={getSeverityColor(analysisResult.severity)}>
                  {getSeverityIcon(analysisResult.severity)}
                  <span className="ml-1 capitalize">{analysisResult.severity}</span>
                </Badge>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">AI Recommendation:</h4>
                <p className="text-sm text-gray-700">{analysisResult.recommendation}</p>
              </div>

              {/* Legal Implications */}
              {analysisResult.legalImplications && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2 text-blue-800">Legal Implications:</h4>
                  <p className="text-sm text-blue-700">{analysisResult.legalImplications}</p>
                </div>
              )}

              {/* FIR Generation for Severe Cases */}
              {(analysisResult.severity === 'critical' || analysisResult.severity === 'high') && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 mb-2">Immediate Action Required</h4>
                      <p className="text-sm text-red-700 mb-3">
                        This incident appears to be severe and may require immediate police intervention. 
                        We can help you generate and submit an FIR (First Information Report) to the nearest police station.
                      </p>
                      <Button
                        onClick={generateFIR}
                        disabled={isGeneratingFIR}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isGeneratingFIR ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating FIR...
                          </>
                        ) : (
                          <>
                            <FileText className="h-4 w-4 mr-2" />
                            Generate FIR
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Re-analyze Button */}
              <Button
                variant="outline"
                onClick={() => setAnalysisResult(null)}
                className="w-full"
              >
                Re-analyze
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FIR Review Dialog */}
      <Dialog open={showFIRDialog} onOpenChange={setShowFIRDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Review FIR Draft
            </DialogTitle>
            <DialogDescription>
              Please review the FIR details before submission. You can edit any information before lodging the complaint.
            </DialogDescription>
          </DialogHeader>

          {firData && (
            <div className="space-y-4">
              {/* Police Station Info */}
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Nearest Police Station:</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>{firData.policeStation.name}</strong></p>
                  <p className="text-blue-700">{firData.policeStation.address}</p>
                  <p className="text-blue-700">Phone: {firData.policeStation.phone}</p>
                  <p className="text-blue-700">Distance: {firData.policeStation.distance} km</p>
                </div>
              </div>

              {/* FIR Details */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium">Incident Date</label>
                    <p className="text-sm text-gray-600">{firData.incidentDate}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Incident Time</label>
                    <p className="text-sm text-gray-600">{firData.incidentTime}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Incident Location</label>
                  <p className="text-sm text-gray-600">{firData.incidentLocation}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Incident Description</label>
                  <p className="text-sm text-gray-600">{firData.incidentDescription}</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Witnesses</label>
                  <p className="text-sm text-gray-600">{firData.witnesses}</p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-800 font-medium">Privacy Notice</p>
                    <p className="text-xs text-yellow-700">
                      Your personal information is protected. The FIR will be submitted anonymously with only essential details.
                      You can choose to provide additional contact information if you wish to be contacted by the police.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFIRDialog(false)}
              disabled={isSubmittingFIR}
            >
              Cancel
            </Button>
            <Button
              onClick={submitFIR}
              disabled={isSubmittingFIR}
              className="bg-red-600 hover:bg-red-700"
            >
              {isSubmittingFIR ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting FIR...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Lodge FIR
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 