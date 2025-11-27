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
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            {user ? (
              <>
                <Link to="/favorites">My Favorites</Link>
                {user?.role?.toUpperCase() === "ADMIN" && (
                  <Link to="/admin">Admin</Link>
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
