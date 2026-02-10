'use client'

import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client'
import { SessionProvider } from 'next-auth/react'
import { setContext } from '@apollo/client/link/context'

const httpLink = createHttpLink({
    uri: '/api/graphql',
})

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            'X-STOREFRONT-KEY': `${process.env.NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY}`,
        }
    }
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
})

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </SessionProvider>
    )
}
