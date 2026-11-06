import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home-hero">
      <h1>LMS User Management</h1>
      <p>
        A simple platform to manage students, instructors, and admins for your
        Learning Management System.
      </p>
      <div className="home-actions">
        {user ? (
          <Link to="/dashboard" className="home-primary">
            Go to Dashboard
          </Link>
        ) : (
          <>
            <Link to="/login" className="home-primary">
              Login
            </Link>
            <Link to="/register" className="home-secondary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
