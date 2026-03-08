import { useState } from 'react';
import './Signup.css';
import { signupUser } from '../api/authApi';

function Signup({ onShowLogin }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        signupEmail: '',
        companyName: '',
        createPassword: '',
        confirmPassword: '',
        termsAccepted: false,
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

    const handleShowLogin = (event) => {
        event.preventDefault();
        if (onShowLogin) {
            onShowLogin();
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (formData.createPassword !== formData.confirmPassword) {
            setErrorMessage('Passwords do not match.');
            return;
        }

        if (!formData.termsAccepted) {
            setErrorMessage('Please agree to the Terms & Conditions.');
            return;
        }

        setIsSubmitting(true);

        try {
            await signupUser({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.signupEmail,
                company_name: formData.companyName,
                password: formData.createPassword,
            });

            setSuccessMessage('Signup request sent successfully. You can sign in once your backend is connected.');
        } catch (error) {
            setErrorMessage(error.message || 'Unable to sign up right now.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
                <h2 className="signup-title">Signup</h2>
                <p className="signup-subtitle">Welcome! Please enter your details.</p>

                {errorMessage && <p className="auth-message auth-message-error">{errorMessage}</p>}
                {successMessage && <p className="auth-message auth-message-success">{successMessage}</p>}

                <label htmlFor="firstName" className="signup-label">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    className="signup-input"
                    placeholder="Please enter first name"
                    autoComplete="given-name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="lastName" className="signup-label">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    className="signup-input"
                    placeholder="Please enter last name"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="signupEmail" className="signup-label">Email</label>
                <input
                    type="email"
                    id="signupEmail"
                    className="signup-input"
                    placeholder="Please enter email"
                    autoComplete="email"
                    value={formData.signupEmail}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="companyName" className="signup-label">Company Name</label>
                <input
                    type="text"
                    id="companyName"
                    className="signup-input"
                    placeholder="Please enter company name"
                    autoComplete="organization"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="createPassword" className="signup-label">Create Password</label>
                <input
                    type="password"
                    id="createPassword"
                    className="signup-input"
                    placeholder="Please enter password"
                    autoComplete="new-password"
                    value={formData.createPassword}
                    onChange={handleInputChange}
                    required
                />

                <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    className="signup-input"
                    placeholder="Please enter password"
                    autoComplete="new-password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                />

                <div className="signup-terms-row">
                    <label className="signup-terms">
                        <input
                            type="checkbox"
                            id="termsAccepted"
                            className="signup-checkbox"
                            checked={formData.termsAccepted}
                            onChange={handleInputChange}
                        />
                        {' '}I agree to the Terms & Conditions
                    </label>
                </div>

                <button type="submit" className="signup-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating account...' : 'Signup'}
                </button>

                <p className="signup-link" style={{ textAlign: 'center', width: '100%' }}>
                    Already have an account? <a href="#" onClick={handleShowLogin}>Sign in</a>
                </p>
            </form>
        </div>
    );
}

export default Signup;