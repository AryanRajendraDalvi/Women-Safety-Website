"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowLeft, Save, Mic, MicOff, Upload, Calendar, MapPin, Users, AlertTriangle, Building2, Heart, Scale } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"
import IncidentAnalysisAI from "@/components/IncidentAnalysisAI"

export default function LogIncidentPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [witnesses, setWitnesses] = useState("")
  const [severity, setSeverity] = useState("medium")
  const [submissionDestination, setSubmissionDestination] = useState("")
  const [organizationName, setOrganizationName] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [aiSeverity, setAiSeverity] = useState<string>("")
  const [aiRecommendation, setAiRecommendation] = useState<string>("")
  const [firData, setFirData] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { t } = useLanguage()

  const handleSave = async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    try {
      const token = localStorage.getItem('safespace_token')
      if (!token) {
        alert('Please login to continue')
        router.push('/login')
        return
      }

      const incidentData = {
        title,
        description,
        location,
        witnesses,
        severity,
        submissionDestination,
        organizationName: submissionDestination === 'hr' ? organizationName : undefined,
        category: 'other', // Default category
        tags: []
      }

      const response = await fetch('/api/incidents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incidentData),
      })

      const data = await response.json()

      if (response.ok) {
        // Upload files if any
        if (uploadedFiles.length > 0) {
          for (const file of uploadedFiles) {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('incidentId', data.incident.id)
            formData.append('description', `Evidence for incident: ${title}`)

            await fetch('/api/evidence/upload', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
              },
              body: formData,
            })
          }
        }

        // Save to localStorage for display in dashboard and evidence vault
        const newIncident = {
          id: data.incident.id || Date.now(),
          title: title || `Incident Log #${Date.now()}`,
          description,
          location,
          witnesses,
          severity,
          timestamp: new Date().toISOString(),
          files: uploadedFiles.map(file => file.name)
        }

        const existingLogs = JSON.parse(localStorage.getItem('safespace_logs') || '[]')
        const updatedLogs = [...existingLogs, newIncident]
        localStorage.setItem('safespace_logs', JSON.stringify(updatedLogs))

        // Show success message
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false)
          router.push('/dashboard')
        }, 2000)
      } else {
        alert(data.error || 'Failed to save incident')
      }
    } catch (error) {
      console.error('Save incident error:', error)
      alert('Failed to save incident. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false)
      setRecordingTime(0)
    } else {
      setIsRecording(true)
      // In a real app, this would start actual audio recording
      const interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      setTimeout(() => {
        clearInterval(interval)
        setIsRecording(false)
        setRecordingTime(0)
      }, 30000) // Auto-stop after 30 seconds for demo
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles((prev) => [...prev, ...Array.from(e.target.files!)])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnalysisComplete = (severity: string, recommendation: string) => {
    setAiSeverity(severity)
    setAiRecommendation(recommendation)
  }

  const handleFIRGenerated = (fir: any) => {
    setFirData(fir)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <HomeButton />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back")} to {t("dashboard")}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">Log New Incident</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🔒 {t("encrypted")}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Incident Details
                </CardTitle>
                <CardDescription>
                  Document the incident with as much detail as you're comfortable sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">{t("title")} (Optional)</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title for this incident"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">{t("description")}</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happened in detail. Include dates, times, and specific behaviors..."
                    rows={6}
                    className="mt-1"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">{t("location")}</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Where did this occur?"
                        className="pl-10 mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="witnesses">{t("witnesses")} (Optional)</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="witnesses"
                        value={witnesses}
                        onChange={(e) => setWitnesses(e.target.value)}
                        placeholder="Any witnesses present?"
                        className="pl-10 mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>{t("severity")} Level</Label>
                  <div className="flex space-x-2 mt-2">
                    {["low", "medium", "high"].map((level) => (
                      <Button
                        key={level}
                        variant={severity === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSeverity(level)}
                        className={severity === level ? "bg-purple-600 hover:bg-purple-700" : ""}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Submission Destination */}
                <div>
                  <Label htmlFor="submissionDestination">Where should this report be submitted?</Label>
                  <Select value={submissionDestination} onValueChange={setSubmissionDestination}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select submission destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-2 text-blue-600" />
                          HR Department
                        </div>
                      </SelectItem>
                      <SelectItem value="ngo">
                        <div className="flex items-center">
                          <Heart className="h-4 w-4 mr-2 text-green-600" />
                          NGO Support
                        </div>
                      </SelectItem>
                      <SelectItem value="legal_aid">
                        <div className="flex items-center">
                          <Scale className="h-4 w-4 mr-2 text-purple-600" />
                          Legal Aid
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Organization Name (only for HR) */}
                {submissionDestination === 'hr' && (
                  <div>
                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                      id="organizationName"
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Enter your organization name"
                      className="mt-1"
                      required
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Evidence Collection */}
            <Card>
              <CardHeader>
                <CardTitle>Evidence Collection</CardTitle>
                <CardDescription>Add supporting evidence to strengthen your documentation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Audio Recording */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label>Audio Recording</Label>
                    <Badge variant={isRecording ? "destructive" : "secondary"}>
                      {isRecording ? "Recording..." : "Ready"}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button
                      variant={isRecording ? "destructive" : "outline"}
                      onClick={toggleRecording}
                      className="flex items-center"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="h-4 w-4 mr-2" />
                          Stop ({formatTime(recordingTime)})
                        </>
                      ) : (
                        <>
                          <Mic className="h-4 w-4 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-gray-600">Record audio evidence or voice notes</p>
                  </div>
                </div>

                {/* File Upload */}
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label>File Upload</Label>
                    <Badge variant="secondary">{uploadedFiles.length} files</Badge>
                  </div>
                  <div className="space-y-3">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Screenshots, Photos, or Documents
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />

                    {uploadedFiles.length > 0 && (
                      <div className="space-y-2">
                        {uploadedFiles.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <span className="text-sm truncate">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Analysis */}
            <IncidentAnalysisAI
              description={description}
              location={location}
              witnesses={witnesses}
              onAnalysisComplete={handleAnalysisComplete}
              onFIRGenerated={handleFIRGenerated}
            />

            {/* Security Notice */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Your Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-green-700 space-y-2">
                  <li>• All data encrypted on your device</li>
                  <li>• No personal information stored</li>
                  <li>• You control who sees this log</li>
                  <li>• Delete permanently anytime</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-600" />
                  Documentation Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Include specific dates and times</li>
                  <li>• Describe behavior objectively</li>
                  <li>• Note any witnesses present</li>
                  <li>• Save relevant communications</li>
                  <li>• Document your response/actions</li>
                </ul>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button 
                onClick={handleSave} 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={isSubmitting || !description.trim() || !submissionDestination || (submissionDestination === 'hr' && !organizationName.trim())}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : `${t("save")} Securely`}
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full bg-transparent">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Incident Submitted Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your report has been securely saved and will appear in your dashboard.
            </p>
            <div className="animate-pulse text-sm text-purple-600">
              Redirecting to dashboard...
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
