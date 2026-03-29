import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import api from "@/app/utils/api";
import { getAvatarUrl, getInitials } from "@/app/utils/avatarUtils";
import { RentalProperty, VerificationRequest } from "@/app/components/types";
import { Button } from "@/app/components/ui/button";
import { RequestVerificationDialog } from "@/app/components/RequestVerificationDialog";
import { SubscriptionManagement } from "@/app/components/SubscriptionManagement";
import { EditPropertyDialog } from "@/app/components/EditPropertyDialog";
import {
  Home,
  LogOut,
  FileText,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  MapPin,
  DollarSign,
  Maximize,
  CheckCircle,
  Clock,
  XCircle,
  CalendarDays,
  TrendingUp,
  Star,
  ShieldCheck,
  Award,
  CreditCard,
  LayoutDashboard,
  Settings,
  X,
  Camera,
  Upload,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";

// Active tab type
type DashboardTab =
  | "overview"
  | "posts"
  | "bookings"
  | "subscription"
  | "verification"
  | "settings";

// Sidebar menu items
const menuItems: Array<{
  id: DashboardTab;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
  { id: "posts", label: "Tin đăng của tôi", icon: FileText },
  { id: "bookings", label: "Lịch hẹn", icon: CalendarDays },
  { id: "subscription", label: "Gói đăng ký", icon: CreditCard },
  { id: "verification", label: "Yêu cầu xác thực", icon: ShieldCheck },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export function LandlordDashboardV2() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, isAuthenticated, updateUser } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RentalProperty | null>(
    null,
  );

  // States for API data
  const [landlordPosts, setLandlordPosts] = useState<RentalProperty[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    approvedPosts: 0,
    pendingPosts: 0,
    totalViews: 0,
    totalFavorites: 0,
  });
  const [verificationPricing, setVerificationPricing] = useState({
    basicVerification: 0,
    premiumVerification: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => Promise<void> | void;
  }>({ open: false });

  // Get active tab from URL params, default to 'overview'
  const activeTab = (searchParams.get("tab") as DashboardTab) || "overview";

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "landlord") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (activeTab === "overview") {
          const response = await api.get("/api/landlord/analytics");
          const data = response.data;
          setStats({
            totalPosts: data.totalProperties || 0,
            approvedPosts: data.approvedProperties || 0,
            pendingPosts: data.pendingProperties || 0,
            totalViews: data.totalViews || 0,
            totalFavorites: data.totalFavorites || 0,
          });
        } else if (activeTab === "posts") {
          const response = await api.get("/api/landlord/properties");
          setLandlordPosts(response.data);
        } else if (activeTab === "bookings") {
          const response = await api.get("/api/landlord/bookings");
          setBookings(response.data);
        } else if (activeTab === "verification") {
          const [reqsRes, pricingRes] = await Promise.all([
            api.get("/api/landlord/verification-requests"),
            api.get("/api/verifications/pricing"),
          ]);
          setVerificationRequests(reqsRes.data);
          setVerificationPricing(pricingRes.data);
        }
      } catch (err) {
        console.error("Failed to fetch landlord data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, navigate, activeTab]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const setActiveTab = (tab: DashboardTab) => {
    setSearchParams({ tab });
  };

  const getStatusBadge = (status: "approved" | "pending" | "rejected") => {
    const badges = {
      approved: {
        label: "Đã duyệt",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      pending: {
        label: "Chờ duyệt",
        color: "bg-orange-100 text-orange-800",
        icon: Clock,
      },
      rejected: {
        label: "Từ chối",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color} flex items-center gap-1 w-fit`}
      >
        <Icon className="size-3" />
        {badge.label}
      </span>
    );
  };

  const getVerificationBadge = (level: number) => {
    const badges = [
      { label: "Chưa xác thực", color: "bg-gray-100 text-gray-800" },
      { label: "Cấp 1", color: "bg-yellow-100 text-yellow-800" },
      { label: "Cấp 2", color: "bg-blue-100 text-blue-800" },
      { label: "Cấp 3", color: "bg-green-100 text-green-800" },
    ];
    const badge = badges[level] || badges[0];
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
      >
        {badge.label}
      </span>
    );
  };

  if (!isAuthenticated || user?.role !== "landlord") {
    return null;
  }

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "subscription":
        return (
          <motion.div
            key="subscription"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SubscriptionManagement />
          </motion.div>
        );

      case "verification":
        return (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tight">
                Xác thực tin đăng
              </h2>
              <p className="text-indigo-400/90 text-lg font-black mt-1 drop-shadow-sm">
                Nâng tầm uy tín cho phòng trọ của bạn với "Tích xanh MapHome"
              </p>
            </div>

            {/* Premium Verification Banner */}
            <div className="relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 shadow-2xl shadow-green-100">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
              <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-700" />

              <div className="relative z-10 p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex gap-8 items-center max-w-xl">
                  <div className="flex-shrink-0 w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center shadow-xl border border-white/20">
                    <ShieldCheck className="size-14 text-white" />
                  </div>
                  <div className="text-white">
                    <h3 className="text-3xl font-black mb-3 tracking-tight">
                      Gói xác thực thực tế
                    </h3>
                    <p className="text-green-50 text-lg font-medium opacity-90 leading-relaxed">
                      Chuyên viên sẽ đến kiểm tra thực trạng phòng trọ • Chỉ với{" "}
                      <span className="underline font-black">
                        {verificationPricing.basicVerification.toLocaleString()}
                        đ
                      </span>{" "}
                      • Tăng 5x tỉ lệ khách thuê.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowVerificationDialog(true)}
                  className="bg-white text-emerald-700 hover:bg-emerald-50 px-10 py-8 rounded-2xl text-lg font-black shadow-2xl hover:translate-y-[-4px] transition-all active:scale-95 group border-none"
                >
                  <ShieldCheck className="size-6 mr-3 group-hover:rotate-12 transition-transform" />
                  Đặt lịch kiểm tra ngay
                </Button>
              </div>
            </div>

            {/* Verification Requests List */}
            {verificationRequests.length > 0 ? (
              <div className="space-y-6">
                <h4 className="font-black text-2xl bg-gradient-to-r from-slate-800 to-indigo-900 bg-clip-text text-transparent flex items-center gap-3 ml-2">
                  <div className="p-2 bg-orange-100/50 rounded-xl">
                    <Clock className="size-6 text-orange-600" />
                  </div>
                  Lịch sử yêu cầu
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                  {verificationRequests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="p-3 bg-white/50 rounded-2xl">
                          <FileText className="size-6 text-gray-700" />
                        </div>
                        <span
                          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider ${
                            req.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : req.status === "approved"
                                ? "bg-blue-100 text-blue-700 border border-blue-200"
                                : req.status === "rejected"
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : "bg-orange-100 text-orange-700 border border-orange-200 animate-pulse"
                          }`}
                        >
                          {req.status === "completed"
                            ? "✓ Hoàn thành"
                            : req.status === "approved"
                              ? "✓ Đã duyệt"
                              : req.status === "rejected"
                                ? "✗ Từ chối"
                                : "⏳ Đang xử lý"}
                        </span>
                      </div>
                      <h4 className="font-black text-2xl text-gray-900 mb-2 truncate">
                        {req.propertyName}
                      </h4>
                      <div className="space-y-3 mb-6">
                        <p className="text-gray-500 font-bold flex items-center gap-2 text-sm">
                          <MapPin className="size-4 text-emerald-500" />
                          <span className="truncate">{req.address}</span>
                        </p>
                        <p className="text-gray-900 font-black flex items-center gap-2">
                          <CalendarDays className="size-4 text-blue-600" />
                          {new Date(req.scheduledDate).toLocaleDateString(
                            "vi-VN",
                          )}{" "}
                          • {req.scheduledTime}
                        </p>
                      </div>

                      {req.notes && (
                        <div className="p-4 bg-white/30 rounded-2xl border border-white/20">
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-tighter mb-1">
                            Ghi chú từ MapHome
                          </p>
                          <p className="text-sm text-gray-700 font-medium italic">
                            "{req.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-20 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner rotate-3">
                  <ShieldCheck className="size-12 text-gray-400" />
                </div>
                <h3 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-emerald-600 to-blue-700 bg-clip-text text-transparent mb-3 tracking-tight">
                  Chưa có yêu cầu nào
                </h3>
                <p className="text-emerald-500 text-lg font-black mb-10 max-w-sm mx-auto drop-shadow-sm">
                  Hãy đăng ký kiểm tra thực tế để nâng cấp phòng trọ của bạn lên
                  tiêu chuẩn 5 sao.
                </p>
                <Button
                  onClick={() => setShowVerificationDialog(true)}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-10 py-7 rounded-2xl shadow-2xl shadow-green-100 transition-all hover:scale-105 active:scale-95 text-lg font-black"
                >
                  <ShieldCheck className="size-5 mr-3" />
                  Bắt đầu ngay
                </Button>
              </div>
            )}
          </motion.div>
        );

      case "bookings":
        return (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-10"
          >
            <div>
              <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent tracking-tight">
                Lịch hẹn xem phòng
              </h2>
              <p className="text-indigo-400/90 text-lg font-black mt-1 drop-shadow-sm">
                Quản lý và điều phối các yêu cầu gặp mặt từ khách hàng
              </p>
            </div>

            {bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <div className="p-3 bg-white/60 rounded-2xl w-fit mb-4">
                          <Home className="size-6 text-blue-600" />
                        </div>
                        <h4 className="font-black text-2xl text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-2">
                          {booking.propertyId?.name || "Căn hộ/Phòng trọ"}
                        </h4>
                        <p className="text-sm font-bold text-gray-400 flex items-center gap-1">
                          <MapPin className="size-4" />{" "}
                          {booking.propertyId?.address || "Hồ Chí Minh"}
                        </p>
                      </div>
                      <span
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          booking.status === "confirmed"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : booking.status === "completed"
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : booking.status === "cancelled"
                                ? "bg-rose-100 text-rose-700 border border-rose-200"
                                : "bg-orange-100 text-orange-700 border border-orange-200 animate-pulse"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Đã xác nhận"
                          : booking.status === "completed"
                            ? "Hoàn thành"
                            : booking.status === "cancelled"
                              ? "Đã huỷ"
                              : "Đang chờ"}
                      </span>
                    </div>

                    <div className="bg-gray-50 rounded-3xl p-6 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6 border border-gray-100">
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          Thời gian dự kiến
                        </p>
                        <p className="font-black text-gray-900 flex items-center gap-2">
                          <Clock className="size-5 text-emerald-500" />
                          {booking.bookingTime} •{" "}
                          {new Date(booking.bookingDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          Khách hàng
                        </p>
                        <p className="font-black text-gray-900 flex items-center gap-2">
                          <User className="size-5 text-blue-500" />
                          {booking.customerName}
                        </p>
                        <p className="text-xs font-bold text-gray-400 ml-7">
                          {booking.customerPhone}
                        </p>
                      </div>
                      {booking.note && (
                        <div className="col-span-full pt-4 border-t border-gray-100/50">
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">
                            Ghi chú thêm
                          </p>
                          <p className="text-sm text-gray-600 font-medium italic bg-white/30 p-4 rounded-2xl border border-white/20 leading-relaxed">
                            "{booking.note}"
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 pt-2">
                      {booking.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            className="flex-1 py-7 rounded-2xl font-black text-rose-500 hover:bg-rose-50 border-2 border-transparent hover:border-rose-100 transition-all"
                            onClick={async () => {
                              try {
                                const res = await api.put(
                                  `/api/bookings/${booking._id}/status`,
                                  { status: "cancelled" },
                                );
                                if (res.status === 200) {
                                  toast.success("Đã từ chối lịch hẹn. ❌");
                                  setTimeout(
                                    () => window.location.reload(),
                                    1000,
                                  );
                                }
                              } catch (err) {
                                toast.error("Không thể cập nhật trạng thái.");
                              }
                            }}
                          >
                            <Trash2 className="size-5 mr-2" />
                            Từ chối
                          </Button>
                          <Button
                            className="flex-1 py-7 bg-gray-900 hover:bg-black text-white rounded-2xl font-black shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                            onClick={async () => {
                              try {
                                const res = await api.put(
                                  `/api/bookings/${booking._id}/status`,
                                  { status: "confirmed" },
                                );
                                if (res.status === 200) {
                                  toast.success("Đã xác nhận lịch hẹn! 📅");
                                  setTimeout(
                                    () => window.location.reload(),
                                    1000,
                                  );
                                }
                              } catch (err) {
                                toast.error("Không thể xác nhận lịch hẹn.");
                              }
                            }}
                          >
                            <CheckCircle className="size-5 mr-2" />
                            Xác nhận lịch
                          </Button>
                        </>
                      )}

                      {booking.status === "confirmed" && (
                        <Button
                          className="w-full py-7 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 transition-all hover:scale-[1.02] active:scale-95"
                          onClick={async () => {
                            try {
                              const res = await api.put(
                                `/api/bookings/${booking._id}/status`,
                                { status: "completed" },
                              );
                              if (res.status === 200) {
                                toast.success(
                                  "Đã hoàn thành lượt xem phòng! ✨",
                                );
                                setTimeout(
                                  () => window.location.reload(),
                                  1000,
                                );
                              }
                            } catch (err) {
                              toast.error("Không thể cập nhật trạng thái.");
                            }
                          }}
                        >
                          <CheckCircle className="size-5 mr-2" />
                          Đã hoàn thành xem phòng
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-sm p-20 text-center mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner -rotate-3">
                  <CalendarDays className="size-12 text-gray-400" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">
                  Chưa có lịch hẹn nào
                </h3>
                <p className="text-gray-500 text-lg font-medium mb-10 max-w-sm mx-auto">
                  Bạn sẽ nhận được thông báo khi có khách hàng muốn xem phòng
                  của bạn.
                </p>
              </div>
            )}
          </motion.div>
        );

      case "settings":
        return (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tight mb-2">
                Cài đặt tài khoản
              </h2>
              <p className="text-indigo-400 font-black drop-shadow-sm text-lg">
                Quản lý bảo mật và thông ẩn danh tính cá nhân
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Info */}
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
                <h3 className="font-black text-2xl bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                  <div className="p-2 bg-blue-100/50 rounded-xl shadow-inner">
                    <Settings className="size-6 text-blue-600" />
                  </div>
                  Thông tin cá nhân
                </h3>

                <div className="flex flex-col md:flex-row items-start gap-10">
                  {/* Avatar Section */}
                  <div className="flex flex-col items-center gap-5">
                    <div className="relative group">
                      <div className="w-40 h-40 rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-green-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-5xl font-black transform transition-transform group-hover:scale-105">
                        {user?.avatar ? (
                          <img
                            src={getAvatarUrl(user.avatar) || ""}
                            alt="Avatar"
                            className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
                          />
                        ) : (
                          getInitials(user?.fullName, user?.username)
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                          <Camera className="size-10 text-white" />
                        </div>
                      </div>
                      <label className="absolute -bottom-4 -right-4 p-4 bg-green-600 text-white rounded-2xl shadow-2xl cursor-pointer hover:bg-green-700 transition-all transform hover:scale-110 active:scale-95 group">
                        <Camera className="size-6 group-hover:rotate-12 transition-transform" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const formData = new FormData();
                            formData.append("image", file);

                            const loadingToast = toast.loading(
                              "Đang tải ảnh lên...",
                            );
                            try {
                              const uploadRes = await api.post(
                                "/api/upload/single",
                                formData,
                              );

                              if (
                                uploadRes.status === 200 ||
                                uploadRes.status === 201
                              ) {
                                const { url } = uploadRes.data;
                                const updateRes = await api.put(
                                  `/api/user/${user?.id}`,
                                  { avatar: url },
                                );

                                if (updateRes.status === 200) {
                                  updateUser(updateRes.data);
                                  toast.success(
                                    "Thay đổi ảnh đại diện thành công! ✨",
                                    { id: loadingToast },
                                  );
                                  setTimeout(
                                    () => window.location.reload(),
                                    800,
                                  );
                                }
                              }
                            } catch (err) {
                              console.error(err);
                              toast.error("Lỗi không thể tải ảnh. ❌", {
                                id: loadingToast,
                              });
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-indigo-600 font-black uppercase tracking-[0.2em]">
                        Thay đổi chân dung
                      </p>
                      <p className="text-[9px] text-gray-400 mt-1 max-w-[120px] leading-relaxed">
                        JPG hoặc PNG. Tối đa 2MB.
                      </p>
                    </div>
                  </div>

                  {/* Form Section */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const target = e.target as any;
                      const fullName = target.fullName.value;
                      const phone = target.phone.value;

                      const updateToast = toast.loading("Đang cập nhật...");
                      try {
                        const res = await api.put(`/api/user/${user?.id}`, {
                          fullName,
                          phone,
                        });
                        if (res.status === 200) {
                          updateUser(res.data);
                          toast.success("Hồ sơ đã được lưu! ✨", {
                            id: updateToast,
                          });
                          setTimeout(() => window.location.reload(), 800);
                        }
                      } catch (err: any) {
                        toast.error(
                          err.response?.data?.message || "Không thể lưu hồ sơ.",
                          { id: updateToast },
                        );
                      }
                    }}
                    className="flex-1 space-y-6 w-full"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          Họ và tên
                        </label>
                        <input
                          name="fullName"
                          defaultValue={user?.fullName || user?.username}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white rounded-[24px] outline-none transition-all shadow-inner font-bold text-slate-800 placeholder:text-slate-300"
                          placeholder="Nguyễn Văn A"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">
                          Số điện thoại
                        </label>
                        <input
                          name="phone"
                          defaultValue={user?.phone || ""}
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 focus:border-indigo-500 focus:bg-white rounded-[24px] outline-none transition-all shadow-inner font-bold text-slate-800 placeholder:text-slate-300"
                          placeholder="09xx xxx xxx"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                        Email
                        <span className="text-[9px] bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full font-black uppercase tracking-widest">
                          Cố định
                        </span>
                      </label>
                      <input
                        disabled
                        value={user?.email || ""}
                        className="w-full px-6 py-5 bg-slate-100 border-2 border-transparent text-slate-400 rounded-[24px] cursor-not-allowed font-bold"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full md:w-auto px-12 py-8 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:opacity-90 text-white font-black rounded-[24px] transition-all shadow-[0_15px_40px_rgba(59,130,246,0.3)] hover:scale-[1.03] active:scale-95 border-none"
                    >
                      Lưu thay đổi hồ sơ
                    </Button>
                  </form>
                </div>
              </div>

              {/* Security Card */}
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8">
                <h3 className="font-black text-2xl bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent mb-8 flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/50 rounded-xl shadow-inner">
                    <ShieldCheck className="size-6 text-emerald-600" />
                  </div>
                  Bảo mật
                </h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    const currentPassword = target.currentPassword.value;
                    const newPassword = target.newPassword.value;

                    const changeToast = toast.loading(
                      "Đang xác thực bảo mật...",
                    );
                    try {
                      const res = await api.put("/api/auth/change-password", {
                        currentPassword,
                        newPassword,
                      });
                      if (res.status === 200) {
                        toast.success("Đổi mật khẩu thành công! 🔐", {
                          id: changeToast,
                        });
                        setTimeout(() => {
                          logout();
                          navigate("/login");
                        }, 1500);
                      }
                    } catch (err: any) {
                      toast.error(
                        err.response?.data?.message ||
                          "Xác thực không chính xác.",
                        { id: changeToast },
                      );
                    }
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-white/60 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-900"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="••••••••"
                      className="w-full px-5 py-4 bg-white/60 border-2 border-transparent focus:border-emerald-500 rounded-2xl outline-none transition-all shadow-inner font-medium text-gray-900"
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full py-7 bg-gray-900 hover:bg-black text-white font-black rounded-2xl transition-all shadow-2xl flex items-center justify-center gap-2"
                    >
                      <ShieldCheck className="size-5" />
                      Cập nhật bảo mật
                    </Button>
                  </div>
                </form>
                <div className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                  <p className="text-[11px] text-amber-700 leading-relaxed font-medium">
                    🔍 <strong className="uppercase">Lưu ý:</strong> Sau khi đổi
                    mật khẩu, bạn sẽ cần đăng nhập lại trên tất cả các thiết bị
                    để đảm bảo an toàn.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case "overview":
      default:
        return (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-10"
          >
            {/* Page Header */}
            {activeTab === "overview" && (
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="text-5xl font-black text-slate-900 tracking-tight leading-tight mb-3"
                  >
                    Chào buổi sáng, <br />
                    <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">
                      {user?.fullName || user?.username}!
                    </span>
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-indigo-600/60 text-xl font-bold"
                  >
                    Dưới đây là thống kê hiệu suất bài đăng của bạn hôm nay.
                  </motion.p>
                </div>
                <div className="flex bg-white/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200 shadow-sm overflow-hidden self-start">
                  <div className="px-4 py-2 bg-white rounded-xl shadow-lg shadow-slate-200/50 font-black text-indigo-600 text-sm">
                    Hôm nay
                  </div>
                  <div className="px-4 py-2 font-bold text-indigo-400 text-sm hover:text-indigo-600 cursor-pointer transition-colors">
                    7 ngày qua
                  </div>
                </div>
              </div>
            )}

            {activeTab === "overview" && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
              >
                {[
                  {
                    label: "Tổng tin đăng",
                    value: stats.totalPosts,
                    icon: FileText,
                    color: "blue",
                    trend: "+2",
                  },
                  {
                    label: "Đã duyệt",
                    value: stats.approvedPosts,
                    icon: CheckCircle,
                    color: "emerald",
                    trend: "0",
                  },
                  {
                    label: "Chờ duyệt",
                    value: stats.pendingPosts,
                    icon: Clock,
                    color: "orange",
                    trend: "-1",
                  },
                  {
                    label: "Lượt xem",
                    value: stats.totalViews.toLocaleString(),
                    icon: Eye,
                    color: "purple",
                    trend: "+12%",
                  },
                  {
                    label: "Yêu thích",
                    value: stats.totalFavorites,
                    icon: Star,
                    color: "amber",
                    trend: "+5",
                  },
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    variants={{
                      hidden: { opacity: 0, y: 30, scale: 0.95 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { type: "spring", bounce: 0.4 },
                      },
                    }}
                    whileHover={{
                      y: -12,
                      scale: 1.05,
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      },
                    }}
                    className={`relative overflow-hidden rounded-[40px] p-8 shadow-xl shadow-slate-200/40 group transition-all duration-500 bg-white/80 backdrop-blur-3xl border border-white/50`}
                  >
                    {/* Background Aura Effect (Subtle) */}
                    <div
                      className={`absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700 bg-gradient-to-br ${
                        stat.color === "blue"
                          ? "from-blue-600 to-indigo-700"
                          : stat.color === "emerald"
                            ? "from-emerald-500 to-teal-600"
                            : stat.color === "orange"
                              ? "from-orange-500 to-amber-600"
                              : stat.color === "purple"
                                ? "from-purple-600 to-indigo-800"
                                : "from-amber-500 to-rose-600"
                      }`}
                    />

                    {/* Inner Glow */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity blur-3xl bg-white" />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-8">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white bg-gradient-to-br ${
                            stat.color === "blue"
                              ? "from-blue-600 to-indigo-700"
                              : stat.color === "emerald"
                                ? "from-emerald-500 to-teal-600"
                                : stat.color === "orange"
                                  ? "from-orange-500 to-amber-600"
                                  : stat.color === "purple"
                                    ? "from-purple-600 to-indigo-800"
                                    : "from-amber-500 to-rose-600"
                          }`}
                        >
                          <stat.icon className="size-7 text-white" />
                        </div>
                        <span className="px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase bg-slate-50 text-slate-500 border border-slate-100">
                          {stat.trend}
                        </span>
                      </div>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                        {stat.label}
                      </p>
                      <p className="text-5xl font-black text-slate-900 tracking-tighter drop-shadow-sm">
                        {stat.value}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Action Bar & Post List Section */}
            <div className="space-y-6 mt-14">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-4xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tighter leading-tight">
                    {activeTab === "posts"
                      ? "Kho tin đăng của bạn"
                      : "Tin đăng gần nhất"}
                  </h3>
                  <p className="text-lg text-indigo-500/80 font-black mt-1">
                    Quản lý và cập nhật trạng thái các phòng trọ
                  </p>
                </motion.div>
                <Button
                  onClick={() => navigate("/post-room")}
                  className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:opacity-90 px-8 py-7 rounded-[22px] shadow-2xl shadow-blue-100 transition-all hover:scale-[1.05] active:scale-95 text-base font-black border-none"
                >
                  <PlusCircle className="size-5 mr-3" />
                  Đăng tin mới
                </Button>
              </div>

              {/* Posts Grid Layout */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10"
              >
                {landlordPosts
                  .slice(0, activeTab === "overview" ? 4 : 20)
                  .map((post) => {
                    const greenBadgeLevel =
                      post.verificationLevel === "verified" ? 3 : 0;
                    const status = post.available ? "approved" : "pending";

                    return (
                      <motion.div
                        key={post.id || post._id}
                        variants={{
                          hidden: { opacity: 0, scale: 0.9, y: 20 },
                          visible: {
                            opacity: 1,
                            scale: 1,
                            y: 0,
                            transition: { type: "spring", bounce: 0.4 },
                          },
                        }}
                        whileHover={{
                          y: -10,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 15,
                          },
                        }}
                        className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-[40px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all group"
                      >
                        <div className="p-8">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-4 flex-wrap">
                                <div className="scale-90 origin-left">
                                  {getStatusBadge(status)}
                                </div>
                                <div className="scale-90 origin-left">
                                  {getVerificationBadge(greenBadgeLevel)}
                                </div>
                              </div>
                              <h4 className="font-black text-2xl bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-700 transition-all duration-300 leading-tight tracking-tight">
                                {post.name}
                              </h4>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-3xl border border-white/40 shadow-inner group-hover:bg-emerald-50/50 transition-colors">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm">
                                <DollarSign className="size-4 text-emerald-500" />
                              </div>
                              <span className="text-[17px] font-black text-emerald-600">
                                {(post.price || 0).toLocaleString("vi-VN")}đ
                              </span>
                            </div>
                            <div className="flex items-center gap-3 bg-slate-50/50 p-4 rounded-3xl border border-white/40 shadow-inner group-hover:bg-blue-50/50 transition-colors">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm">
                                <Maximize className="size-4 text-blue-500" />
                              </div>
                              <span className="text-[15px] font-black text-blue-600">
                                {post.area} m²
                              </span>
                            </div>
                            <div className="col-span-full flex items-center gap-3 bg-slate-50/50 p-4 rounded-3xl border border-white/40 shadow-inner group-hover:bg-indigo-50/50 transition-colors">
                              <div className="p-2.5 bg-white rounded-2xl shadow-sm">
                                <MapPin className="size-4 text-indigo-500" />
                              </div>
                              <span className="text-xs font-bold text-slate-500 truncate">
                                {post.address}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            <div className="flex items-center gap-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                              <span className="flex items-center gap-2 bg-slate-50/50 px-3 py-1.5 rounded-full">
                                <Eye className="size-3.5 text-slate-300" />{" "}
                                {post.views || 0}
                              </span>
                              <span className="flex items-center gap-2 bg-slate-50/50 px-3 py-1.5 rounded-full">
                                <Star className="size-3.5 text-amber-300" />{" "}
                                {post.favorites || 0}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                className="rounded-2xl font-black text-blue-600 hover:bg-blue-50 px-5"
                                onClick={() => navigate(`/room/${post.id}`)}
                              >
                                <Eye className="size-4 mr-2" />
                                Xem
                              </Button>
                              <Button
                                variant="ghost"
                                className="rounded-2xl font-black text-amber-600 hover:bg-amber-50"
                                onClick={() => setEditingProperty(post)}
                              >
                                <Edit className="size-4 mr-2" />
                                Sửa
                              </Button>
                              <Button
                                variant="ghost"
                                className="rounded-2xl font-black text-rose-600 hover:bg-rose-50"
                                onClick={() => {
                                  setConfirmDelete({
                                    open: true,
                                    title: "Xác nhận xóa tin đăng",
                                    description: `Bạn có chắc muốn xóa tin đăng "${post.name}"?`,
                                    onConfirm: async () => {
                                      try {
                                        const res = await api.delete(
                                          `/api/properties/${post._id || post.id}`,
                                        );
                                        if (res.status === 200) {
                                          toast.success(
                                            "Đã xóa tin đăng thành công! 🗑️",
                                          );
                                          setLandlordPosts((prev) =>
                                            prev.filter(
                                              (p) =>
                                                (p._id || p.id) !==
                                                (post._id || post.id),
                                            ),
                                          );
                                        }
                                      } catch (err) {
                                        toast.error("Xóa thất bại! ❌");
                                      }
                                    },
                                  });
                                }}
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </motion.div>

              {/* Empty State */}
              {landlordPosts.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[40px] shadow-sm p-24 text-center"
                >
                  <div className="w-28 h-28 bg-white rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-slate-200/50 rotate-3 group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100 opacity-50" />
                    <FileText className="size-12 text-slate-300 relative z-10" />
                  </div>
                  <h3 className="text-4xl font-black bg-gradient-to-r from-slate-800 via-indigo-600 to-blue-700 bg-clip-text text-transparent mb-4 tracking-tight">
                    Chưa có tin đăng nào
                  </h3>
                  <p className="text-indigo-400 text-lg font-black mb-12 max-w-sm mx-auto leading-relaxed drop-shadow-sm">
                    Bắt đầu đăng tin cho thuê để tiếp cận hàng nghìn người tìm
                    trọ trên hệ thống của chúng tôi.
                  </p>
                  <Button
                    onClick={() => navigate("/post-room")}
                    className="bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 hover:opacity-90 px-12 py-8 rounded-[24px] shadow-2xl shadow-blue-100 transition-all hover:scale-105 active:scale-95 text-xl font-black border-none"
                  >
                    <PlusCircle className="size-6 mr-3" />
                    Đăng tin đầu tiên
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex font-sans">
      {/* Background Aura Effects */}
      {/* Static Background Gradient - Maximum Smoothness */}
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-[#f0f9f5] via-white to-[#f0f2f9]" />

      {/* Left Sidebar Navigation - Solid & Lean */}
      <aside className="w-80 bg-white/70 backdrop-blur-3xl border-r border-white/40 flex-shrink-0 sticky top-0 h-screen overflow-hidden flex flex-col z-20 shadow-[4px_0_30px_rgba(0,0,0,0.02)]">
        {/* Logo Section */}
        <div className="p-10">
          <div className="flex items-center gap-4 px-2 hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 p-3 rounded-[20px] shadow-2xl shadow-blue-100">
              <Home className="size-8 text-white" />
            </div>
            <div>
              <h1 className="font-black text-3xl bg-gradient-to-r from-slate-900 via-blue-600 to-indigo-700 bg-clip-text text-transparent tracking-tighter leading-none">
                MapHome
              </h1>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white bg-gradient-to-r from-emerald-500 to-blue-600 px-4 py-1.5 rounded-full mt-2 inline-block shadow-lg shadow-blue-100/50">
                Landlord Portal
              </span>
            </div>
          </div>
        </div>

        {/* User Quick Profile */}
        <div className="mx-6 p-5 rounded-3xl bg-white/50 border border-white/60 shadow-sm mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl border-2 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0 hover:rotate-3 transition-transform">
              {user?.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar) || ""}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                getInitials(user?.fullName, user?.username)
              )}
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <p className="text-sm font-black text-gray-900 truncate leading-tight">
                {user?.fullName || user?.username}
              </p>
              <div className="mt-1">
                {user?.verificationLevel !== undefined &&
                  getVerificationBadge(user.verificationLevel)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Menu */}
        <nav className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-5 px-6 py-5 rounded-[28px] text-sm font-black tracking-tight transition-all relative group ${
                    isActive
                      ? "bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 text-white shadow-[0_15px_35px_rgba(59,130,246,0.25)] scale-[1.03]"
                      : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50/50"
                  }`}
                >
                  <div
                    className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : ""}`}
                  >
                    <Icon className="size-5 flex-shrink-0" />
                  </div>
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute right-6 w-2 h-2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Action Footer */}
        <div className="p-6 space-y-3 mt-auto mb-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="w-full justify-start gap-4 px-5 py-6 rounded-2xl font-bold text-gray-600 hover:bg-white/60 hover:text-gray-900 group"
          >
            <Home className="size-5 transition-transform group-hover:-translate-y-0.5" />
            Về trang chủ
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-4 px-5 py-6 rounded-2xl font-bold text-rose-500 hover:bg-rose-50 hover:text-rose-600 group shadow-sm bg-rose-50/10"
          >
            <LogOut className="size-5 transition-transform group-hover:translate-x-1" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content Area - Glass Canvas */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative z-10 flex flex-col h-screen">
        {/* Top Navbar Blur Effect */}
        <div className="sticky top-0 h-10 bg-gradient-to-b from-white to-transparent pointer-events-none z-30 opacity-60" />

        <div className="flex-1 w-full flex flex-col">
          <main className="max-w-[1400px] w-full mx-auto px-6 md:px-12 pt-8 pb-20 flex-1">
            <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
          </main>
        </div>
      </div>

      {/* Verification Request Dialog */}
      <RequestVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        landlordId={user?.id || "unknown"}
        landlordName={user?.fullName || user?.username || "Chủ trọ"}
        landlordPhone={user?.phone || "0123456789"}
      />

      <ConfirmDialog
        open={confirmDelete.open}
        title={confirmDelete.title}
        description={confirmDelete.description}
        confirmText="Xoá"
        cancelText="Huỷ"
        onConfirm={async () => {
          await confirmDelete.onConfirm?.();
          setConfirmDelete({ open: false });
        }}
        onCancel={() => setConfirmDelete({ open: false })}
      />

      {/* Edit Property Dialog */}
      <EditPropertyDialog
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        property={editingProperty}
        onSuccess={() => {
          api
            .get("/api/landlord/properties")
            .then((res) => setLandlordPosts(res.data))
            .catch(console.error);
        }}
      />
    </div>
  );
}
