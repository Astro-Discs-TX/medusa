import { AdjustmentLineDTO, BigNumberInput } from "@medusajs/types"
import { isDefined } from "../../common"
import { MathBN } from "../math"

export function calculateAdjustmentTotal({
  adjustments,
  includesTax,
  taxRate,
}: {
  adjustments: Pick<AdjustmentLineDTO, "amount">[]
  includesTax?: boolean
  taxRate: BigNumberInput
}) {
  // the sum of all adjustment amounts excluding tax
  let adjustmentsSubtotal = MathBN.convert(0)
  // the sum of all adjustment amounts including tax
  let adjustmentsTotal = MathBN.convert(0)
  // the sum of all taxes on subtotals
  let adjustmentsTaxTotal = MathBN.convert(0)

  for (const adj of adjustments) {
    if (!isDefined(adj.amount)) {
      continue
    }

    const adjustmentAmount = MathBN.convert(adj.amount)

    const adjustmentSubtotal = includesTax
      ? MathBN.div(adjustmentAmount, MathBN.add(1, taxRate))
      : adjustmentAmount

    const adjustmentTaxTotal = MathBN.mult(adjustmentSubtotal, taxRate)

    const adjustmentTotal = includesTax
      ? adjustmentAmount
      : MathBN.mult(adjustmentAmount, MathBN.add(1, taxRate))

    adjustmentsSubtotal = MathBN.add(adjustmentsSubtotal, adjustmentSubtotal)
    adjustmentsTaxTotal = MathBN.add(adjustmentsTaxTotal, adjustmentTaxTotal)
    adjustmentsTotal = MathBN.add(adjustmentsTotal, adjustmentTotal)
  }

  return {
    adjustmentsTotal,
    adjustmentsSubtotal,
    adjustmentsTaxTotal,
  }
}
