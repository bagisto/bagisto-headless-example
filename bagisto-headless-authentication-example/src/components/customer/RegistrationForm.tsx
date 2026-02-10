'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, gql } from '@apollo/client'

const CREATE_CUSTOMER = gql`
  mutation registerCustomer($input: createCustomerInput!) {
    createCustomer(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
        status
        apiToken
        customerGroupId
        subscribedToNewsLetter
        isVerified
        isSuspended
        token
        rememberToken
        name
      }
    }
  }
`

export default function RegistrationForm() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirmation: '',
    })
    const [error, setError] = useState('')
    const router = useRouter()

    const [register] = useMutation(CREATE_CUSTOMER, {
        onCompleted({ createCustomer }) {
            if (createCustomer.customer) {
                router.push('/login')
            } else {
                setError('Registration failed')
            }
        },
        onError(error) {
            setError(error.message || 'Registration failed')
        },
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (formData.password !== formData.passwordConfirmation) {
            setError('Passwords do not match')
            return
        }

        await register({
            variables: {
                input: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.passwordConfirmation,
                    status: '1',
                    isVerified: '1',
                    isSuspended: '0',
                    subscribedToNewsLetter: true,
                },
            },
        })
    }

    return (
        <form onSubmit={handleSubmit} className="login-form">
            <h2>Create Your Account</h2>

            <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter your last name"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="passwordConfirmation">Confirm Password</label>
                <input
                    type="password"
                    id="passwordConfirmation"
                    name="passwordConfirmation"
                    value={formData.passwordConfirmation}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                />
            </div>

            {error && <div className="error">{error}</div>}

            <button type="submit" className="btn-primary">Register</button>
        </form>
    )
}
