import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logoutUser } from '../services/authService'; 

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);
    const closeMenu = () => setIsNavCollapsed(true);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path 
            ? "text-neon-blue fw-bold" 
            : "text-light opacity-75";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark futuristic-nav py-3">
            <div className="container">
                <Link className="navbar-brand fw-bold text-light fs-4" to="/dashboard" onClick={closeMenu}>
                    <i className="bi bi-hexagon-fill text-neon-blue me-2"></i>FinanceTracker
                </Link>
                
                <button 
                    className="navbar-toggler border-0 shadow-none" 
                    type="button" 
                    onClick={handleNavCollapse}
                    style={{ outline: 'none' }}
                >
                    <i className={`bi ${isNavCollapsed ? 'bi-list' : 'bi-x-lg'} fs-2 text-neon-blue`}></i>
                </button>
                
                <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse mt-3 mt-lg-0`} id="navbarNav">
                    
                    {/* Added 'me-auto' back to perfectly push the logout button to the right on desktop */}
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 gap-lg-4 fs-5 fs-lg-6">
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/dashboard')}`} to="/dashboard" onClick={closeMenu}>
                                <i className="bi bi-grid-1x2 me-3 d-lg-none"></i>Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/add-transaction')}`} to="/add-transaction" onClick={closeMenu}>
                                <i className="bi bi-plus-circle me-3 d-lg-none"></i>Add Transaction
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/transactions')}`} to="/transactions" onClick={closeMenu}>
                                <i className="bi bi-clock-history me-3 d-lg-none"></i>History
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/budgets')}`} to="/budgets" onClick={closeMenu}>
                                <i className="bi bi-crosshair me-3 d-lg-none"></i>Budgets
                            </Link>
                        </li>
                    </ul>
                    
                    {/* Added 'd-grid d-lg-block' so it only stretches full width on mobile devices */}
                    <div className="d-grid d-lg-block mt-3 mt-lg-0">
                        <button 
                            className="btn btn-outline-danger py-2 px-4" 
                            onClick={handleLogout} 
                            style={{ borderRadius: '12px' }}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i>Logout
                        </button>
                    </div>

                </div>
            </div>
        </nav>
    );
};

export default Navbar;