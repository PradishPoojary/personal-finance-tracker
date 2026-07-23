import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/authService';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await loginUser(username, password);
            navigate('/dashboard'); 
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card futuristic-card p-4 border-0">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4 text-neon-blue fw-bold">
                                <i className="bi bi-box-arrow-in-right me-2"></i>System Login
                            </h3>
                            {error && <div className="alert alert-danger bg-danger text-white border-0"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                            <form onSubmit={handleLogin}>
                                <div className="mb-4">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-blue">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input 
                                            type="text" 
                                            className="form-control futuristic-input border-start-0" 
                                            value={username} 
                                            onChange={(e) => setUsername(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-blue">
                                            <i className="bi bi-shield-lock"></i>
                                        </span>
                                        <input 
                                            type="password" 
                                            className="form-control futuristic-input border-start-0" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn futuristic-btn w-100 py-2 fs-5 mt-2">
                                    Authenticate <i className="bi bi-fingerprint ms-1"></i>
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <p className="text-light opacity-75">
                                    Don't have access? <Link to="/register" className="text-neon-green text-decoration-none fw-bold">Request Access</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;