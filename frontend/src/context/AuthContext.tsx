import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "../services/api";
import { User, AuthRequest, AuthResponse } from "../types";

interface AuthContextType {
  user: User | null;
  login: (credentials: AuthRequest) => Promise<void>;
  register: (credentials: AuthRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ id: 1, username: "user", role: "USER" });
    }
    setLoading(false);
  }, []);

  const login = async (credentials: AuthRequest) => {
    try {
      const response = await api.post<AuthResponse>("/auth/login", credentials);
      const { token } = response.data;
      localStorage.setItem("token", token);

      setUser({ id: 1, username: credentials.username, role: "USER" });
    } catch (error) {
      throw error;
    }
  };

  const register = async (credentials: AuthRequest) => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        credentials
      );
      const { token } = response.data;
      localStorage.setItem("token", token);
      setUser({ id: 1, username: credentials.username, role: "USER" });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
