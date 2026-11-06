import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import "./Dashboard.css";

const badgeClass = (role) => {
  if (role === "ADMIN") return "badge badge-admin";
  if (role === "INSTRUCTOR") return "badge badge-instructor";
  return "badge badge-student";
};

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-text">
          <h1>Welcome, {user?.fullName}</h1>
          <p>Here's your account overview</p>
        </div>
        <Link to="/profile" className="dashboard-edit-link">
          Edit Profile
        </Link>
      </div>

      <div className="dashboard-top">
        <Avatar avatarId={user?.avatarId} size={72} />
        <div className="dashboard-top-info">
          <h2>{user?.fullName}</h2>
          <p>{user?.bio || "No bio added yet."}</p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-row">
          <span className="label">Full Name</span>
          <span className="value">{user?.fullName}</span>
        </div>
        <div className="profile-row">
          <span className="label">Email</span>
          <span className="value">{user?.email}</span>
        </div>
        <div className="profile-row">
          <span className="label">Date of Birth</span>
          <span className={user?.dateOfBirth ? "value" : "value value-muted"}>
            {user?.dateOfBirth || "Not set"}
          </span>
        </div>
        <div className="profile-row">
          <span className="label">Role</span>
          <span className={badgeClass(user?.role)}>{user?.role}</span>
        </div>
        <div className="profile-row">
          <span className="label">My Domain</span>
          {user?.domain ? (
            <span className="domain-badge">{user.domain}</span>
          ) : (
            <span className="value value-muted">Not selected</span>
          )}
        </div>
        {user?.role === "INSTRUCTOR" && (
          <div className="profile-row">
            <span className="label">Domain I Teach</span>
            {user?.teachingDomain ? (
              <span className="domain-badge">{user.teachingDomain}</span>
            ) : (
              <span className="value value-muted">Not selected</span>
            )}
          </div>
        )}
        <div className="profile-row">
          <span className="label">Status</span>
          <span className="value">{user?.enabled ? "Active" : "Disabled"}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
