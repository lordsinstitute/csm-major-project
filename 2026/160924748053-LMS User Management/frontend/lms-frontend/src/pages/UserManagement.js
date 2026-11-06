import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Avatar from "../components/Avatar";
import "./UserManagement.css";

const emptyForm = { fullName: "", email: "", role: "STUDENT", enabled: true };

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/users");
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
    });
  };

  const closeEdit = () => {
    setEditingUser(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/users/${editingUser.id}`, form);
      closeEdit();
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="users-page">
      <h1>Manage Users</h1>

      {error && <div className="auth-error">{error}</div>}

      <div className="users-table-wrap">
        {loading ? (
          <p style={{ padding: 20 }}>Loading users...</p>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th></th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Domain</th>
                <th>Teaching Domain</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>
                    <Avatar avatarId={u.avatarId} size={32} />
                  </td>
                  <td>{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td className={u.domain ? "" : "text-muted-cell"}>{u.domain || "—"}</td>
                  <td className={u.teachingDomain ? "" : "text-muted-cell"}>
                    {u.teachingDomain || "—"}
                  </td>
                  <td>{u.enabled ? "Active" : "Disabled"}</td>
                  <td>
                    <button className="action-btn action-edit" onClick={() => openEdit(u)}>
                      Edit
                    </button>
                    <button className="action-btn action-delete" onClick={() => handleDelete(u.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center", padding: 20 }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {editingUser && (
        <div className="modal-overlay" onClick={closeEdit}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Full Name</label>
                <input name="fullName" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select name="role" value={form.role} onChange={handleChange}>
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    name="enabled"
                    checked={form.enabled}
                    onChange={handleChange}
                    style={{ width: "auto", marginRight: 8 }}
                  />
                  Account enabled
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={closeEdit}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
