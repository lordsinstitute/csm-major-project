import React, { createContext, useContext, useState } from "react";
import api from "../api/axiosConfig";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("lms_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("lms_token"));

  const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token: newToken, user: newUser } = response.data;
    localStorage.setItem("lms_token", newToken);
    localStorage.setItem("lms_user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return newUser;
  };

  const register = async (fullName, email, password, role, adminCode) => {
    const response = await api.post("/auth/register", {
      fullName,
      email,
      password,
      role,
      adminCode,
    });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem("lms_token");
    localStorage.removeItem("lms_user");
    setToken(null);
    setUser(null);
  };

  // Persist an updated user object (returned by any /users/me* call) both
  // in state and localStorage, so the change shows up immediately (navbar,
  // dashboard, etc.) without needing a fresh login.
  const applyUserUpdate = (updatedUser) => {
    localStorage.setItem("lms_user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
  };

  const updateProfile = async ({ fullName, dateOfBirth, bio, avatarId }) => {
    const response = await api.put("/users/me", { fullName, dateOfBirth, bio, avatarId });
    return applyUserUpdate(response.data);
  };

  const updateDomain = async (domain) => {
    const response = await api.put("/users/me/domain", { domain });
    return applyUserUpdate(response.data);
  };

  const updateTeachingDomain = async (domain) => {
    const response = await api.put("/users/me/teaching-domain", { domain });
    return applyUserUpdate(response.data);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAdmin,
        updateProfile,
        updateDomain,
        updateTeachingDomain,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
