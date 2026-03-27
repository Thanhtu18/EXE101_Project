import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";


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
  const { login, register, googleLogin } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
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
    role: "landlord" as "landlord" | "user" | "admin",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await login(loginUsername, loginPassword);
      if (result.success) {
        toast.success("Đăng nhập thành công!");
        // Redirect dựa trên role
        if (result.role === "admin") {
          navigate("/admin/dashboard");
        } else if (result.role === "landlord") {
          navigate("/landlord/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || "Tài khoản hoặc mật khẩu không đúng");
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi khi đăng nhập");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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
    try {
      const result = await register(dataToSubmit as any);
      if (result.success) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
        setTimeout(() => {
          setMode("login");
          setSuccess("");
          // Điền sẵn username vừa đăng ký
          setLoginUsername(registerData.username);
        }, 1500);
      } else {
        setError(result.message || "Đăng ký thất bại");
      }
    } catch (err: any) {
      setError(err?.message || "Lỗi khi đăng ký");
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      // For useGoogleLogin 'implicit' flow, we get access_token. 
      // But the backend expects idToken. 
      // Actually, if we use the GSI button, we get idToken. 
      // If we use useGoogleLogin, we usually get access_token.
      // I'll use the idToken flow.
      setError("");
      const result = await googleLogin({ idToken: tokenResponse.credential });
      if (result.success) {
        if (result.role === "admin") navigate("/admin/dashboard");
        else if (result.role === "landlord") navigate("/landlord/dashboard");
        else navigate("/");
      } else {
        setError(result.message || "Đăng nhập Google thất bại");
      }
    } catch (err) {
      setError("Lỗi khi xử lý đăng nhập Google");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setError("");
        const result = await googleLogin({
          accessToken: tokenResponse.access_token,
          role: mode === "register" ? registerData.role : undefined,
        });
        if (result.success) {
          toast.success("Đăng nhập bằng Google thành công!");
          if (result.role === "admin") navigate("/admin/dashboard");
          else if (result.role === "landlord") navigate("/landlord/dashboard");
          else navigate("/");
        } else {
          setError(result.message || "Đăng nhập Google thất bại");
        }
      } catch (err) {
        setError("Lỗi khi xử lý đăng nhập Google");
      }
    },
    onError: () => setError("Đăng nhập Google thất bại"),
  });





  return (
    <div className="min-h-screen w-screen bg-gray-50 flex">
      {/* Left Side - Image with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0a0a0a] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80)",
          }}
        />
        
        {/* Animated Aura Blobs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-green-500/20 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-600/20 blur-[100px] rounded-full"
        />

        {/* Logo Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center justify-center w-full text-white"
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Home className="size-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold tracking-tight">MapHome</h1>
              <p className="text-white/80 mt-2 text-lg">Tìm đúng trọ - Ở đúng nơi</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
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

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-6 md:p-10 border border-white/50 relative overflow-hidden">
            {/* Subtle light leak */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/5 blur-3xl rounded-full" />
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
            </h2>

            <AnimatePresence mode="wait">
              {mode === "login" ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
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

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12 text-base font-bold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      >
                        Đăng nhập
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ và tên
                        </label>
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
                          className="h-11"
                          required
                        />
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
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setRegisterData({ ...registerData, role: "landlord" })
                          }
                          className={`p-4 border-2 rounded-xl transition-all ${
                            registerData.role === "landlord"
                              ? "border-green-600 bg-green-50 shadow-md scale-105"
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
                          <div className="font-bold text-[13px]">Chủ trọ</div>
                          <div className="text-[10px] text-gray-500">
                            Đăng tin
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRegisterData({ ...registerData, role: "user" })
                          }
                          className={`p-4 border-2 rounded-xl transition-all ${
                            registerData.role === "user"
                              ? "border-blue-600 bg-blue-50 shadow-md scale-105"
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
                          <div className="font-bold text-[13px]">Người tìm</div>
                          <div className="text-[10px] text-gray-500">Tìm phòng</div>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRegisterData({ ...registerData, role: "admin" })
                          }
                          className={`p-4 border-2 rounded-xl transition-all ${
                            registerData.role === "admin"
                              ? "border-purple-600 bg-purple-50 shadow-md scale-105"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Shield
                            className={`size-6 mx-auto mb-2 ${
                              registerData.role === "admin"
                                ? "text-purple-600"
                                : "text-gray-400"
                            }`}
                          />
                          <div className="font-bold text-[13px]">Quản trị</div>
                          <div className="text-[10px] text-gray-500">Quản lý</div>
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
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-12 text-base font-semibold shadow-lg transition-all"
                    >
                      Đăng ký ngay
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

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
              <div className="w-full">
                <Button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  variant="outline"
                  className="w-full h-11 border-gray-300 hover:bg-gray-50 hover:border-gray-400 shadow-sm transition-all duration-200 flex items-center justify-center gap-3 rounded-xl bg-white"
                >
                  <svg className="size-5" viewBox="0 0 48 48">
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.01c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                  </svg>
                  <span className="text-gray-700 font-semibold">
                    {mode === "login"
                      ? "Đăng nhập bằng Google"
                      : "Đăng ký bằng Google"}
                  </span>
                </Button>
              </div>




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
        </motion.div>
      </div>
    </div>
  );
}
