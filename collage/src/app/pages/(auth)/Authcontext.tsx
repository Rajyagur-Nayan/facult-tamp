"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null, role?: string | null) => void;
  role: string | null;
  setRole: (role: string | null) => void;
  logout: (role?: string | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [role, setRoleState] = useState<string | null>(null);

  // ✅ Load from storage on refresh
  useEffect(() => {
    const savedRole = localStorage.getItem("role");
    if (savedRole) {
      setRoleState(savedRole);
      const savedToken = Cookies.get(`access_token_${savedRole}`);
      if (savedToken) setAccessTokenState(savedToken);
    }
  }, []);

  const setAccessToken = (token: string | null, role?: string | null) => {
    if (token && role) {
      Cookies.set(`access_token_${role}`, token, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
    }
    setAccessTokenState(token);
  };

  const setRole = (newRole: string | null) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem("role", newRole);
    } else {
      localStorage.removeItem("role");
    }
  };

  const logout = (logoutRole?: string | null) => {
    const targetRole = logoutRole || role;
    if (targetRole) {
      Cookies.remove(`access_token_${targetRole}`);
      Cookies.remove(`refresh_token_${targetRole}`);
    }
    setAccessTokenState(null);
    setRoleState(null);
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, role, setRole, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
