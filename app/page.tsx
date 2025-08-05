"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, FileText, Users, Globe, Zap, LogOut, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("safespace_user")
    const token = localStorage.getItem("safespace_token")
    
    if (userData && token) {
      setUser(JSON.parse(userData))
    }
    setIsLoading(false)
  }, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('safespace_token')
      if (token) {
        await fetch('/api/auth/logout', {
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
      localStorage.removeItem('safespace_user')
      localStorage.removeItem('safespace_token')
      setUser(null)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <span className="text-2xl font-bold text-gray-900">SafeSpace</span>
          </div>
          <div className="flex space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" onClick={handleLogout} className="flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-purple-600 hover:bg-purple-700">Get Started</Button>
                </Link>
                <Link href="/admin-login">
                  <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                    Admin Portal
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            {user ? `Welcome back, ${user.username}!` : "Your Privacy-First Digital Ally for Workplace Safety"}
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            {user 
              ? "Continue documenting incidents and building your evidence vault securely."
              : "Secure evidence logging, clear pathways to redressal, and fostering accountability in workplaces across India. Your identity remains protected, your voice stays strong."
            }
          </p>
          <div className="flex justify-center space-x-4">
            {user ? (
              <>
                <Link href="/log-incident">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-3">
                    Log New Incident
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                    Go to Dashboard
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/signup">
                  <Button size="lg" className="bg-purple-600 hover:bg-purple-700 px-8 py-3">
                    Start Logging Securely
                  </Button>
                </Link>
                <Link href="/resources">
                  <Button size="lg" variant="outline" className="px-8 py-3 bg-transparent">
                    Know Your Rights
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Built for Your Privacy & Security</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lock className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Anonymous & Secure</CardTitle>
                <CardDescription>
                  No email, no phone number. Just a username and password. All data encrypted on your device.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <FileText className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Evidence Logging</CardTitle>
                <CardDescription>
                  Document incidents with text, audio, photos, and files. Time-stamped and securely stored.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>AI-Powered Assistant</CardTitle>
                <CardDescription>
                  Convert raw entries into formal, PoSH-compliant complaint narratives with our AI assistant.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Expert Resources</CardTitle>
                <CardDescription>
                  Access curated legal guides, NGO contacts, and official communication templates.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Multilingual Support</CardTitle>
                <CardDescription>
                  Available in English, Hindi, Marathi, and Tamil. More languages coming soon.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Complete Control</CardTitle>
                <CardDescription>
                  You own your data. Delete permanently anytime. Share securely when you choose to.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-purple-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How SafeSpace Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Sign Up Anonymously</h3>
              <p className="text-gray-600 text-sm">Create account with just username and password</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Log Incidents</h3>
              <p className="text-gray-600 text-sm">Document evidence with our secure logging tools</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Generate Reports</h3>
              <p className="text-gray-600 text-sm">Use AI to create formal complaint narratives</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Take Action</h3>
              <p className="text-gray-600 text-sm">Share securely with authorities or legal support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-purple-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            {user ? "Ready to Document an Incident?" : "Ready to Take Control?"}
          </h2>
          <p className="text-xl mb-8 opacity-90">
            {user 
              ? "Keep building your evidence vault and stay protected."
              : "Join thousands of women who are building safer workplaces across India."
            }
          </p>
          {user ? (
            <Link href="/log-incident">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Log New Incident
              </Button>
            </Link>
          ) : (
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="px-8 py-3">
                Create Your Secure Account
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">SafeSpace</span>
              </div>
              <p className="text-gray-400 text-sm">Empowering women with privacy-first tools for workplace safety.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/log-incident" className="hover:text-white">
                    Log Incident
                  </Link>
                </li>
                <li>
                  <Link href="/resources" className="hover:text-white">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/emergency" className="hover:text-white">
                    Emergency Support
                  </Link>
                </li>
                <li>
                  <a href="tel:181" className="hover:text-white">
                    Women Helpline: 181
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-white">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/posh-act" className="hover:text-white">
                    PoSH Act Guide
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 SafeSpace. Built with privacy and security at its core.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
