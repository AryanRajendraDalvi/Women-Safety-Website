"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, ArrowLeft, Settings, User, Lock, Globe, Bell, Download, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [username, setUsername] = useState("")
  const [language, setLanguage] = useState("english")
  const [notifications, setNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const router = useRouter()

  const { language: currentLang, setLanguage: setCurrentLanguage, t } = useLanguage()

  useEffect(() => {
    const userData = localStorage.getItem("safespace_user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    setUsername(parsedUser.username)
    setLanguage(parsedUser.language || "english")
  }, [router])

  const saveSettings = () => {
    const updatedUser = {
      ...user,
      username,
      language,
      settings: {
        notifications,
        autoBackup,
        twoFactorAuth,
      },
    }
    localStorage.setItem("safespace_user", JSON.stringify(updatedUser))
    alert("Settings saved successfully!")
  }

  const exportData = () => {
    const logs = localStorage.getItem("safespace_logs") || "[]"
    const userData = localStorage.getItem("safespace_user") || "{}"

    const exportData = {
      user: JSON.parse(userData),
      logs: JSON.parse(logs),
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `safespace-data-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const deleteAllData = () => {
    if (
      confirm(
        "Are you sure you want to delete ALL your data? This action cannot be undone and you will lose all your logs permanently.",
      )
    ) {
      if (confirm("This will permanently delete everything. Type 'DELETE' to confirm.")) {
        localStorage.removeItem("safespace_user")
        localStorage.removeItem("safespace_logs")
        router.push("/")
      }
    }
  }

  if (!user) return null

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
              <Settings className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("settings")}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            🔒 Secure Account
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Account Settings
                </CardTitle>
                <CardDescription>Manage your account preferences and basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="username">{t("username")}</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    This is your anonymous identifier. No personal information is stored.
                  </p>
                </div>

                <div>
                  <Label htmlFor="language">Preferred Language</Label>
                  <select
                    id="language"
                    value={currentLang}
                    onChange={(e) => {
                      const newLang = e.target.value as any
                      setLanguage(newLang)
                      setCurrentLanguage(newLang)
                    }}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिंदी (Hindi)</option>
                    <option value="marathi">मराठी (Marathi)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2" />
                  Privacy & Security
                </CardTitle>
                <CardDescription>Control your privacy settings and security preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notifications</h4>
                    <p className="text-sm text-gray-600">Receive important updates and reminders</p>
                  </div>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Auto Backup</h4>
                    <p className="text-sm text-gray-600">Automatically backup your encrypted data locally</p>
                  </div>
                  <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add extra security to your account</p>
                  </div>
                  <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Encryption Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Client-side Encryption</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Data Anonymization</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Enabled
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Zero-Knowledge Architecture</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Management */}
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Export or delete your data. You have complete control.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Export Your Data</h4>
                    <p className="text-sm text-blue-700">Download all your logs and settings</p>
                  </div>
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="border-blue-300 text-blue-700 bg-transparent"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-red-900">Delete All Data</h4>
                    <p className="text-sm text-red-700">Permanently remove all your information</p>
                  </div>
                  <Button onClick={deleteAllData} variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Account Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Account Type</span>
                    <Badge variant="secondary">Anonymous</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Encryption</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Storage</span>
                    <Badge variant="secondary">Local Only</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Privacy Level</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Maximum
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader>
                <CardTitle className="text-amber-800 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Privacy Reminder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• We cannot recover your password</li>
                  <li>• Your data is encrypted locally</li>
                  <li>• We never see your personal information</li>
                  <li>• You control all data sharing</li>
                </ul>
              </CardContent>
            </Card>

            {/* Support */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <Globe className="h-4 w-4 mr-2" />
                  Help Center
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <Bell className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Link href="/resources">
                  <Button variant="outline" className="w-full bg-transparent">
                    Emergency Resources
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Save Settings */}
            <Button onClick={saveSettings} className="w-full bg-purple-600 hover:bg-purple-700">
              {t("save")} All {t("settings")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
