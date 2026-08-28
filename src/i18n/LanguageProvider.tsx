import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { LanguageContext } from './context'
import { LOCALE, type Language } from './dictionary'

const STORAGE_KEY = 'railsathi.language'

function readStoredLanguage(): Language {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'hi' ? 'hi' : 'en'
  } catch {
    // Private browsing and blocked site data both throw here; English is the default.
    return 'en'
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(readStoredLanguage)

  useEffect(() => {
    document.documentElement.lang = LOCALE[language]
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // A viewer who cannot persist still gets a working toggle for this session.
    }
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language])
  return <LanguageContext value={value}>{children}</LanguageContext>
}
