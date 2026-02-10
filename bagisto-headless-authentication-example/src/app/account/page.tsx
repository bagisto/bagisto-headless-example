'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AccountPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    if (status === 'loading') {
        return <p>Loading...</p>
    }

    if (!session) {
        return (
            <div>
                <p>Please login to see your account.</p>
                <button onClick={() => router.push('/login')}>
                    Login
                </button>
            </div>
        )
    }

    return (
        <div className="account-page">
            <h1>Welcome to Your Account!</h1>
            <p>You are logged in successfully.</p>
            <p>Logged in as: {session.user?.email}</p>

            <div className="account-actions">
                <button onClick={() => router.push('/orders')}>
                    View Orders
                </button>
                <button onClick={() => router.push('/profile')}>
                    Edit Profile
                </button>
                <button onClick={() => signOut()}>
                    Logout
                </button>
            </div>
        </div>
    )
}
