import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";

export interface User {
  id: string;
  username: string;
  email: string;
  role: "admin" | "landlord" | "user";
  phone?: string;
  fullName?: string;
  avatar?: string; // user profile picture URL
  verificationLevel?: number;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    username: string,
    password: string,
  ) => Promise<{ success: boolean; role?: string; message?: string }>;
  googleLogin: (
    tokens: { idToken?: string; accessToken?: string; role?: string },
  ) => Promise<{ success: boolean; role?: string; message?: string }>;
  register: (
    data: RegisterData,
  ) => Promise<{ success: boolean; message?: string }>;

  logout: () => void;
  updateUser: (userData: User) => void;
  isAuthenticated: boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword?: string;
  fullName: string;
  phone: string;
  role: "landlord" | "user" | "admin";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Note: mock demo accounts removed — prefer backend authentication.

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  // Check for token on mount and fetch profile
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          const res = await fetch(`${API_BASE}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
            localStorage.setItem("auth", JSON.stringify(data));
          } else {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("auth");
            setUser(null);
          }
        } catch (err) {
          console.error("Auth check failed:", err);
        }
      }
    };
    checkAuth();
  }, [API_BASE, user]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: username, password }),
      });
      const payload = await res.json();
      if (!res.ok) {
        return { success: false, message: payload?.message || "Đăng nhập thất bại" };
      }
      if (payload.user) {
        setUser(payload.user);
        localStorage.setItem("auth", JSON.stringify(payload.user));
      }
      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }
      return { success: true, role: payload.user?.role };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối máy chủ" };
    }
  };

  const googleLogin = async (tokens: {
    idToken?: string;
    accessToken?: string;
    role?: string;
  }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tokens),
      });
      const payload = await res.json();
      if (!res.ok) {
        return { success: false, message: payload?.message || "Đăng nhập Google thất bại" };
      }
      if (payload.user) {
        setUser(payload.user);
        localStorage.setItem("auth", JSON.stringify(payload.user));
      }
      if (payload.token) {
        localStorage.setItem("token", payload.token);
      }
      return { success: true, role: payload.user?.role };
    } catch (err) {
      return { success: false, message: "Lỗi kết nối máy chủ" };
    }
  };

  const register = async (data: RegisterData) => {

    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
          confirmPassword: data.confirmPassword || data.password,
          fullName: data.fullName,
          phone: data.phone,
          role: data.role,
        }),
      });
      const payload = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: payload?.message || "Đăng ký thất bại",
        };
      }

      // No longer auto-login to follow user request
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err?.message || "Lỗi kết nối máy chủ" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
    localStorage.removeItem("token");
    toast.success("Đăng xuất thành công!");
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    localStorage.setItem("auth", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        googleLogin,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
