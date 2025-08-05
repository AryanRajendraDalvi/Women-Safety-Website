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
  ArrowLeft,
  Filter,
  Calendar,
  User,
  Activity
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"

interface AuditLog {
  id: string
  adminId: string
  adminName: string
  action: string
  resourceType: string
  details: any
  timestamp: string
  ipAddress?: string
}

export default function AdminAuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("")
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

    fetchAuditLogs(adminToken)
  }, [router, currentPage, searchTerm, actionFilter])

  const fetchAuditLogs = async (token: string) => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(actionFilter && { action: actionFilter })
      })

      const response = await fetch(`/api/admin/audit-logs?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAuditLogs(data.logs)
        setTotalPages(data.pagination.pages)
      } else if (response.status === 401) {
        localStorage.removeItem('safespace_admin_token')
        localStorage.removeItem('safespace_admin_user')
        router.push('/admin-login')
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login': return 'bg-green-100 text-green-800'
      case 'logout': return 'bg-gray-100 text-gray-800'
      case 'view_cases': return 'bg-blue-100 text-blue-800'
      case 'edit_case': return 'bg-yellow-100 text-yellow-800'
      case 'delete_case': return 'bg-red-100 text-red-800'
      case 'forward_case': return 'bg-purple-100 text-purple-800'
      case 'export_data': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatAction = (action: string) => {
    return action.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading audit logs...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Logs</h1>
          <p className="text-gray-600">Track all administrative actions and system activities</p>
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
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Search</label>
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Action Type</label>
                <select
                  value={actionFilter}
                  onChange={(e) => setActionFilter(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">All Actions</option>
                  <option value="login">Login</option>
                  <option value="logout">Logout</option>
                  <option value="view_cases">View Cases</option>
                  <option value="edit_case">Edit Case</option>
                  <option value="delete_case">Delete Case</option>
                  <option value="forward_case">Forward Case</option>
                  <option value="export_data">Export Data</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearchTerm("")
                    setActionFilter("")
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

        {/* Audit Logs List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Audit Logs ({auditLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {auditLogs.length > 0 ? (
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge className={getActionColor(log.action)}>
                          {formatAction(log.action)}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          <span className="font-medium">Admin:</span> {log.adminName}
                        </p>
                        <p className="text-sm">
                          <span className="font-medium">Resource:</span> {log.resourceType}
                        </p>
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="text-sm">
                            <span className="font-medium">Details:</span>
                            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </div>
                        )}
                        {log.ipAddress && (
                          <p className="text-sm text-gray-500">
                            IP: {log.ipAddress}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs found</h3>
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