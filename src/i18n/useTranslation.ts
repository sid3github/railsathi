import { useContext, useMemo } from 'react'
import { LanguageContext } from './context'
import {
  formatCurrency,
  formatDate,
  formatDuration,
  formatNumber,
  translate,
  type Language,
  type TranslationKey,
  type Vars,
} from './dictionary'

export function useTranslation() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useTranslation must be used inside a LanguageProvider')
  const { language, setLanguage } = context

  return useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: TranslationKey, vars?: Vars) => translate(language, key, vars),
      currency: (amount: number) => formatCurrency(amount, language),
      duration: (minutes: number) => formatDuration(minutes, language),
      number: (value: number) => formatNumber(value, language),
      date: (iso: string, dayOffset?: number) => formatDate(iso, language, dayOffset),
    }),
    [language, setLanguage],
  )
}

export type Translator = ReturnType<typeof useTranslation>
export type { Language, TranslationKey }
