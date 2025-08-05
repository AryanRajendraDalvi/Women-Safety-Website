"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, BookOpen, Phone, Download, Search, MapPin, Scale, Users, FileText, Globe } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"
import { HomeButton } from "@/components/HomeButton"

export default function ResourcesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const { t, language, setLanguage } = useLanguage()

  const legalGuides = [
    {
      title: "Understanding the PoSH Act 2013",
      description: "Complete guide to Sexual Harassment of Women at Workplace Act",
      type: "Legal Guide",
      downloadUrl: "#",
    },
    {
      title: "Filing a Complaint: Step-by-Step",
      description: "How to file formal complaints with Internal Committees",
      type: "Process Guide",
      downloadUrl: "#",
    },
    {
      title: "Know Your Rights at Workplace",
      description: "Comprehensive overview of women's workplace rights in India",
      type: "Rights Guide",
      downloadUrl: "#",
    },
    {
      title: "Evidence Collection Best Practices",
      description: "How to document and preserve evidence effectively",
      type: "Documentation Guide",
      downloadUrl: "#",
    },
  ]

  const emergencyContacts = [
    {
      name: "National Women Helpline",
      number: "181",
      description: "24/7 helpline for women in distress",
      type: "Emergency",
    },
    {
      name: "Women Helpline (Police)",
      number: "1091",
      description: "Police helpline for women's safety",
      type: "Emergency",
    },
    {
      name: "Legal Aid Services",
      number: "15100",
      description: "Free legal aid and consultation",
      type: "Legal",
    },
  ]

  const ngoContacts = [
    {
      name: "Sakshi - Delhi",
      phone: "+91-11-26692700",
      email: "info@sakshi-india.org",
      city: "Delhi",
      services: "Legal aid, counseling, workplace harassment support",
    },
    {
      name: "Majlis - Mumbai",
      phone: "+91-22-26661252",
      email: "majlis@vsnl.com",
      city: "Mumbai",
      services: "Legal support, women's rights advocacy",
    },
    {
      name: "Vimochana - Bangalore",
      phone: "+91-80-25492781",
      email: "vimochana@gmail.com",
      city: "Bangalore",
      services: "Counseling, legal aid, workplace issues",
    },
    {
      name: "Swayam - Kolkata",
      phone: "+91-33-24799822",
      email: "swayam@cal2.vsnl.net.in",
      city: "Kolkata",
      services: "Women's rights, legal support, counseling",
    },
    {
      name: "Parivartan - Chennai",
      phone: "+91-44-24640035",
      email: "parivartan.chennai@gmail.com",
      city: "Chennai",
      services: "Workplace harassment, legal guidance",
    },
  ]

  const templates = [
    {
      name: "PoSH Complaint Template",
      description: "Standard format for filing sexual harassment complaints",
      type: "Legal Document",
    },
    {
      name: "HR Incident Report Template",
      description: "Template for reporting incidents to HR department",
      type: "Internal Report",
    },
    {
      name: "Evidence Documentation Sheet",
      description: "Structured format for documenting evidence",
      type: "Documentation",
    },
    {
      name: "Witness Statement Template",
      description: "Format for collecting witness statements",
      type: "Legal Document",
    },
  ]

  const filteredNGOs = ngoContacts.filter((ngo) => {
    const matchesSearch =
      ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.services.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCity = selectedCity === "all" || ngo.city === selectedCity
    return matchesSearch && matchesCity
  })

  const cities = ["all", ...Array.from(new Set(ngoContacts.map((ngo) => ngo.city)))]

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
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">{t("resources")} Hub</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-gray-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="english">English</option>
              <option value="hindi">हिंदी</option>
              <option value="marathi">मराठी</option>
              <option value="tamil">தமிழ்</option>
            </select>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-red-800 mb-2">Emergency Support</h2>
                <p className="text-red-700">If you're in immediate danger, contact emergency services</p>
              </div>
              <div className="flex space-x-4">
                <Button variant="destructive" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Call 100 (Police)
                </Button>
                <Button variant="outline" className="border-red-300 text-red-700 bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Women Helpline 181
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Legal Guides */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Scale className="h-6 w-6 mr-2 text-purple-600" />
                {t("knowYourRights")}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {legalGuides.map((guide, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{guide.title}</CardTitle>
                          <CardDescription className="mt-2">{guide.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{guide.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Guide
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* NGO Directory */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Users className="h-6 w-6 mr-2 text-purple-600" />
                  NGO & Legal Aid Directory
                </h2>
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search organizations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city === "all" ? "All Cities" : city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {filteredNGOs.map((ngo, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{ngo.name}</CardTitle>
                          <div className="flex items-center mt-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 mr-1" />
                            {ngo.city}
                          </div>
                        </div>
                        <Badge variant="secondary">Verified</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-600">{ngo.services}</p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2 text-green-600" />
                          <span className="text-sm font-medium">{ngo.phone}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600">{ngo.email}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                          Get Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Document Templates */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="h-6 w-6 mr-2 text-purple-600" />
                Document Templates
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {templates.map((template, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription className="mt-2">{template.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{template.type}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          Preview
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Contacts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <Phone className="h-5 w-5 mr-2" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-gray-900">{contact.name}</h4>
                      <Badge variant={contact.type === "Emergency" ? "destructive" : "secondary"}>{contact.type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                    <Button
                      size="sm"
                      className="w-full"
                      variant={contact.type === "Emergency" ? "destructive" : "outline"}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Call {contact.number}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  Language Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  All resources are available in multiple languages to ensure accessibility.
                </p>
                <div className="space-y-2">
                  {["English", "हिंदी (Hindi)", "मराठी (Marathi)", "தமிழ் (Tamil)"].map((lang, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{lang}</span>
                      <Badge variant="secondary">Available</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/log-incident">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Log New Incident</Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button variant="outline" className="w-full bg-transparent">
                    Generate Report
                  </Button>
                </Link>
                <Button variant="outline" className="w-full bg-transparent">
                  Find Nearby Legal Aid
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
