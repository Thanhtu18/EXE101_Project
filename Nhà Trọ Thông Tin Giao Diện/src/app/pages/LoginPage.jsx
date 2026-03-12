import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Home,
  Lock,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Shield,
  Building2,
} from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Login form
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Register form
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    role: "landlord",
  });

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = login(loginUsername, loginPassword);
    if (result.success) {
      // Redirect dựa trên role
      if (result.role === "admin") {
        navigate("/admin/dashboard");
      } else if (result.role === "landlord") {
        navigate("/landlord/dashboard");
      } else {
        navigate("/");
      }
    } else {
      setError("Tài khoản hoặc mật khẩu không đúng");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate
    if (registerData.password !== registerData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    if (registerData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    const { confirmPassword, ...dataToSubmit } = registerData;
    const result = register(dataToSubmit);

    if (result.success) {
      setSuccess("Đăng ký thành công! Đang chuyển hướng...");
      setTimeout(() => {
        if (registerData.role === "landlord") {
          navigate("/landlord/dashboard");
        } else {
          navigate("/");
        }
      }, 1500);
    } else {
      setError(result.message || "Đăng ký thất bại");
    }
  };

  const handleSocialLogin = (provider) => {
    setError("");
    // TODO: Implement social login
    setError(
      `Đăng nhập bằng ${provider === "google" ? "Google" : "Zalo"} đang được phát triển`,
    );
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-green-600 to-blue-700">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=1200&fit=crop&q=80)",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Logo Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full text-white">
          <div className="inline-flex items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Home className="size-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold">MapHome</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                <Home className="size-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-gray-900">MapHome</h1>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
            </h2>

            {/* Login Form */}
            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tài khoản
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="text"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Nhập tên đăng nhập"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12 text-base font-semibold"
                >
                  Đăng nhập
                </Button>

                {/* Demo Accounts */}
                <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                  <p className="text-sm font-semibold text-blue-900 mb-3">
                    🎯 Tài khoản Demo:
                  </p>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                      <Shield className="size-4 text-purple-600" />
                      <div>
                        <strong>Admin:</strong> admin / admin123
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                      <Building2 className="size-4 text-green-600" />
                      <div>
                        <strong>Chủ trọ:</strong> chutro1 / 123456
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/60 rounded-lg p-2">
                      <User className="size-4 text-blue-600" />
                      <div>
                        <strong>Người dùng:</strong> user1 / 123456
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* Register Form */}
            {mode === "register" && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        type="text"
                        value={registerData.fullName}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            fullName: e.target.value,
                          })
                        }
                        placeholder="Nguyễn Văn A"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={registerData.phone}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            phone: e.target.value,
                          })
                        }
                        placeholder="0912345678"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      placeholder="example@email.com"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                    <Input
                      type="text"
                      value={registerData.username}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          username: e.target.value,
                        })
                      }
                      placeholder="chutro123"
                      className="pl-10 h-11"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        type="password"
                        value={registerData.password}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            password: e.target.value,
                          })
                        }
                        placeholder="Tối thiểu 6 ký tự"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                      <Input
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) =>
                          setRegisterData({
                            ...registerData,
                            confirmPassword: e.target.value,
                          })
                        }
                        placeholder="Nhập lại mật khẩu"
                        className="pl-10 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bạn là
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setRegisterData({ ...registerData, role: "landlord" })
                      }
                      className={`p-4 border-2 rounded-xl transition-all ${
                        registerData.role === "landlord"
                          ? "border-green-600 bg-green-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Building2
                        className={`size-6 mx-auto mb-2 ${
                          registerData.role === "landlord"
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="font-medium text-sm">Chủ trọ</div>
                      <div className="text-xs text-gray-500">
                        Đăng tin cho thuê
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setRegisterData({ ...registerData, role: "user" })
                      }
                      className={`p-4 border-2 rounded-xl transition-all ${
                        registerData.role === "user"
                          ? "border-blue-600 bg-blue-50 shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <User
                        className={`size-6 mx-auto mb-2 ${
                          registerData.role === "user"
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="font-medium text-sm">Người tìm trọ</div>
                      <div className="text-xs text-gray-500">Tìm phòng ở</div>
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                    <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12 text-base font-semibold"
                >
                  Đăng ký tài khoản
                </Button>
              </form>
            )}

            {/* Toggle between Login/Register */}
            <div className="text-center mt-4">
              {mode === "login" ? (
                <p className="text-sm text-gray-600">
                  Chưa có tài khoản?{" "}
                  <button
                    onClick={() => {
                      setMode("register");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-green-600 hover:text-green-700 font-semibold hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <button
                    onClick={() => {
                      setMode("login");
                      setError("");
                      setSuccess("");
                    }}
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Hoặc</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                onClick={() => handleSocialLogin("google")}
              >
                <svg className="size-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Tiếp tục với Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                onClick={() => handleSocialLogin("zalo")}
              >
                <svg className="size-5 mr-2" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" fill="#0068FF" />
                  <path
                    d="M15 22.5C15 19.5 17.5 17 20.5 17H27.5C30.5 17 33 19.5 33 22.5V25.5C33 28.5 30.5 31 27.5 31H24L19 35V31C16.8 31 15 29.2 15 27V22.5Z"
                    fill="white"
                  />
                </svg>
                Tiếp tục với Zalo
              </Button>
            </div>

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Quay về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
