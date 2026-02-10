// Simple email check
export function isValidEmail(email: string) {
    return email.includes('@') && email.includes('.')
}

// Simple password check
export function isValidPassword(password: string) {
    return password.length >= 6
}

// Check login form
export function validateLoginForm(email: string, password: string) {
    const errors: any = {}

    if (!isValidEmail(email)) {
        errors.email = 'Please enter a real email address'
    }

    if (!isValidPassword(password)) {
        errors.password = 'Password must be at least 6 characters'
    }

    return errors
}
