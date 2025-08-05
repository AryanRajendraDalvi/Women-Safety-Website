"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type Language, type TranslationKey, getTranslation } from "@/lib/translations"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("english")

  useEffect(() => {
    // Load language from localStorage or user settings
    const savedUser = localStorage.getItem("safespace_user")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      if (user.language) {
        setLanguageState(user.language as Language)
      }
    }
  }, [])

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    
    // Update user settings in localStorage
    const savedUser = localStorage.getItem("safespace_user")
    if (savedUser) {
      const user = JSON.parse(savedUser)
      user.language = lang
      localStorage.setItem("safespace_user", JSON.stringify(user))
      
      // Also update in backend if user is logged in
      const token = localStorage.getItem("safespace_token")
      if (token) {
        try {
          await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language: lang }),
          })
        } catch (error) {
          console.error('Failed to update language in backend:', error)
        }
      }
    }
  }

  const t = (key: TranslationKey): string => {
    return getTranslation(language, key)
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
