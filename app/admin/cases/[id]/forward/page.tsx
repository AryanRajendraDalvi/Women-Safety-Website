"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Shield, 
  LogOut, 
  ArrowLeft,
  Send,
  AlertTriangle,
  Users
} from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"

export default function ForwardCasePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [caseData, setCaseData] = useState<any>(null)
  const [selectedDestination, setSelectedDestination] = useState("")
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

  const handleForward = async () => {
    if (!selectedDestination) {
      alert('Please select a destination')
      return
    }
    
    // Placeholder for forward functionality
    alert(`Case will be forwarded to ${selectedDestination}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading case data...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Forward Case</h1>
          <p className="text-gray-600">Forward this case to another department or organization</p>
        </div>

        {caseData ? (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Case Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Case Details
                </CardTitle>
                <CardDescription>
                  Case ID: {caseId}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Title</label>
                    <p className="text-sm text-gray-600">{caseData.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Badge className="mt-1">{caseData.status}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Severity</label>
                    <Badge variant="outline" className="mt-1">{caseData.severity}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <p className="text-sm text-gray-600">{caseData.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-gray-600">{caseData.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Forward Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Forward Options
                </CardTitle>
                <CardDescription>
                  Select where to forward this case
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Destination</label>
                    <select
                      value={selectedDestination}
                      onChange={(e) => setSelectedDestination(e.target.value)}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="">Select destination...</option>
                      <option value="hr">HR Department</option>
                      <option value="legal">Legal Department</option>
                      <option value="ngo">NGO Partner</option>
                      <option value="police">Police Department</option>
                      <option value="counseling">Counseling Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Additional Notes</label>
                    <textarea
                      placeholder="Add any additional notes for the recipient..."
                      className="w-full mt-1 p-2 border rounded-md"
                      rows={4}
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Link href={`/admin/cases/${caseId}`}>
                      <Button variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button onClick={handleForward}>
                      <Send className="h-4 w-4 mr-2" />
                      Forward Case
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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