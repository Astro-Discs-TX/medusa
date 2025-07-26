const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  projectConfig: {
    jwtSecret: process.env.JWT_SECRET,
    cookieSecret: process.env.COOKIE_SECRET,
    database_url: process.env.DATABASE_URL,
    database_type: "postgres",
    store_cors: process.env.MEDUSA_STORE_CORS,
    admin_cors: process.env.MEDUSA_ADMIN_CORS,
  },
  plugins: [
    // Add plugins here if needed, e.g.:
    // {
    //   resolve: `medusa-fulfillment-manual`,
    //   options: {},
    // },
  ],
};