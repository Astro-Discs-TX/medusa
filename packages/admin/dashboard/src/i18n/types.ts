import type { Locale } from "date-fns"
import faIR from "./translations/fa.json"

const resources = {
  translation: faIR,
} as const

export type Resources = typeof resources

export type Language = {
  code: string
  display_name: string
  ltr: boolean
  date_locale: Locale
}
