import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Home,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  User,
} from "lucide-react";
import {
  validateEmail,
  validatePassword,
  validateToken,
  validatePasswordMatch,
  validateCurrentPassword,
} from "@/app/utils/validationRules";

type Step = "choose" | "manual" | "email" | "reset" | "success";

interface CurrentUser {
  email?: string;
  username?: string;
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();

  // State management
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [fetchingUser, setFetchingUser] = useState(false);

  // Error state
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    currentPassword: "",
    token: "",
    password: "",
    confirmPassword: "",
  });

  // Reset form states
  const resetFormStates = () => {
    setEmail("");
    setCurrentPassword("");
    setResetToken("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setErrors({
      email: "",
      currentPassword: "",
      token: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Fetch current user info
  const fetchCurrentUser = async () => {
    setFetchingUser(true);
    try {
      const response = await api.get("/api/auth/me");
      setCurrentUser({
        email: response.data.email,
        username: response.data.username,
      });
    } catch (err: any) {
      console.error("Error fetching user:", err);
      // If fetch fails, still allow user to proceed
      setCurrentUser(null);
    } finally {
      setFetchingUser(false);
    }
  };

  // Manual password change
  const handleManualPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({
      email: "",
      currentPassword: "",
      token: "",
      password: "",
      confirmPassword: "",
    });

    // Validate current password
    const currentPasswordValidation = validateCurrentPassword(currentPassword);
    if (!currentPasswordValidation.valid) {
      setErrors((prev) => ({
        ...prev,
        currentPassword: currentPasswordValidation.error,
      }));
      return;
    }

    // Validate new password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setErrors((prev) => ({ ...prev, password: passwordValidation.error }));
      return;
    }

    // Validate password match
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.valid) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: matchValidation.error,
      }));
      return;
    }

    setLoading(true);
    try {
      await api.put("/api/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setStep("success");
      toast.success("Đổi mật khẩu thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Có lỗi xảy ra";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request password reset token
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({
      email: "",
      currentPassword: "",
      token: "",
      password: "",
      confirmPassword: "",
    });

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setErrors((prev) => ({ ...prev, email: emailValidation.error }));
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/forgot-password", { email });
      setStep("reset");
      // Pre-fill token if returned (for development/testing)
      if (response.data.token) {
        setResetToken(response.data.token);
      }
      toast.success("Kiểm tra email của bạn để nhận mã đặt lại mật khẩu");
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Có lỗi xảy ra";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Reset password with token
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setErrors({
      email: "",
      currentPassword: "",
      token: "",
      password: "",
      confirmPassword: "",
    });

    // Validate token
    const tokenValidation = validateToken(resetToken);
    if (!tokenValidation.valid) {
      setErrors((prev) => ({
        ...prev,
        token: tokenValidation.error,
      }));
      return;
    }

    // Validate password
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      setErrors((prev) => ({ ...prev, password: passwordValidation.error }));
      return;
    }

    // Validate password match
    const matchValidation = validatePasswordMatch(newPassword, confirmPassword);
    if (!matchValidation.valid) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: matchValidation.error,
      }));
      return;
    }

    setLoading(true);
    try {
      // First verify the reset code
      await api.post("/api/auth/verify-reset-code", {
        email,
        token: resetToken,
      });

      // If verification succeeds, reset the password
      await api.post("/api/auth/reset-password", {
        email,
        token: resetToken,
        newPassword,
      });
      setStep("success");
      toast.success("Đặt lại mật khẩu thành công!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || "Có lỗi xảy ra";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-slate-50 flex font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden relative">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-60">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-100/60 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-blue-100/60 blur-[110px] rounded-full" />
      </div>

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
              <p className="text-white/80 mt-2 text-lg">
                Tìm đúng trọ - Ở đúng nơi
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10 bg-white/10 lg:bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[500px]"
        >
          {/* Glass Card Container */}
          <div className="bg-white/95 backdrop-blur-3xl border border-white shadow-[0_40px_120px_-20px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-8 lg:p-12 space-y-8 overflow-hidden relative group">
            {/* Subtle Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />

            {/* Back Button */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium mb-2"
            >
              <ArrowLeft className="size-4" />
              Quay lại đăng nhập
            </button>

            {/* Header */}
            <header className="space-y-3 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:hidden flex justify-center mb-6"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Lock className="size-8 text-white" />
                </div>
              </motion.div>

              <h2 className="text-3xl lg:text-4xl font-[900] bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent tracking-tight leading-tight">
                {step === "choose"
                  ? "Quên mật khẩu?"
                  : step === "manual"
                    ? "Đổi mật khẩu"
                    : step === "email"
                      ? "Xác thực qua Email"
                      : step === "reset"
                        ? "Đặt lại mật khẩu"
                        : "Thành công!"}
              </h2>
              <p className="text-slate-400 font-semibold text-lg leading-relaxed">
                {step === "choose"
                  ? "Chọn phương pháp để khôi phục tài khoản của bạn"
                  : step === "manual"
                    ? "Nhập mật khẩu hiện tại và mật khẩu mới"
                    : step === "email"
                      ? "Nhập email của bạn để nhận mã đặt lại"
                      : step === "reset"
                        ? "Nhập mã và mật khẩu mới của bạn"
                        : "Mật khẩu của bạn đã được đặt lại thành công"}
              </p>
            </header>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-gap-3 gap-3 bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <AlertCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 font-medium">{error}</p>
              </motion.div>
            )}

            {/* Step 0: Choose Method */}
            {step === "choose" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {/* Manual Password Change Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={async () => {
                    resetFormStates();
                    setStep("manual");
                    await fetchCurrentUser();
                  }}
                  type="button"
                  className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 transition-all group"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 group-hover:bg-emerald-200 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Lock className="size-6 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        Đổi mật khẩu thủ công
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Thay đổi mật khẩu bằng cách nhập mật khẩu hiện tại
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>

                {/* Email Verification Card */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    resetFormStates();
                    setStep("email");
                  }}
                  type="button"
                  className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50/50 transition-all group"
                >
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center flex-shrink-0 transition-colors">
                      <Mail className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900">
                        Xác thực qua Email
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Nhận mã xác nhận qua email để đặt lại mật khẩu
                      </p>
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </motion.button>
              </motion.div>
            )}

            {/* Step 0.5: Manual Password Change */}
            {step === "manual" && (
              <motion.form
                onSubmit={handleManualPasswordChange}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Current Account Info */}
                {fetchingUser ? (
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 animate-pulse">
                    <div className="w-5 h-5 bg-slate-200 rounded-full" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-slate-200 rounded w-32" />
                    </div>
                  </div>
                ) : currentUser?.email || currentUser?.username ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <User className="size-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-600 font-semibold uppercase">
                        Tài khoản hiện tại
                      </p>
                      <p className="text-sm font-bold text-emerald-900">
                        {currentUser.email || currentUser.username}
                      </p>
                    </div>
                  </motion.div>
                ) : null}

                {/* Current Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          currentPassword: "",
                        }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                        errors.currentPassword
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white/50 hover:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.currentPassword && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.currentPassword}
                    </p>
                  )}
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Mật khẩu mới
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                        errors.password
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white/50 hover:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({
                          ...prev,
                          confirmPassword: "",
                        }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white/50 hover:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Button Group */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep("choose")}
                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-xl transition-all"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? "Đang đổi..." : "Đổi mật khẩu"}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Step 1: Email Request */}
            {step === "email" && (
              <motion.form
                onSubmit={handleRequestReset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Email Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="bạn@example.com"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                        errors.email
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white/50 hover:bg-white"
                      }`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep("choose")}
                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-xl transition-all"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? "Đang gửi..." : "Gửi mã đặt lại"}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Step 2: Reset Password */}
            {step === "reset" && (
              <motion.form
                onSubmit={handleResetPassword}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Token Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Mã đặt lại mật khẩu
                  </label>
                  <input
                    type="text"
                    value={resetToken}
                    onChange={(e) => {
                      setResetToken(e.target.value);
                      setErrors((prev) => ({ ...prev, token: "" }));
                    }}
                    placeholder="Nhập mã từ email của bạn"
                    className={`w-full px-4 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                      errors.token
                        ? "border-red-300 bg-red-50/50"
                        : "border-slate-200 bg-white/50 hover:bg-white"
                    }`}
                  />
                  {errors.token && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.token}
                    </p>
                  )}
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Mật khẩu mới
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                        errors.password
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white/50 hover:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-slate-700">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      placeholder="••••••••"
                      className={`w-full pl-12 pr-12 py-3 rounded-xl border font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 ${
                        errors.confirmPassword
                          ? "border-red-300 bg-red-50/50"
                          : "border-slate-200 bg-white/50 hover:bg-white"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-600 font-medium">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep("email")}
                    className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold rounded-xl transition-all"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                  >
                    {loading ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
                  </Button>
                </div>
              </motion.form>
            )}

            {/* Step 3: Success */}
            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
                >
                  <CheckCircle className="size-8 text-green-600" />
                </motion.div>
                <div className="text-center space-y-2">
                  <p className="text-slate-700 font-semibold">
                    Mật khẩu của bạn đã được đặt lại thành công!
                  </p>
                  <p className="text-slate-500 text-sm">
                    Bạn sẽ được chuyển về trang đăng nhập trong giây lát...
                  </p>
                </div>
                <Button
                  onClick={() => navigate("/login")}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                >
                  Đăng nhập ngay
                </Button>
              </motion.div>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent" />
              <span className="text-xs text-slate-400 font-medium">hoặc</span>
              <div className="flex-1 h-px bg-gradient-to-l from-slate-200 to-transparent" />
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-between gap-4 text-xs font-medium">
              <button
                onClick={() => navigate("/login")}
                className="text-slate-600 hover:text-emerald-600 transition-colors"
              >
                Có tài khoản? Đăng nhập
              </button>
              <button
                onClick={() => navigate("/register")}
                className="text-emerald-600 hover:text-emerald-700 font-bold"
              >
                Tạo tài khoản mới
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
