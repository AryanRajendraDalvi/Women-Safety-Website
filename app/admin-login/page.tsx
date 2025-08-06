"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff, Building2, Users, Scale } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function AdminLoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    try {
      const response = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store admin token and data
        localStorage.setItem('safespace_admin_token', data.token)
        localStorage.setItem('safespace_admin_user', JSON.stringify(data.admin))
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (error) {
      console.error('Admin login error:', error)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <HomeButton />
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">NirbhayaSetu</span>
            </Link>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Portal</h1>
          <p className="text-gray-600 mt-2">Access for HR, NGOs, and Legal Aid organizations</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Administrator Login
            </CardTitle>
            <CardDescription className="text-center">
              Secure access to case management and support tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username or Email</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username or email"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600">
                Need help?{" "}
                <Link href="/help" className="text-blue-600 hover:text-blue-700 font-medium">
                  Contact Support
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Don't have an admin account?{" "}
                <Link href="/admin-register" className="text-blue-600 hover:text-blue-700 font-medium">
                  Create Admin Account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Role Information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">HR Administrators</h3>
            <p className="text-xs text-gray-600 mt-1">Manage workplace incidents</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">NGO Representatives</h3>
            <p className="text-xs text-gray-600 mt-1">Support and advocacy</p>
          </div>
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <Scale className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold text-sm">Legal Aid</h3>
            <p className="text-xs text-gray-600 mt-1">Legal assistance and guidance</p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 All admin actions are logged and monitored for security and compliance.
          </p>
        </div>
      </div>
    </div>
  )
} 