import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { ensureGuest } from "./guest-service";

const config = {
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    signIn({ account, profile, user }) {
      return account?.provider === "google" && profile?.email_verified === true && !!user.email;
    },
    async jwt({ token, user }) {
      if (user) {
        const guest = await ensureGuest(user);
        token.guestId = guest.id;
      }
      return token;
    },
  },
};

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
