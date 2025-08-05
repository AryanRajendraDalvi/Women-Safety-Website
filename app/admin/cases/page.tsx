"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Shield, 
  LogOut, 
  FileText, 
  Search,
  Eye,
  Edit,
  Forward,
  ArrowLeft,
  Filter,
  Calendar
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"

interface Case {
  id: string
  title: string
  status: string
  severity: string
  createdAt: string
  category: string
  submissionDestination?: string
  organizationName?: string
}

export default function AdminCasesPage() {
  const [cases, setCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [severityFilter, setSeverityFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const adminData = localStorage.getItem("safespace_admin_user")
    const adminToken = localStorage.getItem("safespace_admin_token")
    
    if (!adminData || !adminToken) {
      router.push("/admin-login")
      return
    }

    fetchCases(adminToken)
  }, [router, currentPage, searchTerm, statusFilter, severityFilter])

  const fetchCases = async (token: string) => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(severityFilter && { severity: severityFilter })
      })

      const response = await fetch(`/api/admin/dashboard/cases?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setCases(data.cases)
        setTotalPages(data.pagination.pages)
      } else if (response.status === 401) {
        localStorage.removeItem('safespace_admin_token')
        localStorage.removeItem('safespace_admin_user')
        router.push('/admin-login')
      }
    } catch (error) {
      console.error('Error fetching cases:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'under_investigation': return 'bg-orange-100 text-orange-800'
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

  const handleEditCase = (caseId: string) => {
    router.push(`/admin/cases/${caseId}/edit`)
  }

  const handleForwardCase = (caseId: string) => {
    router.push(`/admin/cases/${caseId}/forward`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading cases...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Cases</h1>
          <p className="text-gray-600">View and manage all cases from the test database</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Severity</label>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">All Severity</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setStatusFilter("")
                    setSeverityFilter("")
                    setCurrentPage(1)
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cases List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Cases ({cases.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cases.length > 0 ? (
              <div className="space-y-4">
                {cases.map((case_) => (
                  <div key={case_.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{case_.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getStatusColor(case_.status)}>
                          {case_.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getSeverityColor(case_.severity)}>
                          {case_.severity}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(case_.createdAt).toLocaleDateString()}
                        </span>
                        {case_.submissionDestination && (
                          <Badge variant="outline">
                            {case_.submissionDestination.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                      {case_.organizationName && (
                        <p className="text-sm text-gray-600 mt-1">
                          Organization: {case_.organizationName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/admin/cases/${case_.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditCase(case_.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleForwardCase(case_.id)}
                      >
                        <Forward className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 