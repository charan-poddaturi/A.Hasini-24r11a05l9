import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserProfile, fetchMe, login as loginService, register as registerService } from "../services/auth";
import { setAuthToken } from "../services/api";
import { io, Socket } from "socket.io-client";

interface AuthContextValue {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  socket: Socket | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("safehub_token");
    if (stored) {
      setToken(stored);
      setAuthToken(stored);
      fetchMe()
        .then(setUser)
        .catch(() => {
          setToken(null);
          setUser(null);
          setAuthToken(null);
          window.localStorage.removeItem("safehub_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000/api";
      const socketUrl =
        (import.meta.env.VITE_SOCKET_URL as string) || apiBase.replace(/\/api$/, "");

      const socketInstance = io(socketUrl, {
        transports: ["websocket"],
        auth: {
          token,
        },
      });

      socketInstance.on("connect", () => {
        socketInstance.emit("join", user?.id || "");
      });

      setSocket(socketInstance);
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, user?.id]);

  const login = async (email: string, password: string) => {
    const { token: newToken, user: profile } = await loginService(email, password);
    setToken(newToken);
    setUser(profile);
    setAuthToken(newToken);
    window.localStorage.setItem("safehub_token", newToken);
  };

  const signup = async (name: string, email: string, password: string) => {
    const { token: newToken, user: profile } = await registerService(name, email, password);
    setToken(newToken);
    setUser(profile);
    setAuthToken(newToken);
    window.localStorage.setItem("safehub_token", newToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    window.localStorage.removeItem("safehub_token");
  };

  const value = useMemo(
    () => ({ user, token, loading, login, signup, logout, socket }),
    [user, token, loading, socket]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
