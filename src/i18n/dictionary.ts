import { en } from './en'

export type TranslationKey = keyof typeof en
export type Dictionary = Record<TranslationKey, string>
export type Language = 'en' | 'hi'

export const LANGUAGES: Language[] = ['en', 'hi']

/** Short label shown on the header toggle, in the language it switches to. */
export const LANGUAGE_LABEL: Record<Language, string> = { en: 'EN', hi: 'हि' }

/** BCP 47 tags, used for `<html lang>` and Intl formatting. */
export const LOCALE: Record<Language, string> = { en: 'en-IN', hi: 'hi-IN' }

// Hindi arrives in its own module. Until then lookups fall back to English, which
// is also the safety net if a key is ever added to `en` and not yet translated.
const dictionaries: Record<Language, Partial<Dictionary>> = {
  en,
  hi: {},
}

export type Vars = Record<string, string | number>

export function translate(language: Language, key: TranslationKey, vars?: Vars): string {
  const template = dictionaries[language][key] ?? en[key]
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  )
}

export function formatCurrency(amount: number, language: Language): string {
  return new Intl.NumberFormat(LOCALE[language], {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDuration(minutes: number, language: Language): string {
  return translate(language, 'format.duration', {
    hours: Math.floor(minutes / 60),
    minutes: minutes % 60,
  })
}

export function formatDate(iso: string, language: Language, dayOffset = 0): string {
  const date = new Date(`${iso}T00:00:00`)
  date.setDate(date.getDate() + dayOffset)
  return new Intl.DateTimeFormat(LOCALE[language], {
    day: 'numeric',
    month: 'short',
  }).format(date)
}
