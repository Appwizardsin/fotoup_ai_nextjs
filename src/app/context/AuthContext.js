"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { users } from "@/services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userProfile = await users.getProfile();
        setUser(userProfile);
      }
    } catch (err) {
      console.error("Auth error:", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (token) => {
    localStorage.setItem("token", token);
    await checkAuth();
  };

  const signOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    checkAuth();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut, signIn, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
