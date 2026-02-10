'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()
    const { data: session } = useSession()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const result = await signIn('credentials', {
            username: email,  // NextAuth expects 'username' field
            password,
            redirect: false,
        })

        if (result?.error) {
            setError(result.error)
        } else {
            router.push('/account')
            router.refresh()
        }
    }

    if (session) {
        return (
            <div>
                <p>You are already signed in.</p>
                <button onClick={() => router.push('/account')}>
                    Go to Account
                </button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Login to Your Account</h2>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn-primary">Login</button>
        </form>
    )
}
