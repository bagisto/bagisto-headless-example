import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { authenticateWithBagisto } from '@/utils/auth'

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // Users stay logged in for 30 days
    },

    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            authorize: async (credentials): Promise<any> => {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Email and password are required.')
                }

                return await authenticateWithBagisto(credentials)
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.apiToken = user.apiToken
                token.accessToken = user.accessToken
                token.role = 'customer'
            }
            return token
        },

        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: (token.id as string) || '',
                apiToken: token.apiToken,
                accessToken: token.accessToken,
                role: token.role,
            }

            return session
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    secret: process.env.NEXT_PUBLIC_NEXT_AUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
