"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/components/LanguageProvider"

export function HomeButton() {
  const { t } = useLanguage()

  return (
    <Link href="/">
      <Button variant="ghost" size="sm">
        <Home className="h-4 w-4 mr-2" />
        {t("home")}
      </Button>
    </Link>
  )
}
