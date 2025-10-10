import { getServerSession } from 'next-auth'



export { getServerSession as auth }
export { signIn, signOut } from 'next-auth/react'