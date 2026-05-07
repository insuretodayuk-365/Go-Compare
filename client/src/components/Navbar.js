import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          {/* <img src="/logos/insure-today-uk-logo.jpeg" alt="Go Compare" onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} /> */}

          <span className="logo-text">
            <span className="logo-go">GO.</span>
            <span className="logo-compare">COMPARE</span>
          </span>
        </Link>
        <div className="navbar-sub">car insurance</div>

        <div className="navbar-right">
          {user ? (
            <div className="user-menu">
              <button
                className="user-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                </svg>
                <span>Hi {user.firstName}</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              {menuOpen && (
                <div className="dropdown">
                  <div className="dropdown-user-block">
                    <div className="dropdown-welcome">
                      Hi {user.firstName} {user.lastName}, welcome back
                    </div>
                  </div>

                  <div className="dropdown-divider" />

                  <button
                    className="dropdown-link-btn"
                    onClick={() => {
                      navigate("/results");
                      setMenuOpen(false);
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>

                    <span>Quotes</span>
                  </button>

                  <div className="dropdown-footer">
                    Not {user.firstName} {user.lastName}?{" "}
                    <button className="dropdown-signout" onClick={handleLogout}>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary nav-register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
