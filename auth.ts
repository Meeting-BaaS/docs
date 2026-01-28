import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Allowed email domains for internal docs access
const ALLOWED_DOMAINS = ["meetingbaas.com"]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Allow sign in, but we'll check domain in middleware
      return true
    },
    async session({ session, token }) {
      // Add email domain check to session
      if (session.user?.email) {
        const domain = session.user.email.split("@")[1]
        session.user.isInternal = ALLOWED_DOMAINS.includes(domain)
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
})

// Helper to check if email is from allowed domain
export function isInternalEmail(email: string | null | undefined): boolean {
  if (!email) return false
  const domain = email.split("@")[1]
  return ALLOWED_DOMAINS.includes(domain)
}
