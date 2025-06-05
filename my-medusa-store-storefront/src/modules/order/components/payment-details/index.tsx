import { Container, Heading, Text } from "@medusajs/ui"

import { isStripe, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type PaymentDetailsProps = {
  order: HttpTypes.StoreOrder
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0].payments?.[0]

  return (
    <div className="flex flex-col">
      <Heading level="h2" className="flex flex-row text-xl font-serif text-[#43372f] mb-4 pb-2 border-b border-[var(--color-luxury-lightgold)]">
        Payment
      </Heading>
      <div>
        {payment && (
          <div className="flex flex-col md:flex-row items-start gap-y-6 md:gap-x-8">
            <div className="flex flex-col w-full md:w-1/3">
              <Text className="font-medium text-[#43372f] mb-2">
                Payment method
              </Text>
              <Text
                className="text-[#8a7f72]"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div className="flex flex-col w-full md:w-2/3">
              <Text className="font-medium text-[#43372f] mb-2">
                Payment details
              </Text>
              <div className="flex gap-2 text-[#8a7f72] items-center">
                <Container className="flex items-center h-7 w-fit p-2 bg-[var(--color-luxury-lightgold)] rounded">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                <Text data-testid="payment-amount">
                  {isStripe(payment.provider_id) && payment.data?.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${convertToLocale({
                        amount: payment.amount,
                        currency_code: order.currency_code,
                      })} paid at ${new Date(
                        payment.created_at ?? ""
                      ).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentDetails
