import { createAuthClient } from "better-auth/client";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL:  process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
  fetchOptions: {
    credentials: "include", // Send cookies with requests
  },
  plugins: [jwtClient()],
});

export const { signIn, signUp, signOut } = authClient;
