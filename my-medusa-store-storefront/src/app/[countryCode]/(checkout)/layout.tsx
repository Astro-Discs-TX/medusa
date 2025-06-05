import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-[#f9f6f2] relative small:min-h-screen">
      <div className="h-20 bg-white border-b border-[#e2d9cf]">
        <nav className="flex h-full items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-[#8a7f72] flex items-center gap-x-2 uppercase flex-1 basis-0 transition-colors duration-150 ease-in-out hover:text-[#43372f]"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block font-medium">
              Back to shopping cart
            </span>
            <span className="mt-px block small:hidden font-medium">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-xl font-serif text-[#43372f] tracking-wide gold-text"
            data-testid="store-link"
          >
            MARBLE LUXE
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
      <div className="py-8 w-full flex items-center justify-center bg-white border-t border-[#e2d9cf] mt-12">
        <div className="text-center text-[#8a7f72] text-sm">
          <p className="mb-1">© 2023 Marble Luxe. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
