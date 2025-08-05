"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, FileText, Shield, Copy, Check } from "lucide-react"
import Link from "next/link"
import { HomeButton } from "@/components/HomeButton"
import { useLanguage } from "@/components/LanguageProvider"

export default function HelpPage() {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)
  const { t } = useLanguage()

  const supportEmail = "support@safespace.org"
  const supportPhone = "+91-1800-123-4567"

  const handleEmailSupport = () => {
    // Copy email to clipboard
    navigator.clipboard.writeText(supportEmail).then(() => {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = supportEmail
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    })
  }

  const handleOpenEmailClient = () => {
    const subject = encodeURIComponent("SafeSpace Support Request")
    const body = encodeURIComponent(`Hello SafeSpace Support Team,

I need assistance with the following:

[Please describe your issue here]

Thank you,
[Your username]`)
    
    window.open(`mailto:${supportEmail}?subject=${subject}&body=${body}`, '_self')
  }

  const handleCallSupport = () => {
    // Copy phone number to clipboard
    navigator.clipboard.writeText(supportPhone).then(() => {
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = supportPhone
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedPhone(true)
      setTimeout(() => setCopiedPhone(false), 2000)
    })
  }

  const handleLiveChat = () => {
    // Open a modal or redirect to live chat
    alert("Live chat feature coming soon! For now, please use email or phone support.")
  }

  const handleEmergencyCall = (number: string, service: string) => {
    if (confirm(`Are you sure you want to call ${service}? This will initiate a phone call.`)) {
      window.open(`tel:${number}`, '_self')
    }
  }

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
                  All your data is encrypted on your device before being stored. We use zero-knowledge architecture, meaning we cannot access your information.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Can I recover my password?</h4>
                <p className="text-sm text-gray-600">
                  No, password recovery is impossible by design to maintain your anonymity and security. Please store your password safely.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Is my identity protected?</h4>
                <p className="text-sm text-gray-600">
                  Yes, we don't collect any personal information. Only your chosen username is stored, and no email or phone number is required.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">How do I export my data?</h4>
                <p className="text-sm text-gray-600">
                  Go to Settings → Data Management → Export Data. This will download all your logs and settings as a JSON file.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">What languages are supported?</h4>
                <p className="text-sm text-gray-600">
                  SafeSpace supports English, Hindi, Marathi, and Tamil. You can change your language preference in Settings.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">How do I delete my account?</h4>
                <p className="text-sm text-gray-600">
                  Go to Settings → Data Management → Delete All Data. This will permanently remove all your information.
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
              <Button 
                onClick={handleEmailSupport}
                className="w-full justify-start bg-purple-600 hover:bg-purple-700"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Email Copied!
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </>
                )}
              </Button>
              <Button 
                onClick={handleOpenEmailClient}
                variant="outline" 
                className="w-full justify-start bg-transparent"
              >
                <Mail className="h-4 w-4 mr-2" />
                Open Email Client
              </Button>
              <Button 
                onClick={handleCallSupport}
                variant="outline" 
                className="w-full justify-start bg-transparent"
              >
                {copiedPhone ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Phone Copied!
                  </>
                ) : (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Support
                  </>
                )}
              </Button>
              <Button 
                onClick={handleLiveChat}
                variant="outline" 
                className="w-full justify-start bg-transparent"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Live Chat
              </Button>
              
              {/* Contact Information Display */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Contact Information:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Email:</strong> {supportEmail}</p>
                  <p><strong>Phone:</strong> {supportPhone}</p>
                  <p><strong>Hours:</strong> Mon-Fri 9 AM - 6 PM IST</p>
                </div>
              </div>
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
              <Button variant="destructive" onClick={() => handleEmergencyCall("100", "Police")}>
                <Phone className="h-4 w-4 mr-2" />
                Police: 100
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 bg-transparent" onClick={() => handleEmergencyCall("181", "Women's Helpline")}>
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
