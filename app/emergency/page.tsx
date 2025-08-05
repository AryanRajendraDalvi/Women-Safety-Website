"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, AlertTriangle, Phone, MapPin, Clock, Shield } from "lucide-react"
import Link from "next/link"
import { HomeButton } from "@/components/HomeButton"
import { useLanguage } from "@/components/LanguageProvider"

export default function EmergencyPage() {
  const { t } = useLanguage()

  const emergencyContacts = [
    { name: "Police Emergency", number: "100", description: "Immediate police assistance", urgent: true },
    { name: "Women Helpline", number: "181", description: "24/7 support for women in distress", urgent: true },
    {
      name: "Women Helpline (Police)",
      number: "1091",
      description: "Police helpline for women's safety",
      urgent: true,
    },
    { name: "Legal Aid Services", number: "15100", description: "Free legal aid and consultation", urgent: false },
    {
      name: "National Commission for Women",
      number: "011-26944880",
      description: "Women's rights and complaints",
      urgent: false,
    },
  ]

  return (
    <div className="min-h-screen bg-red-50">
      {/* Header */}
      <header className="bg-red-600 text-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <HomeButton />
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-red-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("back")} to {t("dashboard")}
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-6 w-6" />
              <span className="text-xl font-bold">{t("emergencySupport")}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white text-red-600">
            24/7 Available
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Banner */}
        <Card className="mb-8 border-red-300 bg-red-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-red-800 mb-2">Emergency Support Available</h1>
              <p className="text-red-700 mb-6">If you're in immediate danger, don't hesitate to call for help</p>
              <div className="flex justify-center space-x-4">
                <a href="tel:100">
                  <Button size="lg" variant="destructive">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Police: 100
                  </Button>
                </a>
                <a href="tel:181">
                  <Button size="lg" variant="outline" className="border-red-300 text-red-700 bg-white">
                    <Phone className="h-5 w-5 mr-2" />
                    {t("womenHelpline")}: 181
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Emergency Contacts */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
            <div className="space-y-4">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className={`${contact.urgent ? "border-red-200 bg-red-50" : "border-gray-200"}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`${contact.urgent ? "text-red-800" : "text-gray-900"}`}>
                        {contact.name}
                      </CardTitle>
                      {contact.urgent && <Badge variant="destructive">URGENT</Badge>}
                    </div>
                    <CardDescription className={contact.urgent ? "text-red-700" : "text-gray-600"}>
                      {contact.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-green-600" />
                        <span className="font-mono text-lg font-bold">{contact.number}</span>
                      </div>
                      <a href={`tel:${contact.number}`}>
                        <Button
                          variant={contact.urgent ? "destructive" : "outline"}
                          className={!contact.urgent ? "bg-transparent" : ""}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Tips */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-amber-600">
                  <Shield className="h-5 w-5 mr-2" />
                  Safety Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-3">
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Trust your instincts - if something feels wrong, seek help
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Keep emergency numbers saved in your phone
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Share your location with trusted contacts
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Document incidents as soon as it's safe to do so
                  </li>
                  <li className="flex items-start">
                    <span className="text-amber-600 mr-2">•</span>
                    Know your workplace's emergency procedures
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  24/7 Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Police Emergency</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      24/7
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{t("womenHelpline")}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      24/7
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Crisis Counseling</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      24/7
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Find Nearby Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Nearest Police Station
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  Legal Aid Centers
                </Button>
                <Button variant="outline" className="w-full bg-transparent">
                  <MapPin className="h-4 w-4 mr-2" />
                  NGO Support Centers
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
