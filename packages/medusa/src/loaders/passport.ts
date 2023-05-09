import { Express } from "express"
import passport from "passport"
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import { Strategy as LocalStrategy } from "passport-local"
import { Strategy as CustomStrategy } from "passport-custom"
import { AuthService } from "../services"
import { ConfigModule, MedusaContainer } from "../types/global"

export default async ({
  app,
  container,
  configModule,
}: {
  app: Express
  container: MedusaContainer
  configModule: ConfigModule
}): Promise<void> => {
  const authService = container.resolve<AuthService>("authService")

  // For good old email password authentication
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const { success, user } = await authService.authenticate(
            email,
            password
          )
          if (success) {
            return done(null, user)
          } else {
            return done("Incorrect Username / Password")
          }
        } catch (error) {
          return done(error)
        }
      }
    )
  )

  // After a user has authenticated a JWT will be placed on a cookie, all
  // calls will be authenticated based on the JWT
  const { jwt_secret } = configModule.projectConfig
  passport.use(
    "admin-session",
    new CustomStrategy(
      async (req, done) => {
        // @ts-ignore
        if(req.session?.user_id) {
          // @ts-ignore
          return done(null, { userId: req.session.user_id })
        }

        return done(null, false)
      }
    )
  )

  passport.use(
    "store-session",
    new CustomStrategy(
      async (req, done) => {
        // @ts-ignore
        if(req.session?.customer_id) {
          // @ts-ignore
          return done(null, { customer_id: req.session.customer_id })
        }

        return done(null, false)
      }
    )
  )

  // Alternatively use bearer token to authenticate to the admin api
  passport.use(
    "admin-api-token",
    new CustomStrategy(async (req, done) => {
      // extract the token from the header
      const header = req.headers.authorization

      if (!header || !header.toLowerCase().startsWith("token ")) {
        return done(null, false)
      }

      const token = header.substring(6).trim()

      const auth = await authService.authenticateAPIToken(token)
      if (auth.success) {
        done(null, auth.user)
      } else {
        done(null, false)
      }
    })
  )

  //#region bearer auth
  // Admin bearer JWT token authentication strategy, best suited for web SPAs or mobile apps
  passport.use(
    "admin-bearer",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret,
      },
      async (jwtPayload, done) => {
        const auth = await authService.authenticateUserWithBearerToken(jwtPayload)
        if (auth.success) {
          done(null, auth.user)
        } else {
          done(null, false)
        }
      }
    )
  )

  // Store bearer JWT token authentication strategy, best suitet for web SPAs or mobile apps
  passport.use(
    "store-bearer",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwt_secret,
      },
      async (jwtPayload, done) => {
        const auth = await authService.authenticateCustomerWithBearerToken(jwtPayload)
        if (auth.success) {
          done(null, { customer_id: auth.customer?.id })
        } else {
          done(auth.error)
        }
      }
    )
  )
  //#endregion

  app.use(passport.initialize())
  app.use(passport.session())
}
