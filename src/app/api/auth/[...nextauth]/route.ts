import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyPassword } from '@/lib/services/userService'

const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔐 Auth attempt:', credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await verifyPassword(credentials.email, credentials.password)
          
          if (user) {
            return {
              id: user.id,
              email: user.email,
              name: user.name,
            }
          }
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: { id: string } }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

// @ts-ignore - Turbopack workaround
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }