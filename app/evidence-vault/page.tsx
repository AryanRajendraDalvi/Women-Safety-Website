"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Shield, ArrowLeft, Search, Calendar, FileText, Trash2, Eye, Download, Share, Plus } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function EvidenceVaultPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [selectedLog, setSelectedLog] = useState<any>(null)

  const { t } = useLanguage()

  useEffect(() => {
    const savedLogs = JSON.parse(localStorage.getItem("safespace_logs") || "[]")
    setLogs(savedLogs.reverse()) // Show newest first
  }, [])

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === "all" || log.severity === filterSeverity
    return matchesSearch && matchesSeverity
  })

  const deleteLog = (logId: number) => {
    if (confirm("Are you sure you want to permanently delete this log? This action cannot be undone.")) {
      const updatedLogs = logs.filter((log) => log.id !== logId)
      setLogs(updatedLogs)
      localStorage.setItem("safespace_logs", JSON.stringify(updatedLogs.reverse()))
      setSelectedLog(null)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
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
              <Shield className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("evidenceVault")}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              🔒 {logs.length} {t("encrypted")} Logs
            </Badge>
            <Link href="/log-incident">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                New Log
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Logs List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search your logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={filterSeverity}
                    onChange={(e) => setFilterSeverity(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">All Severity</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Logs */}
            {filteredLogs.length > 0 ? (
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <Card
                    key={log.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedLog?.id === log.id ? "ring-2 ring-purple-500" : ""
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{log.title || `Incident Log #${log.id}`}</CardTitle>
                          <CardDescription className="mt-1">{log.description?.substring(0, 150)}...</CardDescription>
                        </div>
                        <Badge className={getSeverityColor(log.severity)}>{log.severity}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(log.timestamp).toLocaleDateString()}
                          </div>
                          {log.location && <span>📍 {log.location}</span>}
                          {log.files?.length > 0 && <span>📎 {log.files.length} files</span>}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedLog(log)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteLog(log.id)
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || filterSeverity !== "all" ? "No matching logs found" : "No logs yet"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || filterSeverity !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "Start documenting incidents to build your evidence vault"}
                  </p>
                  <Link href="/log-incident">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Log
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Log Details Sidebar */}
          <div className="space-y-6">
            {selectedLog ? (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Log Details
                      <Badge className={getSeverityColor(selectedLog.severity)}>{selectedLog.severity}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        {selectedLog.title || `Incident Log #${selectedLog.id}`}
                      </h4>
                      <p className="text-sm text-gray-600">{selectedLog.description}</p>
                    </div>

                    {selectedLog.location && (
                      <div>
                        <h5 className="font-medium text-gray-700">Location</h5>
                        <p className="text-sm text-gray-600">{selectedLog.location}</p>
                      </div>
                    )}

                    {selectedLog.witnesses && (
                      <div>
                        <h5 className="font-medium text-gray-700">Witnesses</h5>
                        <p className="text-sm text-gray-600">{selectedLog.witnesses}</p>
                      </div>
                    )}

                    <div>
                      <h5 className="font-medium text-gray-700">Timestamp</h5>
                      <p className="text-sm text-gray-600">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                    </div>

                    {selectedLog.files?.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-700">Attached Files</h5>
                        <div className="space-y-1">
                          {selectedLog.files.map((file: string, index: number) => (
                            <p key={index} className="text-sm text-gray-600">
                              📎 {file}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link href={`/ai-assistant?logId=${selectedLog.id}`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">Generate Formal Report</Button>
                    </Link>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Share className="h-4 w-4 mr-2" />
                      Create Secure Share Link
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export Evidence Package
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={() => deleteLog(selectedLog.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Permanently
                    </Button>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Select a Log</h3>
                  <p className="text-sm text-gray-600">Click on any log to view details and available actions</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
