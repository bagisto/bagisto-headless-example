import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { query, variables } = body

        // Forward the request to Bagisto GraphQL endpoint
        const response = await fetch(`${process.env.NEXT_PUBLIC_BAGISTO_ENDPOINT}/api/graphql`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-STOREFRONT-KEY': `${process.env.NEXT_PUBLIC_BAGISTO_STOREFRONT_KEY}`,
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        })

        const data = await response.json()

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            {
                message: 'Network error',
                error: error instanceof Error ? error.message : error,
            },
            { status: 500 }
        )
    }
}
