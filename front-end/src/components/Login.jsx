import { useState } from 'react';
import './Login.css';
import { loginUser, saveAuthenticatedEmployee, saveAuthToken } from '../api/authApi';

function Login({ onShowSignup, onLoginSuccess }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (event) => {
        const { id, value, checked, type } = event.target;
        setFormData((prev) => ({
            ...prev,
            [id]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleShowSignup = (event) => {
        event.preventDefault();
        if (onShowSignup) {
            onShowSignup();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');
        setIsSubmitting(true);

        try {
            const response = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            if (response?.detail) {
                throw new Error(response.detail);
            }

            if (response?.status !== 'OK' || !response?.employee) {
                throw new Error('Invalid email or password.');
            }

            saveAuthenticatedEmployee(response.employee, formData.rememberMe);

            if (response?.access_token) {
                saveAuthToken(response.access_token, formData.rememberMe);
            }

            const employeeName = response.employee?.ename || response.employee?.name || 'user';
            setSuccessMessage(`Logged in as ${employeeName}.`);

            if (onLoginSuccess) {
                onLoginSuccess(response.employee);
            }
        } catch (error) {
            setErrorMessage(error.message || 'Unable to login right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Welcome! Please enter your details.</p>

                {errorMessage && <p className="auth-message auth-message-error">{errorMessage}</p>}
                {successMessage && <p className="auth-message auth-message-success">{successMessage}</p>}

                <label htmlFor="email" className="login-label">Email</label>
                <input
                    type="email"
                    id="email"
                    className="login-input"
                    placeholder="Please enter email"
                    autoComplete="username"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="password" className="login-label">Password</label>
                <input
                    type="password"
                    id="password"
                    className="login-input"
                    placeholder="Please enter password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                />

                <div className="login-options-row">
                    <label className="remember-me">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            className="login-checkbox"
                            checked={formData.rememberMe}
                            onChange={handleInputChange}
                        />
                        {' '}Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot Password</a>
                </div>

                <button type="submit" className="login-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging in...' : 'Login'}
                </button>

                <p className="signup-link">
                    Don&apos;t have an account? <a href="#" onClick={handleShowSignup}>Signup</a>
                </p>
            </form>
        </div>
    );
}

export default Login;