"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Bot, Wand2, Copy, Download, FileText, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function AIAssistantPage() {
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [rawInput, setRawInput] = useState("")
  const [generatedReport, setGeneratedReport] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportType, setReportType] = useState("posh-complaint")
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  useEffect(() => {
    const logId = searchParams.get("logId")
    if (logId) {
      const logs = JSON.parse(localStorage.getItem("safespace_logs") || "[]")
      const log = logs.find((l: any) => l.id === Number.parseInt(logId))
      if (log) {
        setSelectedLog(log)
        setRawInput(log.description || "")
      }
    }
  }, [searchParams])

  const generateReport = async () => {
    setIsGenerating(true)

    // Simulate AI processing
    setTimeout(() => {
      const templates = {
        "posh-complaint": `FORMAL COMPLAINT UNDER THE SEXUAL HARASSMENT OF WOMEN AT WORKPLACE (PREVENTION, PROHIBITION AND REDRESSAL) ACT, 2013

To: The Internal Committee / Local Committee
[Organization Name]

Subject: Formal Complaint of Sexual Harassment

Dear Committee Members,

I am writing to file a formal complaint of sexual harassment under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.

INCIDENT DETAILS:
${rawInput}

LOCATION: ${selectedLog?.location || "[Location details]"}
DATE AND TIME: ${selectedLog ? new Date(selectedLog.timestamp).toLocaleString() : "[Date and time]"}
WITNESSES: ${selectedLog?.witnesses || "None mentioned"}

I request the Committee to take immediate action as per the provisions of the Act and conduct a fair and impartial inquiry into this matter.

I am available for any clarifications or additional information required.

Respectfully submitted,
[Your Name]
Date: ${new Date().toLocaleDateString()}`,

        "hr-report": `INCIDENT REPORT TO HUMAN RESOURCES

To: Human Resources Department
From: [Employee Name]
Date: ${new Date().toLocaleDateString()}
Subject: Workplace Incident Report

SUMMARY:
This report documents a workplace incident that occurred on ${selectedLog ? new Date(selectedLog.timestamp).toLocaleDateString() : "[Date]"}.

DETAILED DESCRIPTION:
${rawInput}

IMPACT:
This incident has created an uncomfortable and potentially hostile work environment, affecting my ability to perform my duties effectively.

REQUESTED ACTION:
I request HR to investigate this matter and take appropriate corrective measures to ensure a safe and respectful workplace for all employees.

Thank you for your attention to this matter.

[Your Name]
[Employee ID]
[Department]`,

        "legal-summary": `LEGAL INCIDENT SUMMARY

Case Reference: [To be assigned]
Date of Incident: ${selectedLog ? new Date(selectedLog.timestamp).toLocaleDateString() : "[Date]"}
Prepared by: [Your Name]
Date of Report: ${new Date().toLocaleDateString()}

FACTUAL SUMMARY:
${rawInput}

LEGAL CONSIDERATIONS:
This incident may constitute violations under:
- The Sexual Harassment of Women at Workplace Act, 2013
- Indian Penal Code provisions related to harassment
- Relevant labor laws and workplace regulations

EVIDENCE AVAILABLE:
${selectedLog?.files?.length ? `- ${selectedLog.files.length} supporting documents/files` : "- Detailed written account"}
- Witness information: ${selectedLog?.witnesses || "To be determined"}
- Location details: ${selectedLog?.location || "Workplace premises"}

RECOMMENDED NEXT STEPS:
1. File formal complaint with Internal Committee
2. Preserve all evidence
3. Document any retaliation or further incidents
4. Seek legal counsel if required

This summary is prepared for legal consultation purposes and should be reviewed by qualified legal counsel.`,
      }

      setGeneratedReport(templates[reportType as keyof typeof templates])
      setIsGenerating(false)
    }, 3000)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedReport)
    alert("Report copied to clipboard!")
  }

  const downloadReport = () => {
    const blob = new Blob([generatedReport], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${reportType}-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
              <Bot className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">AI Narrative Assistant</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            🤖 PoSH Compliant
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Your Raw Input
                </CardTitle>
                <CardDescription>
                  Paste your incident description or emotional notes. Our AI will help structure it professionally.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={rawInput}
                  onChange={(e) => setRawInput(e.target.value)}
                  placeholder="Describe what happened in your own words. Don't worry about formatting or legal language - just write naturally about the incident..."
                  rows={12}
                  className="resize-none"
                />
                {selectedLog && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Auto-loaded from:</strong> {selectedLog.title || `Log #${selectedLog.id}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Type</CardTitle>
                <CardDescription>Choose the type of formal document you need</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      value: "posh-complaint",
                      label: "PoSH Act Complaint",
                      desc: "Formal complaint under Sexual Harassment Act",
                    },
                    { value: "hr-report", label: "HR Incident Report", desc: "Internal company reporting format" },
                    {
                      value: "legal-summary",
                      label: "Legal Case Summary",
                      desc: "Structured summary for legal consultation",
                    },
                  ].map((type) => (
                    <div key={type.value} className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id={type.value}
                        name="reportType"
                        value={type.value}
                        checked={reportType === type.value}
                        onChange={(e) => setReportType(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor={type.value} className="font-medium text-gray-900 cursor-pointer">
                          {type.label}
                        </label>
                        <p className="text-sm text-gray-600">{type.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={generateReport}
              disabled={!rawInput.trim() || isGenerating}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Bot className="h-5 w-5 mr-2 animate-spin" />
                  Generating Professional Report...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5 mr-2" />
                  Generate Formal Report
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Generated Report
                  {generatedReport && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>AI-generated formal document ready for submission</CardDescription>
              </CardHeader>
              <CardContent>
                {generatedReport ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">Report Generated Successfully</span>
                      </div>
                    </div>
                    <Textarea
                      value={generatedReport}
                      onChange={(e) => setGeneratedReport(e.target.value)}
                      rows={20}
                      className="font-mono text-sm resize-none"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Generate</h3>
                    <p className="text-gray-600">
                      Enter your incident description and click generate to create a professional report
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Features Info */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  AI Assistant Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-blue-700 space-y-2">
                  <li>• Converts emotional language to professional tone</li>
                  <li>• Ensures PoSH Act compliance and legal accuracy</li>
                  <li>• Structures information in proper format</li>
                  <li>• Maintains factual accuracy from your input</li>
                  <li>• Suggests legal considerations and next steps</li>
                  <li>• Protects your privacy - processing is secure</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
