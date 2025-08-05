"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Eye, EyeOff, Building2, Users, Scale, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"
import { apiService } from "@/lib/api"

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    organizationName: "",
    organizationType: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const { t } = useLanguage()

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (!formData.role) {
      setError("Please select a role")
      return false
    }
    if (!formData.organizationName || !formData.organizationType) {
      setError("Organization details are required")
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const response = await apiService.adminRegister({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        organization: {
          name: formData.organizationName,
          type: formData.organizationType
        }
      })

      if (response.data) {
        setSuccess("Admin account created successfully! You can now login.")
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "",
          organizationName: "",
          organizationType: ""
        })
      } else {
        setError(response.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Admin registration error:', error)
      setError('Registration failed. Please try again.')
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
              <span className="text-2xl font-bold text-gray-900">SafeSpace</span>
            </Link>
            <div className="w-20"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Registration</h1>
          <p className="text-gray-600 mt-2">Create new administrator accounts</p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Shield className="h-6 w-6 mr-2 text-blue-600" />
              Create Admin Account
            </CardTitle>
            <CardDescription className="text-center">
              Register new administrators for your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
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
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm password"
                    required
                    className="focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                  <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hr_admin">HR Administrator</SelectItem>
                    <SelectItem value="ngo_admin">NGO Representative</SelectItem>
                    <SelectItem value="legal_aid_admin">Legal Aid Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange("organizationName", e.target.value)}
                  placeholder="Enter organization name"
                  required
                  className="focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizationType">Organization Type</Label>
                <Select value={formData.organizationType} onValueChange={(value) => handleInputChange("organizationType", value)}>
                  <SelectTrigger className="focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select organization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporation">Corporation</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="legal_firm">Legal Firm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                href="/admin-login" 
                className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Admin Login
              </Link>
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
      </div>
    </div>
  )
} 