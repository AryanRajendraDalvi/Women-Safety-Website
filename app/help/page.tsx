"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText, Shield } from "lucide-react"
import Link from "next/link"
import { HomeButton } from "@/components/HomeButton"
import { useLanguage } from "@/components/LanguageProvider"

export default function HelpPage() {
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
              <HelpCircle className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("helpCenter")}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-gray-600">Find answers to common questions and get support</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">How secure is my data?</h4>
                <p className="text-sm text-gray-600">
                  All your data is encrypted on your device before being stored. We use zero-knowledge architecture.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Can I recover my password?</h4>
                <p className="text-sm text-gray-600">
                  No, password recovery is impossible by design to maintain your anonymity and security.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Is my identity protected?</h4>
                <p className="text-sm text-gray-600">
                  Yes, we don't collect any personal information. Only your chosen username is stored.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Contact Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <Mail className="h-4 w-4 mr-2" />
                Email Support
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Call Support
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Section */}
        <Card className="mt-8 border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              {t("emergencySupport")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">If you're in immediate danger, contact emergency services:</p>
            <div className="flex space-x-4">
              <Button variant="destructive">
                <Phone className="h-4 w-4 mr-2" />
                Police: 100
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                {t("womenHelpline")}: 181
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
