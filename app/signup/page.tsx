"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, AlertTriangle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function SignupPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreedToWarning, setAgreedToWarning] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("english")
  const router = useRouter()
  const { language, setLanguage, t } = useLanguage()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords don't match!")
      return
    }
    if (!agreedToWarning) {
      alert("Please acknowledge the password recovery warning.")
      return
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password, 
          language: selectedLanguage 
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Store token and user data
        localStorage.setItem('safespace_token', data.token)
        localStorage.setItem('safespace_user', JSON.stringify(data.user))
        
        // Set the language in the provider
        setLanguage(selectedLanguage as any)
        
        router.push('/dashboard')
      } else {
        alert(data.error || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <HomeButton />
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">NirbhayaSetu</span>
            </Link>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{t("signup")}</h1>
          <p className="text-gray-600 mt-2">Anonymous. Secure. Private.</p>
        </div>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>No email or phone number required. Your privacy is our priority.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Language Selection */}
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <select
                  id="language"
                  value={selectedLanguage}
                  onChange={(e) => {
                    setSelectedLanguage(e.target.value)
                    setLanguage(e.target.value as any)
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="english">English</option>
                  <option value="hindi">हिंदी (Hindi)</option>
                  <option value="marathi">मराठी (Marathi)</option>
                  <option value="tamil">தமிழ் (Tamil)</option>
                </select>
              </div>

              {/* Username */}
              <div className="space-y-2">
                <Label htmlFor="username">{t("username")}</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a unique username"
                  required
                  className="focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    required
                    className="focus:ring-purple-500 focus:border-purple-500 pr-10"
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

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="focus:ring-purple-500 focus:border-purple-500 pr-10"
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

              {/* Critical Warning */}
              <Alert className="border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>CRITICAL WARNING:</strong> We do not store your personal information. If you forget your
                  password, account recovery is impossible. Please store your password safely in a secure password
                  manager.
                </AlertDescription>
              </Alert>

              {/* Agreement Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="warning-agreement"
                  checked={agreedToWarning}
                  onCheckedChange={(checked) => setAgreedToWarning(checked as boolean)}
                />
                <Label htmlFor="warning-agreement" className="text-sm leading-5">
                  I understand and acknowledge that password recovery is impossible. I will store my password securely.
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={!agreedToWarning}>
                {t("signup")}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-purple-600 hover:text-purple-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 All data is encrypted on your device before transmission. We cannot access your logs or personal
            information.
          </p>
        </div>
      </div>
    </div>
  )
}
