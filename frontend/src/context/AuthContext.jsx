import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authAPI.getCurrentUser());
  const [token, setToken] = useState(() => authAPI.getToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify & refresh user from backend
    const checkAuth = async () => {
      const storedToken = authAPI.getToken();
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem("user", JSON.stringify(res.user));
          }
        } catch (error) {
          console.error("Auth verification failed:", error);
          authAPI.logout();
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password, role) => {
    const data = await authAPI.login({ email, password, role });
    if (data.success && data.user) {
      setUser(data.user);
      setToken(data.token);
    }
    return data;
  };

  const register = async (userData) => {
    return await authAPI.register(userData);
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem("user", JSON.stringify(res.user));
      }
      return res;
    } catch (err) {
      console.error("Refresh user error:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        role: user?.role || null,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
