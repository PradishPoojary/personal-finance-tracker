import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await registerUser(username, email, password);
            navigate('/login'); 
        } catch (err) {
            setError('Registration failed. Username may already exist.');
        }
    };

    return (
        <div className="container mt-5 pt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card futuristic-card p-4 border-0">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4 text-neon-green fw-bold">
                                <i className="bi bi-person-plus me-2"></i>New Identity
                            </h3>
                            {error && <div className="alert alert-danger bg-danger text-white border-0"><i className="bi bi-exclamation-triangle-fill me-2"></i>{error}</div>}
                            <form onSubmit={handleRegister}>
                                <div className="mb-3">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Username</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-green">
                                            <i className="bi bi-person-badge"></i>
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
                                <div className="mb-3">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Email (Optional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-green">
                                            <i className="bi bi-envelope"></i>
                                        </span>
                                        <input 
                                            type="email" 
                                            className="form-control futuristic-input border-start-0" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                        />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label text-light opacity-75 small text-uppercase fw-bold">Password</label>
                                    <div className="input-group">
                                        <span className="input-group-text futuristic-input border-end-0 text-neon-green">
                                            <i className="bi bi-shield-lock"></i>
                                        </span>
                                        <input 
                                            type="password" 
                                            className="form-control futuristic-input border-start-0" 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)} 
                                            required 
                                            minLength="8"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn futuristic-btn w-100 py-2 fs-5 mt-2">
                                    Initialize <i className="bi bi-rocket-takeoff ms-1"></i>
                                </button>
                            </form>
                            <div className="text-center mt-4">
                                <p className="text-light opacity-75">
                                    Already initialized? <Link to="/login" className="text-neon-blue text-decoration-none fw-bold">Authenticate Here</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;