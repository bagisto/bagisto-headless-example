import { gql } from '@apollo/client'
import { print } from 'graphql'

// This asks Bagisto if the login is correct
export const CREATE_CUSTOMER_LOGIN = gql`
  mutation loginCustomer($input: createCustomerLoginInput!) {
    createCustomerLogin(input: $input) {
     customerLogin {
            id
            apiToken
            token
            message
            success
        }
    }
  }
`

// Check if login is correct
export async function authenticateWithBagisto(credentials: any) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT}/api/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-STOREFRONT-KEY': `${process.env.NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY}`,
        },
        body: JSON.stringify({
            query: print(CREATE_CUSTOMER_LOGIN),
            variables: {
                input: {
                    email: credentials.username,
                    password: credentials.password,
                },
            },
        }),
    })

    const result = await response.json()

    const data = result?.data?.createCustomerLogin?.customerLogin

    if (!data || !data.success || !data.token) {
        throw new Error(data?.message || 'Invalid credentials.')
    }

    return {
        id: data.id,
        email: credentials.username,
        name: credentials.username,
        apiToken: data.apiToken,
        accessToken: data.token,
        role: 'customer',
    }
}
