import Google from "next-auth/providers/google";

const authConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    session({ session, token }) {
      session.user.guestId = token.guestId;
      return session;
    },
  },
  pages: { signIn: "/login", error: "/login" },
};

export default authConfig;
