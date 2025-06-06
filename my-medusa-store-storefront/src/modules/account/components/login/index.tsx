"use client"

import { handleLogin } from "@lib/data/client-actions"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [state, formAction] = useActionState(handleLogin, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 bg-gradient-to-r from-[var(--color-luxury-gold)]/10 to-[var(--color-luxury-gold)]/20 border border-[var(--color-luxury-gold)]/30">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-luxury-darkgold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      
      <h1 className="font-display text-2xl text-[var(--color-luxury-charcoal)] mb-2 uppercase tracking-wider text-center">Welcome Back</h1>
      <div className="h-0.5 w-32 gold-gradient mb-6"></div>
      <p className="text-center text-[var(--color-luxury-charcoal)]/70 mb-8 max-w-sm">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full max-w-sm" action={formAction}>
        <div className="flex flex-col w-full gap-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
            className="luxury-input"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
            className="luxury-input"
          />
        </div>
        {state?.error && <ErrorMessage error={state.error} data-testid="login-error-message" />}
        <SubmitButton 
          data-testid="sign-in-button" 
          className="w-full mt-8 bg-gradient-to-r from-[var(--color-luxury-darkgold)] to-[var(--color-luxury-gold)] hover:from-[var(--color-luxury-gold)] hover:to-[var(--color-luxury-darkgold)] text-white px-6 py-3 rounded luxury-btn"
        >
          Sign in
        </SubmitButton>
      </form>
      <div className="w-full max-w-sm flex items-center my-8">
        <div className="flex-grow h-px bg-[var(--color-luxury-lightgold)]/20"></div>
        <span className="px-4 text-[var(--color-luxury-charcoal)]/50 text-sm">OR</span>
        <div className="flex-grow h-px bg-[var(--color-luxury-lightgold)]/20"></div>
      </div>
      <span className="text-center text-[var(--color-luxury-charcoal)]/70">
        Not a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-[var(--color-luxury-gold)] hover:text-[var(--color-luxury-darkgold)] font-medium"
          data-testid="register-button"
        >
          Join us
        </button>
      </span>
    </div>
  )
}

export default Login
