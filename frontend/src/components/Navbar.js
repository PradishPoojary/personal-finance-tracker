import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  // A simple check to see if the user is logged in
  const isAuthenticated = !!localStorage.getItem("access_token");

  // If they aren't logged in, don't show the navigation bar
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark futuristic-nav">
            <div className="container">
                <Link className="navbar-brand text-neon-blue fw-bold" to="/dashboard">
                    <i className="bi bi-hexagon-fill me-2"></i>FinanceTracker
                </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add-transaction">
                Add Transaction
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/transactions">
                History
              </Link>
            </li>
            <li className="nav-item">
    <Link className="nav-link text-neon-green" to="/budgets">Budgets</Link> {/* <--- Added Budgets link */}
</li>
          </ul>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
