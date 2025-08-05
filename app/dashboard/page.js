"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Plus, Folder, Bot, BookOpen, Settings, LogOut, User, Calendar, TrendingUp, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"
import { apiService } from "@/lib/api"

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [recentLogs, setRecentLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setIsLoading(true)
      
      // Load user data
      const userResponse = await apiService.getCurrentUser()
      setUser(userResponse.user)
      
      // Load recent incidents
      const incidentsResponse = await apiService.getIncidents()
      setRecentLogs(incidentsResponse.slice(0, 5)) // Get latest 5
      
    } catch (error) {
      if (error.message.includes('Invalid token') || error.message.includes('Access denied')) {
        // Token expired or invalid, redirect to login
        apiService.clearToken()
        router.push('/login')
        return
      }
      setError("Failed to load dashboard data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    apiService.clearToken()
    router.push('/')
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your secure dashboard...</p>
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
            <HomeButton />
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">SafeSpace</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{user?.username}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("yourSecureDashboard")}</h1>
          <p className="text-gray-600">{t("dashboardDesc")}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link href="/log-incident">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Plus className="h-8 w-8 text-purple-600" />
                  <Badge variant="secondary">New</Badge>
                </div>
                <CardTitle className="text-lg">{t("logIncident")}</CardTitle>
                <CardDescription>Create a new secure log entry</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/evidence-vault">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Folder className="h-8 w-8 text-purple-600" />
                  <Badge variant="outline">{recentLogs.length}</Badge>
                </div>
                <CardTitle className="text-lg">{t("evidenceVault")}</CardTitle>
                <CardDescription>View and manage your logs</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/ai-assistant">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Bot className="h-8 w-8 text-purple-600" />
                  <Badge variant="secondary">AI</Badge>
                </div>
                <CardTitle className="text-lg">AI Assistant</CardTitle>
                <CardDescription>Generate formal complaints</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/resources">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <BookOpen className="h-8 w-8 text-purple-600" />
                  <Badge variant="outline">Guide</Badge>
                </div>
                <CardTitle className="text-lg">{t("resources")}</CardTitle>
                <CardDescription>Legal guides and contacts</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No incidents logged yet</p>
                    <p className="text-sm">Start by logging your first incident</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentLogs.map((log) => (
                      <div key={log._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{log.title}</h4>
                          <p className="text-sm text-gray-600">{log.description.substring(0, 100)}...</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDate(log.timestamp)}
                            </span>
                          </div>
                        </div>
                        <Link href={`/evidence-vault`}>
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Stats and Quick Actions */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Your Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Logs</span>
                  <span className="font-semibold">{recentLogs.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Month</span>
                  <span className="font-semibold">
                    {recentLogs.filter(log => {
                      const logDate = new Date(log.timestamp)
                      const now = new Date()
                      return logDate.getMonth() === now.getMonth() && 
                             logDate.getFullYear() === now.getFullYear()
                    }).length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">High Priority</span>
                  <span className="font-semibold text-red-600">
                    {recentLogs.filter(log => log.severity === 'high').length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/log-incident">
                  <Button variant="outline" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Log New Incident
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button variant="outline" className="w-full justify-start">
                    <Bot className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View Resources
                  </Button>
                </Link>
                <Link href="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-sm text-green-900 flex items-center">
                  <Shield className="h-4 w-4 mr-2" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-green-800 space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    All data encrypted
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Secure connection
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Privacy protected
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