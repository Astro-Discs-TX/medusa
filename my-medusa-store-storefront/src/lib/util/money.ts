import { isEmpty } from "./isEmpty"

type ConvertToLocaleParams = {
  amount: number
  currency_code: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

export const convertToLocale = ({
  amount,
  currency_code,
  minimumFractionDigits,
  maximumFractionDigits,
  locale = "en-US",
}: ConvertToLocaleParams) => {
  // Handle invalid inputs
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "Price unavailable"
  }
  
  if (!currency_code || isEmpty(currency_code)) {
    return amount.toString()
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency_code,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return `${amount} ${currency_code}`
  }
}
