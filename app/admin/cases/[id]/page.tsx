"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  LogOut, 
  ArrowLeft,
  Edit,
  AlertTriangle,
  Calendar,
  MapPin,
  User
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"

export default function CaseDetailPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [caseData, setCaseData] = useState<any>(null)
  const router = useRouter()
  const params = useParams()
  const caseId = params.id as string
  const { t } = useLanguage()

  useEffect(() => {
    const adminData = localStorage.getItem("safespace_admin_user")
    const adminToken = localStorage.getItem("safespace_admin_token")
    
    if (!adminData || !adminToken) {
      router.push("/admin-login")
      return
    }

    fetchCaseData(adminToken)
  }, [router, caseId])

  const fetchCaseData = async (token: string) => {
    try {
      const response = await fetch(`/api/admin/cases/${caseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCaseData(data)
      } else if (response.status === 401) {
        localStorage.removeItem('safespace_admin_token')
        localStorage.removeItem('safespace_admin_user')
        router.push('/admin-login')
      }
    } catch (error) {
      console.error('Error fetching case data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      case 'critical': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading case details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="flex items-center space-x-2">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SafeSpace Admin</span>
            </Link>
          </div>
          <Link href="/admin/dashboard">
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Case Details</h1>
          <p className="text-gray-600">View complete case information</p>
        </div>

        {caseData ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Case Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        {caseData.title}
                      </CardTitle>
                      <CardDescription>
                        Case ID: {caseId}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(caseData.status)}>
                        {caseData.status.replace('_', ' ')}
                      </Badge>
                      <Badge className={getSeverityColor(caseData.severity)}>
                        {caseData.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Description */}
                    <div>
                      <h3 className="font-medium mb-2">Description</h3>
                      <p className="text-gray-700">{caseData.description}</p>
                    </div>

                    {/* Category */}
                    <div>
                      <h3 className="font-medium mb-2">Category</h3>
                      <Badge variant="outline">{caseData.category}</Badge>
                    </div>

                    {/* Location */}
                    {caseData.location && (
                      <div>
                        <h3 className="font-medium mb-2">Location</h3>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-4 w-4 mr-2" />
                          {caseData.location}
                        </div>
                      </div>
                    )}

                    {/* Submission Details */}
                    {caseData.submissionDestination && (
                      <div>
                        <h3 className="font-medium mb-2">Submission Destination</h3>
                        <Badge variant="outline" className="capitalize">
                          {caseData.submissionDestination}
                        </Badge>
                      </div>
                    )}

                    {caseData.organizationName && (
                      <div>
                        <h3 className="font-medium mb-2">Organization</h3>
                        <p className="text-gray-700">{caseData.organizationName}</p>
                      </div>
                    )}

                    {/* Timestamps */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-2">Created</h3>
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(caseData.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {caseData.updatedAt && (
                        <div>
                          <h3 className="font-medium mb-2">Last Updated</h3>
                          <div className="flex items-center text-gray-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(caseData.updatedAt).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Actions Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start"
                    onClick={() => router.push(`/admin/cases/${caseId}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Case
                  </Button>
                  <Link href="/admin/cases">
                    <Button variant="outline" className="w-full justify-start">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Cases
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Case Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Case Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <Badge className={getStatusColor(caseData.status)}>
                        {caseData.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Severity:</span>
                      <Badge className={getSeverityColor(caseData.severity)}>
                        {caseData.severity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <span className="text-sm font-medium">{caseData.category}</span>
                    </div>
                    {caseData.submissionDestination && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Destination:</span>
                        <span className="text-sm font-medium capitalize">
                          {caseData.submissionDestination}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Case Not Found</h3>
              <p className="text-gray-600">The requested case could not be found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 