import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Avatar, { AVATAR_OPTIONS } from "../components/Avatar";
import { DOMAINS } from "../constants/domains";
import "./Profile.css";

const Profile = () => {
  const { user, updateProfile, updateDomain, updateTeachingDomain } = useAuth();
  const isInstructor = user?.role === "INSTRUCTOR";

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    dateOfBirth: user?.dateOfBirth || "",
    bio: user?.bio || "",
    avatarId: user?.avatarId || AVATAR_OPTIONS[0].id,
  });
  const [selectedDomain, setSelectedDomain] = useState(user?.domain || "");
  const [selectedTeachingDomain, setSelectedTeachingDomain] = useState(user?.teachingDomain || "");

  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [domainMsg, setDomainMsg] = useState({ type: "", text: "" });
  const [teachingMsg, setTeachingMsg] = useState({ type: "", text: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingDomain, setSavingDomain] = useState(false);
  const [savingTeaching, setSavingTeaching] = useState(false);

  useEffect(() => {
    if (!user) return;
    setForm({
      fullName: user.fullName || "",
      dateOfBirth: user.dateOfBirth || "",
      bio: user.bio || "",
      avatarId: user.avatarId || AVATAR_OPTIONS[0].id,
    });
    setSelectedDomain(user.domain || "");
    setSelectedTeachingDomain(user.teachingDomain || "");
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    setSavingProfile(true);
    try {
      await updateProfile(form);
      setProfileMsg({ type: "success", text: "Profile updated." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDomainSave = async () => {
    if (!selectedDomain) return;
    setDomainMsg({ type: "", text: "" });
    setSavingDomain(true);
    try {
      await updateDomain(selectedDomain);
      setDomainMsg({ type: "success", text: "Domain saved." });
    } catch (err) {
      setDomainMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setSavingDomain(false);
    }
  };

  const handleTeachingDomainSave = async () => {
    if (!selectedTeachingDomain) return;
    setTeachingMsg({ type: "", text: "" });
    setSavingTeaching(true);
    try {
      await updateTeachingDomain(selectedTeachingDomain);
      setTeachingMsg({ type: "success", text: "Teaching domain saved." });
    } catch (err) {
      setTeachingMsg({ type: "error", text: err.response?.data?.message || "Update failed." });
    } finally {
      setSavingTeaching(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      {/* ---------- Avatar + editable info ---------- */}
      <div className="profile-section">
        <h2>Profile Details</h2>

        <div className="avatar-picker">
          <span className="section-label">Choose an avatar</span>
          <div className="avatar-options">
            {AVATAR_OPTIONS.map((opt) => (
              <button
                type="button"
                key={opt.id}
                className={`avatar-option ${form.avatarId === opt.id ? "selected" : ""}`}
                onClick={() => setForm({ ...form, avatarId: opt.id })}
                title={opt.label}
              >
                <Avatar avatarId={opt.id} size={56} />
              </button>
            ))}
          </div>
        </div>

        {profileMsg.text && (
          <div className={profileMsg.type === "error" ? "auth-error" : "auth-success"}>
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={handleProfileSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              rows={4}
              maxLength={1000}
              value={form.bio || ""}
              onChange={handleChange}
              placeholder="Tell others a little about yourself..."
            />
          </div>
          <div className="form-group readonly-group">
            <label>Email</label>
            <input value={user.email} disabled />
          </div>
          <div className="form-group readonly-group">
            <label>Role</label>
            <input value={user.role} disabled />
          </div>
          <button className="btn-primary" type="submit" disabled={savingProfile}>
            {savingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>

      {/* ---------- Domain of interest (all roles) ---------- */}
      <div className="profile-section">
        <h2>My Domain</h2>
        <p className="section-hint">
          Pick the domain you're most interested in. This is visible on your profile and to
          admins.
        </p>
        {domainMsg.text && (
          <div className={domainMsg.type === "error" ? "auth-error" : "auth-success"}>
            {domainMsg.text}
          </div>
        )}
        <div className="domain-chip-list">
          {DOMAINS.map((d) => (
            <button
              type="button"
              key={d}
              className={`domain-chip ${selectedDomain === d ? "selected" : ""}`}
              onClick={() => setSelectedDomain(d)}
            >
              {d}
            </button>
          ))}
        </div>
        <button
          className="btn-primary btn-inline"
          onClick={handleDomainSave}
          disabled={savingDomain || !selectedDomain || selectedDomain === user.domain}
        >
          {savingDomain ? "Saving..." : "Save Domain"}
        </button>
      </div>

      {/* ---------- Teaching domain (instructors only) ---------- */}
      {isInstructor && (
        <div className="profile-section">
          <h2>Domain I Teach</h2>
          <p className="section-hint">
            Instructors can select exactly one domain to teach.
          </p>
          {teachingMsg.text && (
            <div className={teachingMsg.type === "error" ? "auth-error" : "auth-success"}>
              {teachingMsg.text}
            </div>
          )}
          <div className="domain-chip-list">
            {DOMAINS.map((d) => (
              <button
                type="button"
                key={d}
                className={`domain-chip teaching ${selectedTeachingDomain === d ? "selected" : ""}`}
                onClick={() => setSelectedTeachingDomain(d)}
              >
                {d}
              </button>
            ))}
          </div>
          <button
            className="btn-primary btn-inline"
            onClick={handleTeachingDomainSave}
            disabled={
              savingTeaching || !selectedTeachingDomain || selectedTeachingDomain === user.teachingDomain
            }
          >
            {savingTeaching ? "Saving..." : "Save Teaching Domain"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
