
import './Login.css';

function Login() {
    return (
        <div className="login-container">
            <form className="login-form">
                <h2 className="login-title">Login</h2>
                <p className="login-subtitle">Welcome! Please enter your details.</p>

                <label htmlFor="loginEmail" className="login-label">Email</label>
                <input
                    type="email"
                    id="loginEmail"
                    className="login-input"
                    placeholder="Please enter email"
                    autoComplete="username"
                />

                <label htmlFor="loginPassword" className="login-label">Password</label>
                <input
                    type="password"
                    id="loginPassword"
                    className="login-input"
                    placeholder="Please enter password"
                    autoComplete="current-password"
                />

                <div className="login-options-row">
                    <label className="remember-me">
                        <input type="checkbox" className="login-checkbox" /> Remember me
                    </label>
                    <a href="#" className="forgot-password">Forgot Password</a>
                </div>

                <button type="submit" className="login-button">Login</button>

                <p className="signup-link">
                    Don't have an account? <a href="#">Signup</a>
                </p>
            </form>
        </div>
    );
}

export default Login;