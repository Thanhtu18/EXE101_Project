import { createContext, useContext, useState } from "react";

const AuthContext = createContext(undefined);

// Tài khoản demo
const DEMO_ACCOUNTS = [
  {
    id: "admin-001",
    username: "admin",
    password: "admin123",
    email: "admin@maphome.vn",
    role: "admin",
    fullName: "Admin MapHome",
  },
  {
    id: "landlord-001",
    username: "chutro1",
    password: "123456",
    email: "chutro1@example.com",
    role: "landlord",
    fullName: "Nguyễn Văn A",
    phone: "0912345678",
    verificationLevel: 3,
  },
  {
    id: "landlord-002",
    username: "chutro2",
    password: "123456",
    email: "chutro2@example.com",
    role: "landlord",
    fullName: "Trần Thị B",
    phone: "0987654321",
    verificationLevel: 2,
  },
  {
    id: "user-001",
    username: "user1",
    password: "123456",
    email: "user1@example.com",
    role: "user",
    fullName: "Lê Văn C",
    phone: "0934567890",
    verificationLevel: 1,
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const stored = localStorage.getItem("registeredUsers");
    return stored ? JSON.parse(stored) : [];
  });

  const login = (username, password) => {
    // Kiểm tra tài khoản demo
    const demoAccount = DEMO_ACCOUNTS.find(
      (acc) => acc.username === username && acc.password === password,
    );

    if (demoAccount) {
      const { password: _, ...userData } = demoAccount;
      setUser(userData);
      localStorage.setItem("auth", JSON.stringify(userData));
      return { success: true, role: userData.role };
    }

    // Kiểm tra tài khoản đã đăng ký
    const registeredAccount = registeredUsers.find(
      (acc) => acc.username === username,
    );

    if (registeredAccount) {
      // Trong thực tế cần verify password hash
      setUser(registeredAccount);
      localStorage.setItem("auth", JSON.stringify(registeredAccount));
      return { success: true, role: registeredAccount.role };
    }

    return { success: false };
  };

  const register = (data) => {
    // Kiểm tra username đã tồn tại
    const existingDemo = DEMO_ACCOUNTS.find(
      (acc) => acc.username === data.username,
    );
    const existingUser = registeredUsers.find(
      (acc) => acc.username === data.username,
    );

    if (existingDemo || existingUser) {
      return { success: false, message: "Tên đăng nhập đã tồn tại" };
    }

    // Kiểm tra email đã tồn tại
    const existingEmail = registeredUsers.find(
      (acc) => acc.email === data.email,
    );
    if (existingEmail) {
      return { success: false, message: "Email đã được sử dụng" };
    }

    // Tạo user mới
    const newUser = {
      id: `user-${Date.now()}`,
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      phone: data.phone,
      role: data.role,
      verificationLevel: 1, // Mặc định cấp 1
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    // Auto login sau khi đăng ký
    setUser(newUser);
    localStorage.setItem("auth", JSON.stringify(newUser));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated,
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
