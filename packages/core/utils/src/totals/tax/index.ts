import { BigNumberInput, TaxLineDTO } from "@medusajs/types"
import { BigNumber } from "../big-number"
import { MathBN } from "../math"

export function calculateTaxTotal({
  taxLines,
  taxableAmount,
  setTotalField,
  includesTax,
}: {
  taxLines: Pick<TaxLineDTO, "rate">[]
  taxableAmount: BigNumberInput
  setTotalField?: string
  includesTax?: boolean
}) {
  if (MathBN.lte(taxableAmount, 0)) {
    return MathBN.convert(0)
  }

  let taxTotal = MathBN.convert(0)

  for (const taxLine of taxLines) {
    let taxAmount = includesTax
      ? MathBN.mult(
          taxableAmount,
          MathBN.div(taxLine.rate, MathBN.add(100, taxLine.rate))
        )
      : MathBN.mult(taxableAmount, MathBN.div(taxLine.rate, 100))

    if (setTotalField) {
      ;(taxLine as any)[setTotalField] = new BigNumber(taxAmount)
    }

    taxTotal = MathBN.add(taxTotal, taxAmount)
  }

  return taxTotal
}

export function calculateAmountsWithTax({
  taxLines,
  amount,
  includesTax,
}: {
  taxLines: Pick<TaxLineDTO, "rate">[]
  amount: number
  includesTax?: boolean
}) {
  const sumTaxRate = MathBN.sum(
    ...((taxLines ?? []).map((taxLine) => taxLine.rate) ?? [])
  )

  const taxableAmount = includesTax
    ? MathBN.mult(amount, MathBN.div(100, MathBN.add(100, sumTaxRate)))
    : amount

  const tax = calculateTaxTotal({
    taxLines,
    taxableAmount,
  })

  return {
    priceWithTax: includesTax ? amount : MathBN.add(tax, amount).toNumber(),
    priceWithoutTax: includesTax ? MathBN.sub(amount, tax).toNumber() : amount,
  }
}
