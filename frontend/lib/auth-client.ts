import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include", // Send cookies with requests
  },
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut } = authClient;
