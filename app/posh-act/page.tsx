"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Scale, FileText, Users, AlertCircle, Download } from "lucide-react"
import Link from "next/link"
import { HomeButton } from "@/components/HomeButton"
import { useLanguage } from "@/components/LanguageProvider"

export default function PoshActPage() {
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
              <Scale className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("poshActGuide")}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Legal Guide
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">PoSH Act 2013 Guide</h1>
          <p className="text-gray-600">Understanding the Sexual Harassment of Women at Workplace Act</p>
        </div>

        <div className="space-y-8">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-blue-600" />
                What is the PoSH Act?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 is a
                comprehensive law that protects women from sexual harassment at their workplace.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Key Objectives:</h4>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Prevention of sexual harassment</li>
                  <li>Prohibition of such acts</li>
                  <li>Redressal and rehabilitation of victims</li>
                  <li>Creating safe work environments</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* What Constitutes Sexual Harassment */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-6 w-6 mr-2 text-red-600" />
                What Constitutes Sexual Harassment?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Sexual harassment includes any unwelcome act or behavior (whether directly or by implication):
              </p>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-medium text-red-900 mb-2">Physical Contact and Advances:</h4>
                  <ul className="list-disc list-inside space-y-1 text-red-800">
                    <li>Unwelcome physical contact or advances</li>
                    <li>Physically blocking someone's path</li>
                    <li>Inappropriate touching</li>
                  </ul>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-medium text-orange-900 mb-2">Verbal or Non-verbal Conduct:</h4>
                  <ul className="list-disc list-inside space-y-1 text-orange-800">
                    <li>Sexually colored remarks</li>
                    <li>Showing pornography</li>
                    <li>Sexual jokes or comments</li>
                    <li>Unwelcome sexual advances or requests</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 mb-2">Quid Pro Quo:</h4>
                  <ul className="list-disc list-inside space-y-1 text-yellow-800">
                    <li>Implied or explicit promise of preferential treatment</li>
                    <li>Threat of detrimental treatment in employment</li>
                    <li>Creating hostile work environment</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Internal Committee */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-green-600" />
                Internal Committee (IC)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Every workplace with 10 or more employees must constitute an Internal Committee:
              </p>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">IC Composition:</h4>
                <ul className="list-disc list-inside space-y-1 text-green-800">
                  <li>Presiding Officer (senior woman employee)</li>
                  <li>Two employees committed to women's causes</li>
                  <li>One external member from NGO or familiar with women's issues</li>
                  <li>At least half the members should be women</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Filing a Complaint */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-6 w-6 mr-2 text-purple-600" />
                How to File a Complaint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Step 1: Written Complaint</h4>
                  <p className="text-purple-800">
                    Submit a written complaint to the Internal Committee within 3 months of the incident.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Step 2: Investigation</h4>
                  <p className="text-purple-800">
                    The IC will conduct an inquiry within 90 days of receiving the complaint.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-medium text-purple-900 mb-2">Step 3: Resolution</h4>
                  <p className="text-purple-800">The IC will provide recommendations for action to the employer.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-800">Your Rights Under PoSH Act</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Right to a safe and secure work environment
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Right to file a complaint without fear of retaliation
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Right to confidentiality during the inquiry process
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Right to interim relief during the inquiry
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Right to appeal against the IC's decision
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Download Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Download Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                <Download className="h-4 w-4 mr-2" />
                Download Complete PoSH Act Guide
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Complaint Template
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Know Your Rights Checklist
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
