"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { handleSignup } from "@lib/data/client-actions"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [state, formAction] = useActionState(handleSignup, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-r from-[var(--color-luxury-gold)]/10 to-[var(--color-luxury-gold)]/20 border border-[var(--color-luxury-gold)]/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-darkgold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <line x1="19" y1="8" x2="19" y2="14"></line>
          <line x1="22" y1="11" x2="16" y2="11"></line>
        </svg>
      </div>
      
      <h1 className="font-display text-2xl text-[var(--color-luxury-charcoal)] mb-2 uppercase tracking-wider text-center">
        Become a Marble Luxe Member
      </h1>
      <div className="h-0.5 w-32 gold-gradient mb-6"></div>
      <p className="text-center text-[var(--color-luxury-charcoal)]/70 mb-8 max-w-sm">
        Create your Marble Luxe Member profile, and get access to an enhanced
        shopping experience.
      </p>
      <form className="w-full max-w-sm flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            className="luxury-input"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            className="luxury-input"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            className="luxury-input"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
            className="luxury-input"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
            className="luxury-input"
          />
        </div>
        {state?.error && <ErrorMessage error={state.error} />}
        <span className="text-center text-[var(--color-luxury-charcoal)]/70 mt-8 text-sm">
          By creating an account, you agree to Marble Luxe&apos;s{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
          >
            <span className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)] font-medium">Privacy Policy</span>
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
          >
            <span className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)] font-medium">Terms of Use</span>
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton 
          className="w-full mt-8 bg-gradient-to-r from-[var(--color-luxury-darkgold)] to-[var(--color-luxury-gold)] hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-darkgold)] text-white px-6 py-3 rounded luxury-btn" 
          data-testid="register-button"
        >
          Join
        </SubmitButton>
      </form>
      <div className="w-full max-w-sm flex items-center my-8">
        <div className="flex-grow h-px bg-[var(--color-luxury-lightgold)]/20"></div>
        <span className="px-4 text-[var(--color-luxury-charcoal)]/50 text-sm">OR</span>
        <div className="flex-grow h-px bg-[var(--color-luxury-lightgold)]/20"></div>
      </div>
      <span className="text-center text-[var(--color-luxury-charcoal)]/70">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)] font-medium"
          data-testid="sign-in-link"
        >
          Sign in
        </button>
      </span>
    </div>
  )
}

export default Register
