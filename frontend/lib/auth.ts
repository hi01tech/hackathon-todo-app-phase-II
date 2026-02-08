import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  basePath: "/api/auth",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true, // Automatically sign in after signup
  },
  session: {
    expiresIn: 60 * 60 * 24, // 24 hours in seconds
    updateAge: 60 * 60, // 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24, // 24 hours in seconds
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    cookiePrefix: "better-auth",
  },
  plugins: [
    jwt({
      jwt: {
        expiresIn: "24h",
        algorithm: "HS256", // Must match backend JWT_ALGORITHM
        secret: process.env.BETTER_AUTH_SECRET, // Use same secret as backend
        definePayload: async ({ user, session }) => ({
          sub: user.id,
          email: user.email,
          name: user.name,
          iat: Math.floor(Date.now() / 1000),
        }),
      },
    }),
  ],
});
