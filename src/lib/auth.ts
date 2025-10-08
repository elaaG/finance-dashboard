// src/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials"
import { query } from "@/lib/database"
import bcrypt from "bcryptjs"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const result = await query(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          )

          const user = result.rows[0]
          if (!user) return null

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: { id: string } }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token?.id && session.user) {
        session.user.id = token.id
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
}
