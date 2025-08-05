"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Shield, Lock, Eye, Database, UserX } from "lucide-react"
import Link from "next/link"
import { HomeButton } from "@/components/HomeButton"
import { useLanguage } from "@/components/LanguageProvider"

export default function PrivacyPage() {
  const { t } = useLanguage()

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
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("privacyPolicy")}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-gray-600">Your privacy is our highest priority. Here's how we protect it.</p>
        </div>

        <div className="space-y-8">
          {/* Zero Knowledge */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-green-600">
                <UserX className="h-6 w-6 mr-2" />
                Zero Personal Information Collection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                SafeSpace operates on a zero-knowledge architecture. We do not collect, store, or have access to any of
                your personal information including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Email addresses</li>
                <li>Phone numbers</li>
                <li>Real names or identities</li>
                <li>Location data</li>
                <li>Device information</li>
                <li>IP addresses</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Only your chosen username is stored, which serves as your anonymous identifier.
              </p>
            </CardContent>
          </Card>

          {/* Client-Side Encryption */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-blue-600">
                <Lock className="h-6 w-6 mr-2" />
                Client-Side Encryption
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                All your data is encrypted on your device before it ever leaves your control:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Incident logs are encrypted using AES-256 encryption</li>
                <li>Files and media are encrypted before upload</li>
                <li>We cannot decrypt or access your data</li>
                <li>Encryption keys are generated and stored locally on your device</li>
                <li>Even our servers cannot read your information</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Storage */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-purple-600">
                <Database className="h-6 w-6 mr-2" />
                Data Storage & Control
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">You have complete control over your data:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Data is stored locally on your device by default</li>
                <li>You can export all your data at any time</li>
                <li>Permanent deletion removes data immediately and irreversibly</li>
                <li>No data backups are kept after deletion</li>
                <li>You control who can access your information</li>
              </ul>
            </CardContent>
          </Card>

          {/* No Tracking */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Eye className="h-6 w-6 mr-2" />
                No Tracking or Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">We do not track your behavior or collect analytics:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>No cookies for tracking purposes</li>
                <li>No behavioral analytics</li>
                <li>No third-party tracking scripts</li>
                <li>No usage pattern analysis</li>
                <li>No advertising or marketing data collection</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Questions About Privacy?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-4">
                If you have any questions about our privacy practices, please contact us. We're committed to
                transparency and protecting your rights.
              </p>
              <div className="flex space-x-4">
                <Link href="/help">
                  <Button className="bg-purple-600 hover:bg-purple-700">Contact Support</Button>
                </Link>
                <Link href="/terms">
                  <Button variant="outline" className="bg-transparent">
                    View Terms of Service
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
