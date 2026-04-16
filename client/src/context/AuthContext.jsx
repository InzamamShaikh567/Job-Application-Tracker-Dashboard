import React, { createContext, useEffect, useState } from "react";
import api from "../utils/api.js";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));

          await api.get("/v1/auth/profile");
        } catch (error) {
          console.error("Error loading user:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const register = async (name, email, password) => {
    const response = await api.post("/v1/auth/register", {
      name,
      email,
      password,
    });

    if (response.data.success) {
      const { token: newToken, user: newUser } = response.data;
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    }

    return response;
  };

  const login = async (email, password) => {
    const response = await api.post("/v1/auth/login", {
      email,
      password,
    });

    if (response.data.success) {
      const { token: newToken, user: newUser } = response.data;

      // Save to localStorage FIRST
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(newUser));

      // Then update state
      setToken(newToken);
      setUser(newUser);

      // console.log('Login successful:', { token: newToken, user: newUser });
    }

    return response;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
