"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, FileText, Scale, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { HomeButton } from "@/components/HomeButton"
import { useLanguage } from "@/components/LanguageProvider"

export default function TermsPage() {
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
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("termsOfService")}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-600">Understanding your rights and responsibilities when using SafeSpace</p>
        </div>

        <div className="space-y-8">
          {/* Acceptance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By using SafeSpace, you agree to these terms of service. SafeSpace is designed to empower women with
                privacy-first tools for workplace safety documentation and support.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Scale className="h-6 w-6 mr-2 text-blue-600" />
                Service Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">SafeSpace provides:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Secure, encrypted incident logging tools</li>
                <li>AI-powered narrative assistance for formal complaints</li>
                <li>Resource hub with legal guides and NGO contacts</li>
                <li>Anonymous account creation and management</li>
                <li>Evidence vault for secure document storage</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-amber-600" />
                User Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">As a user, you agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Provide accurate information in your incident reports</li>
                <li>Use the platform for legitimate workplace safety purposes</li>
                <li>Respect the privacy and rights of others</li>
                <li>Not use the service for illegal activities</li>
                <li>Keep your password secure and confidential</li>
                <li>Understand that password recovery is impossible</li>
              </ul>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800">Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700 mb-4">
                SafeSpace is a documentation and resource tool. It does not provide legal advice or guarantee any
                specific outcomes. For legal matters, please consult with qualified legal professionals.
              </p>
              <p className="text-amber-700">
                In emergency situations, contact local authorities immediately rather than relying solely on this
                platform.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Questions About Terms?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-700 mb-4">
                If you have questions about these terms of service, please contact our support team.
              </p>
              <div className="flex space-x-4">
                <Link href="/help">
                  <Button className="bg-purple-600 hover:bg-purple-700">Contact Support</Button>
                </Link>
                <Link href="/privacy">
                  <Button variant="outline" className="bg-transparent">
                    View Privacy Policy
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
