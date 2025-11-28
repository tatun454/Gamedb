import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  console.log("User role:", user?.role);

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            GameDB
          </Link>
          <div className="nav-links">
            <Link to="/">
              <i className="bi bi-house-fill nav-icon"></i>
            </Link>
            <Link to="/search">
              <i className="bi bi-search nav-icon"></i>
            </Link>
            {user ? (
              <>
                <Link to="/favorites">
                  <i className="bi bi-bookmark-heart-fill nav-icon"></i>
                </Link>
                {user?.role?.toUpperCase() === "ADMIN" && (
                  <Link to="/admin">
                    <i className="bi bi-database-fill-add nav-icon"></i>
                  </Link>
                )}
                <span>Hello, {user.username}</span>
                <button className="btn btn-secondary" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="btn btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
