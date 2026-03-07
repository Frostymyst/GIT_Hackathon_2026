
import './Signup.css';

function Signup() {
    return (
        <div className="signup-container">
            <form className="signup-form">
                <h2 className="signup-title">Signup</h2>
                <p className="signup-subtitle">Welcome! Please enter your details.</p>

                <label htmlFor="firstName" className="signup-label">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    className="signup-input"
                    placeholder="Please enter first name"
                    autoComplete="given-name"
                />

                <label htmlFor="lastName" className="signup-label">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    className="signup-input"
                    placeholder="Please enter last name"
                    autoComplete="family-name"
                />

                <label htmlFor="signupEmail" className="signup-label">Email</label>
                <input
                    type="email"
                    id="signupEmail"
                    className="signup-input"
                    placeholder="Please enter email"
                    autoComplete="email"
                />

                <label htmlFor="companyName" className="signup-label">Company Name</label>
                <input
                    type="text"
                    id="companyName"
                    className="signup-input"
                    placeholder="Please enter company name"
                    autoComplete="organization"
                />

                <label htmlFor="createPassword" className="signup-label">Create Password</label>
                <input
                    type="password"
                    id="createPassword"
                    className="signup-input"
                    placeholder="Please enter password"
                    autoComplete="new-password"
                />

                <label htmlFor="confirmPassword" className="signup-label">Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    className="signup-input"
                    placeholder="Please enter password"
                    autoComplete="new-password"
                />

                {/* Optionally, add a terms and conditions checkbox */}
                <div className="signup-terms-row">
                    <label className="signup-terms">
                        <input type="checkbox" className="signup-checkbox" required /> I agree to the Terms & Conditions
                    </label>
                </div>

                <button type="submit" className="signup-button">Signup</button>
            </form>
        </div>
    );
}

export default Signup;