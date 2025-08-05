"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Shield, 
  LogOut, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Search,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Edit,
  Forward,
  Download
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { apiService } from "@/lib/api"

interface AdminUser {
  username: string
  role: string
  organization: {
    name: string
    id: string
    type: string
  }
  permissions: string[]
}

interface DashboardMetrics {
  totalCases: number
  newCases: number
  openCases: number
  closedCases: number
}

interface Case {
  id: string
  title: string
  status: string
  severity: string
  createdAt: string
  category: string
}

export default function AdminDashboardPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [recentCases, setRecentCases] = useState<Case[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const adminData = localStorage.getItem("safespace_admin_user")
    const adminToken = localStorage.getItem("safespace_admin_token")
    
    if (!adminData || !adminToken) {
      router.push("/admin-login")
      return
    }

    setAdmin(JSON.parse(adminData))
    fetchDashboardData(adminToken)
  }, [router])

  const fetchDashboardData = async (token: string) => {
    try {
      // Set the admin token for API service
      if (typeof window !== 'undefined') {
        localStorage.setItem('safespace_admin_token', token);
      }
      
      const response = await apiService.getAdminDashboardOverview()

      if (response.data) {
        setMetrics(response.data.metrics)
        setRecentCases(response.data.recentCases)
      } else {
        console.error('Dashboard error:', response.error)
        if (response.error?.includes('401') || response.error?.includes('Invalid token')) {
          localStorage.removeItem('safespace_admin_token')
          localStorage.removeItem('safespace_admin_user')
          router.push('/admin-login')
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('safespace_admin_token')
      if (token) {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('safespace_admin_user')
      localStorage.removeItem('safespace_admin_token')
      router.push('/')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800'
      case 'under_review': return 'bg-yellow-100 text-yellow-800'
      case 'under_investigation': return 'bg-orange-100 text-orange-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'escalated': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'hr_admin': return 'HR Administrator'
      case 'ngo_admin': return 'NGO Representative'
      case 'legal_aid_admin': return 'Legal Aid'
      default: return role
    }
  }

  const handleExportData = async () => {
    try {
      const adminToken = localStorage.getItem("safespace_admin_token")
      if (!adminToken) return

      const response = await fetch('/api/admin/dashboard/export', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
        },
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `safespace-data-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!admin) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SafeSpace Admin</span>
            </Link>
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              {getRoleDisplayName(admin.role)}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {admin.organization.name}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {admin.username}!
          </h1>
          <p className="text-gray-600">
            Manage ALL user reports and incidents from the test database
          </p>
        </div>

        {/* Metrics Overview */}
        {metrics && (
          <div className="grid md:grid-cols-1 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalCases}</div>
                <p className="text-xs text-muted-foreground">
                  All cases from test database
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Cases */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <FileText className="h-5 w-5 mr-2" />
                    Recent Cases
                  </CardTitle>
                  <Link href="/admin/cases">
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
                <CardDescription>
                  Latest cases from all users in test database
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentCases.length > 0 ? (
                  <div className="space-y-4">
                    {recentCases.map((case_) => (
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
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/admin/cases/${case_.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => router.push(`/admin/cases/${case_.id}/edit`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No cases yet</h3>
                    <p className="text-gray-600">Cases will appear here as they are submitted</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Organization Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium">{admin.organization.name}</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {admin.organization.type.replace('_', ' ')}
                    </p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Your Role</h5>
                    <p className="text-sm text-gray-600">{getRoleDisplayName(admin.role)}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Permissions</h5>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {admin.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 