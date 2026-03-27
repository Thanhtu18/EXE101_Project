import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
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
} from "lucide-react";

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
  const { user, logout, isAuthenticated } = useAuth();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [editingProperty, setEditingProperty] = useState<RentalProperty | null>(null);

  // States for API data
  const [landlordPosts, setLandlordPosts] = useState<RentalProperty[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    approvedPosts: 0,
    pendingPosts: 0,
    totalViews: 0,
    totalFavorites: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get active tab from URL params, default to 'overview'
  const activeTab = (searchParams.get("tab") as DashboardTab) || "overview";

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "landlord") {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
      const headers = { Authorization: `Bearer ${token}` };

      try {
        if (activeTab === "overview") {
          const statsRes = await fetch(`${API_BASE}/api/landlord/analytics`, { headers });
          if (statsRes.ok) {
            const data = await statsRes.json();
            setStats({
              totalPosts: data.totalProperties || 0,
              approvedPosts: data.totalProperties || 0, // Can be improved
              pendingPosts: 0,
              totalViews: data.totalViews || 0,
              totalFavorites: 0, // Need backend support or local calculation
            });
          }
        } else if (activeTab === "posts") {
          const propsRes = await fetch(`${API_BASE}/api/landlord/properties`, { headers });
          if (propsRes.ok) {
            setLandlordPosts(await propsRes.json());
          }
        } else if (activeTab === "bookings") {
          const bookingsRes = await fetch(`${API_BASE}/api/landlord/bookings`, { headers });
          if (bookingsRes.ok) {
            setBookings(await bookingsRes.json());
          }
        } else if (activeTab === "verification") {
          const reqsRes = await fetch(`${API_BASE}/api/landlord/verification-requests`, { headers });
          if (reqsRes.ok) {
            setVerificationRequests(await reqsRes.json());
          }
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
        return <SubscriptionManagement />;

      case "verification":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Yêu cầu xác thực
              </h2>
              <p className="text-gray-600">
                Quản lý các yêu cầu kiểm tra và cấp tích xanh
              </p>
            </div>

            {/* Green Badge CTA */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/20 p-4 rounded-xl">
                    <Award className="size-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      Yêu cầu kiểm tra & Cấp Tích Xanh
                    </h3>
                    <p className="text-green-100 text-sm">
                      Admin đến kiểm tra thực tế • Tăng 50% lượt xem • Ưu tiên
                      hiển thị
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => setShowVerificationDialog(true)}
                  className="bg-white text-green-600 hover:bg-green-50"
                  size="lg"
                >
                  <ShieldCheck className="size-5 mr-2" />
                  Đặt lịch kiểm tra
                </Button>
              </div>
            </div>

            {/* Verification Requests List */}
            {verificationRequests.length > 0 ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="size-5 text-orange-600" />
                  Lịch hẹn kiểm tra của bạn
                </h4>
                <div className="space-y-3">
                  {verificationRequests.map((req) => (
                    <div
                      key={req._id || req.id}
                      className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">
                          {req.propertyName}
                        </p>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            req.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : req.status === "approved"
                                ? "bg-blue-100 text-blue-800"
                                : req.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {req.status === "completed"
                            ? "✅ Hoàn thành"
                            : req.status === "approved"
                              ? "✓ Đã duyệt"
                              : req.status === "rejected"
                                ? "✗ Từ chối"
                                : "⏳ Chờ duyệt"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        📍 {req.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        📅{" "}
                        {new Date(req.scheduledDate).toLocaleDateString(
                          "vi-VN",
                        )}{" "}
                        • {req.scheduledTime}
                      </p>
                      {req.notes && (
                        <p className="text-xs text-gray-500 mt-2 italic">
                          Ghi chú: {req.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <ShieldCheck className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có yêu cầu kiểm tra nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Đặt lịch kiểm tra để nhận tích xanh và tăng độ tin cậy
                </p>
                <Button
                  onClick={() => setShowVerificationDialog(true)}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  <ShieldCheck className="size-4 mr-2" />
                  Đặt lịch kiểm tra ngay
                </Button>
              </div>
            )}
          </div>
        );

      case "bookings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Lịch hẹn xem phòng</h2>
              <p className="text-gray-600">Quản lý các yêu cầu xem phòng từ khách thuê</p>
            </div>
            
            { bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{booking.propertyId?.name || "Phòng trọ"}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="size-4" /> {booking.propertyId?.address || "Đang cập nhật"}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? "bg-blue-100 text-blue-800" :
                        booking.status === 'completed' ? "bg-green-100 text-green-800" :
                        booking.status === 'cancelled' ? "bg-red-100 text-red-800" :
                        "bg-orange-100 text-orange-800"
                      }`}>
                        {booking.status === 'confirmed' ? "Đã xác nhận" :
                         booking.status === 'completed' ? "Hoàn thành" :
                         booking.status === 'cancelled' ? "Đã huỷ" : "Chờ xác nhận"}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Thời gian xem</p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                          <Clock className="size-4 text-green-600" />
                          {booking.bookingTime} - {new Date(booking.bookingDate).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Thông tin khách</p>
                        <p className="font-medium text-gray-900">{booking.customerName}</p>
                        <p className="text-sm text-gray-600">{booking.customerPhone}</p>
                      </div>
                      {booking.note && (
                        <div className="col-span-2">
                          <p className="text-sm text-gray-500 mb-1">Ghi chú</p>
                          <p className="text-sm text-gray-900 bg-white p-2 border rounded">{booking.note}</p>
                        </div>
                      )}
                    </div>
                    
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                        <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={async () => {
                          const token = localStorage.getItem("token");
                          const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
                          await fetch(`${API_BASE}/api/bookings/${booking._id}/status`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ status: "cancelled" })
                          });
                          window.location.reload();
                        }}>Từ chối</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={async () => {
                          const token = localStorage.getItem("token");
                          const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
                          await fetch(`${API_BASE}/api/bookings/${booking._id}/status`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ status: "confirmed" })
                          });
                          window.location.reload();
                        }}>Xác nhận lịch hẹn</Button>
                      </div>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <div className="flex gap-2 justify-end pt-4 border-t border-gray-100">
                        <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={async () => {
                          const token = localStorage.getItem("token");
                          const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
                          await fetch(`${API_BASE}/api/bookings/${booking._id}/status`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ status: "completed" })
                          });
                          window.location.reload();
                        }}>Đã hoàn thành xem phòng</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <CalendarDays className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có lịch hẹn nào</h3>
                <p className="text-gray-600 mb-6">Bạn sẽ nhận được lịch hẹn khi khách thuê chọn xem phòng của bạn</p>
              </div>
            )}
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt tài khoản</h2>
              <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật của bạn</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Profile Info */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <Settings className="size-5 text-gray-500" /> Thông tin cá nhân
                </h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    const fullName = target.fullName.value;
                    const phone = target.phone.value;
                    const token = localStorage.getItem("token");
                    const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
                    
                    try {
                      // Note: /api/users/:id endpoint needs to exist on backend
                      const res = await fetch(`${API_BASE}/api/users/${user?.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ fullName, phone })
                      });
                      if (res.ok) {
                        alert("✅ Cập nhật thông tin thành công!");
                        window.location.reload();
                      } else {
                        const data = await res.json();
                        alert("❌ " + (data.message || "Cập nhật thất bại."));
                      }
                    } catch (err) {
                      console.error(err);
                      alert("❌ Cập nhật thất bại.");
                    }
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input name="fullName" defaultValue={user?.fullName || user?.username} className="w-full px-4 py-2 border rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                    <input name="phone" defaultValue={user?.phone || ""} className="w-full px-4 py-2 border rounded-md" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không thể đổi)</label>
                    <input disabled value={user?.email || ""} className="w-full px-4 py-2 border bg-gray-50 text-gray-500 rounded-md" />
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                    Lưu thông tin
                  </Button>
                </form>
              </div>

              {/* Security */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="size-5 text-green-500" /> Bảo mật
                </h3>
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const target = e.target as any;
                    const currentPassword = target.currentPassword.value;
                    const newPassword = target.newPassword.value;
                    const token = localStorage.getItem("token");
                    const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
                    
                    try {
                      const res = await fetch(`${API_BASE}/api/auth/change-password`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                        body: JSON.stringify({ currentPassword, newPassword })
                      });
                      if (res.ok) {
                        alert("✅ Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                        logout();
                        navigate("/login");
                      } else {
                        const data = await res.json();
                        alert("❌ " + (data.message || "Đổi mật khẩu thất bại."));
                      }
                    } catch (err) {
                      console.error(err);
                      alert("❌ Lỗi đổi mật khẩu.");
                    }
                  }} 
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input type="password" name="currentPassword" placeholder="••••••••" className="w-full px-4 py-2 border rounded-md" required minLength={6} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới</label>
                    <input type="password" name="newPassword" placeholder="••••••••" className="w-full px-4 py-2 border rounded-md" required minLength={6} />
                  </div>
                  <Button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white mt-4">
                    Đổi mật khẩu
                  </Button>
                </form>
              </div>
            </div>
          </div>
        );

      case "posts":
      case "overview":
      default:
        return (
          <div className="space-y-6">
            {/* Page Header */}
            {activeTab === "overview" && (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Tổng quan
                  </h2>
                  <p className="text-gray-600">
                    Theo dõi hoạt động tin đăng của bạn
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Tổng tin đăng</p>
                      <FileText className="size-5 text-blue-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalPosts}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Đã duyệt</p>
                      <CheckCircle className="size-5 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">
                      {stats.approvedPosts}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Chờ duyệt</p>
                      <Clock className="size-5 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">
                      {stats.pendingPosts}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Lượt xem</p>
                      <Eye className="size-5 text-purple-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalViews}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Yêu thích</p>
                      <Star className="size-5 text-yellow-600" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalFavorites}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                {activeTab === "posts"
                  ? "Tin đăng của bạn"
                  : "Tin đăng gần đây"}
              </h3>
              <Button
                onClick={() => navigate("/post-room")}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <PlusCircle className="size-4 mr-2" />
                Đăng tin mới
              </Button>
            </div>

            {/* Posts List */}
            <div className="space-y-4">
              {landlordPosts.map((post) => {
                const greenBadgeLevel =
                  post.verificationLevel === "verified" ? 3 : 0;
                const status = post.available
                  ? ("approved" as const)
                  : ("pending" as const);
                const createdAt = post.pinInfo?.pinnedAt
                  ? new Date(post.pinInfo.pinnedAt).toLocaleDateString("vi-VN")
                  : new Date().toLocaleDateString("vi-VN");

                return (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h4 className="font-bold text-lg text-gray-900">
                            {post.name}
                          </h4>
                          {getStatusBadge(status)}
                          {getVerificationBadge(greenBadgeLevel)}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <DollarSign className="size-4" />
                            <span className="font-semibold text-green-600">
                              {post.price.toLocaleString("vi-VN")}đ/tháng
                            </span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Maximize className="size-4" />
                            {post.area}m²
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {post.address}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Eye className="size-4" />
                          {post.views || 0} lượt xem
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="size-4" />
                          {post.favorites || 0} yêu thích
                        </span>
                        <span className="text-xs">Đăng ngày: {createdAt}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/room/${post.id}`)}
                        >
                          <Eye className="size-4 mr-2" />
                          Xem
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditingProperty(post)}>
                          <Edit className="size-4 mr-2" />
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={async () => {
                            if (window.confirm(`Bạn có chắc muốn xóa tin đăng "${post.name}"?`)) {
                              const token = localStorage.getItem("token");
                              const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
                              try {
                                const res = await fetch(`${API_BASE}/api/properties/${post._id || post.id}`, {
                                  method: "DELETE",
                                  headers: { Authorization: `Bearer ${token}` }
                                });
                                if (res.ok) {
                                  // Update state directly or reload
                                  setLandlordPosts(prev => prev.filter(p => (p._id || p.id) !== (post._id || post.id)));
                                } else {
                                  window.alert("Xóa thất bại!");
                                }
                              } catch (err) {
                                console.error(err);
                              }
                            }
                          }}
                        >
                          <Trash2 className="size-4 mr-2" />
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {landlordPosts.length === 0 && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <FileText className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Chưa có tin đăng nào
                </h3>
                <p className="text-gray-600 mb-6">
                  Bắt đầu đăng tin cho thuê để tiếp cận hàng nghìn người tìm trọ
                </p>
                <Button
                  onClick={() => navigate("/post-room")}
                  className="bg-gradient-to-r from-green-600 to-blue-600"
                >
                  <PlusCircle className="size-4 mr-2" />
                  Đăng tin đầu tiên
                </Button>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar Navigation */}
      <aside className="w-60 bg-white border-r shadow-sm flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Logo Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <Home className="size-8 text-green-600" />
            <div>
              <h1 className="font-bold text-lg text-gray-900">MapHome</h1>
              <p className="text-xs text-gray-500">Chủ trọ</p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
              {(user?.fullName || user?.username || "L")
                .charAt(0)
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {user?.fullName || user?.username}
              </p>
              {user?.verificationLevel !== undefined &&
                getVerificationBadge(user.verificationLevel)}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="size-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t mt-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="w-full mb-2"
          >
            <Home className="size-4 mr-2" />
            Trang chủ
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleLogout}
            className="w-full"
          >
            <LogOut className="size-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        <motion.main 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-6xl mx-auto px-8 py-8"
        >
          {renderContent()}
        </motion.main>
      </div>

      {/* Verification Request Dialog */}
      <RequestVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        landlordId={user?.id || "unknown"}
        landlordName={user?.fullName || user?.username || "Chủ trọ"}
        landlordPhone={user?.phone || "0123456789"}
      />

      {/* Edit Property Dialog */}
      <EditPropertyDialog
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        property={editingProperty}
        onSuccess={() => {
          const token = localStorage.getItem("token");
          const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
          fetch(`${API_BASE}/api/landlord/properties`, { 
            headers: { Authorization: `Bearer ${token}` } 
          })
            .then(res => res.json())
            .then(data => setLandlordPosts(data))
            .catch(console.error);
        }}
      />
    </div>
  );
}
