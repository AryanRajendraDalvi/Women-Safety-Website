"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Plus,
  FileText,
  Folder,
  Bot,
  BookOpen,
  Settings,
  LogOut,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [recentLogs, setRecentLogs] = useState<any[]>([])
  const router = useRouter()
  const { t } = useLanguage()

  useEffect(() => {
    const userData = localStorage.getItem("safespace_user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Load recent logs from localStorage
    const logs = JSON.parse(localStorage.getItem("safespace_logs") || "[]")
    setRecentLogs(logs.slice(-3).reverse()) // Show last 3 logs
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("safespace_user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <HomeButton />
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">SafeSpace</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {t("welcome")}, {user.username}
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
                  <Clock className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Your latest log entries</CardDescription>
              </CardHeader>
              <CardContent>
                {recentLogs.length > 0 ? (
                  <div className="space-y-4">
                    {recentLogs.map((log, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <FileText className="h-5 w-5 text-purple-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{log.title || "Incident Log"}</h4>
                          <p className="text-sm text-gray-600 mt-1">{log.description?.substring(0, 100)}...</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant={log.severity === "high" ? "destructive" : "secondary"}>
                          {log.severity || "medium"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No logs yet</h3>
                    <p className="text-gray-600 mb-4">Start by creating your first incident log</p>
                    <Link href="/log-incident">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Create First Log
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Security Status & Quick Links */}
          <div className="space-y-6">
            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encryption</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Anonymous Mode</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Enabled
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Backup</span>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Local Only
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Emergency Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <span>National Women Helpline</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <span>Legal Aid Services</span>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <span>Crisis Counseling</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Link href="/settings">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Settings
                  </CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
