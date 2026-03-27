import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/AuthContext";
import { useVerification } from "@/app/contexts/VerificationContext";
import { useProperties } from "@/app/contexts/PropertiesContext";
import { Button } from "@/app/components/ui/button";
import { InspectionDialog } from "@/app/components/InspectionDialog";
import { VerificationRequest } from "@/app/components/types";
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  Settings,
  LogOut,
  Home,
  Calendar,
  Bell,
  Eye,
  MapPin,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Search,
  Download,
  ShieldCheck,
  Clock,
  Award,
  XCircle,
  Phone,
  MapPinned,
} from "lucide-react";
import { RevenueView } from "./RevenueView";
import { InspectionsView } from "@/app/components/InspectionsView";

type AdminView =
  | "dashboard"
  | "posts"
  | "users"
  | "verification"
  | "bookings"
  | "reviews"
  | "revenue"
  | "inspections";

// Note: Mock data constants removed. Data is now fetched from the backend.

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [stats, setStats] = useState<any>(null);
  const [weeklySearchData, setWeeklySearchData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [topRooms, setTopRooms] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [isInspectionDialogOpen, setIsInspectionDialogOpen] = useState(false);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Parallel fetch for dashboard data
      const [
        statsRes, searchRes, topRoomsRes, 
        postsRes, usersRes, verificationsRes, 
        bookingsRes, reviewsRes
      ] = await Promise.all([
        fetch(`${API_BASE}/api/admin/stats`, { headers }),
        fetch(`${API_BASE}/api/admin/stats/weekly-search`, { headers }),
        fetch(`${API_BASE}/api/admin/stats/top-rooms`, { headers }),
        fetch(`${API_BASE}/api/admin/properties`, { headers }),
        fetch(`${API_BASE}/api/admin/users`, { headers }),
        fetch(`${API_BASE}/api/admin/verification-requests`, { headers }),
        fetch(`${API_BASE}/api/admin/bookings`, { headers }),
        fetch(`${API_BASE}/api/admin/reviews`, { headers }),
      ]);

      const stats = statsRes.ok ? await statsRes.json() : null;
      const searchData = searchRes.ok ? await searchRes.json() : [];
      const topRoomsData = topRoomsRes.ok ? await topRoomsRes.json() : [];
      const postsData = postsRes.ok ? await postsRes.json() : [];
      const usersData = usersRes.ok ? await usersRes.json() : [];
      const verificationsData = verificationsRes.ok ? await verificationsRes.json() : [];
      const bookingsData = bookingsRes.ok ? await bookingsRes.json() : [];
      const reviewsData = reviewsRes.ok ? await reviewsRes.json() : [];

      if (stats) setStats(stats);
      setWeeklySearchData(searchData);
      setTopRooms(topRoomsData.map((room: any, idx: number) => ({
        rank: idx + 1,
        name: room.name,
        location: room.address,
        views: room.views || 0,
      })));
      setPosts(postsData);
      setUsers(usersData);
      setVerifications(verificationsData);
      setBookings(bookingsData);
      setReviews(reviewsData);

      const activities = [
        ...verificationsData.slice(0, 2).map((v: any) => ({
          id: `v-${v._id}`,
          text: `Yêu cầu Tích Xanh cho '${v.propertyId?.name || v.propertyName}' đang ${v.status}`,
          time: new Date(v.requestedAt || v.createdAt).toLocaleTimeString('vi-VN'),
          color: v.status === 'pending' ? 'blue' : 'green'
        })),
        ...postsData.slice(0, 1).map((p: any) => ({
          id: `p-${p._id}`,
          text: `Tin đăng mới: '${p.name}'`,
          time: new Date(p.createdAt).toLocaleTimeString('vi-VN'),
          color: 'green'
        }))
      ];
      setRecentActivities(activities);

    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    } else {
      fetchData();
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdatePropertyStatus = async (id: string, status: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/properties/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setPosts(posts.map((p) => (p._id === id ? { ...p, status } : p)));
        alert("Cập nhật trạng thái tin đăng thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/users/${id}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(
          users.map((u) =>
            u._id === id
              ? { ...u, status: u.status === "blocked" ? "active" : "blocked" }
              : u
          )
        );
        alert("Cập nhật trạng thái người dùng thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveVerification = async (id: string, date: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/admin/verification/${id}/approve`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ scheduledDate: date }),
        }
      );
      if (res.ok) {
        setVerifications(
          verifications.map((v) =>
            v._id === id ? { ...v, status: "approved", scheduledDate: date } : v
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCompleteVerification = async (id: string, badgeLevel: string, notes?: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/admin/verification/${id}/complete`,
        {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ badgeAwarded: badgeLevel, inspectorNotes: notes })
        }
      );
      if (res.ok) {
        setVerifications(
          verifications.map((v) =>
            v._id === id ? { ...v, status: badgeLevel === 'none' ? 'rejected' : 'completed', inspectorNotes: notes } : v
          )
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Bác có chắc muốn xóa lịch hẹn này?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/bookings/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setBookings(bookings.filter((b) => b._id !== id));
        alert("Đã xóa lịch hẹn thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Bác có chắc muốn xóa đánh giá này?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/reviews/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setReviews(reviews.filter((r) => r._id !== id));
        alert("Đã xóa đánh giá thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Bác có chắc muốn XÓA VĨNH VIỄN người dùng này?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        alert("Đã xóa người dùng thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-[#e2e8f0] flex flex-col fixed h-screen">
        {/* Logo */}
        <div className="px-5 py-[18px] border-b border-[#e2e8f0]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center">
              <MapPin className="size-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-[800] text-gray-900">MapHome</h1>
              <span className="px-2 py-0.5 bg-[#dcfce7] text-[#16a34a] text-[9px] font-bold rounded-full uppercase">
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          {/* TỔNG QUAN */}
          <div className="mb-4">
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase text-[#94a3b8] tracking-wider">
              TỔNG QUAN
            </div>
            <button
              onClick={() => setActiveView("dashboard")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "dashboard"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "dashboard" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <LayoutDashboard className="size-4" />
              Dashboard
            </button>
          </div>

          {/* QUẢN LÝ */}
          <div className="mb-4">
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase text-[#94a3b8] tracking-wider">
              QUẢN LÝ
            </div>
            <button
              onClick={() => setActiveView("posts")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "posts"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "posts" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <FileText className="size-4" />
              Tin đăng
              <span className="ml-auto px-1.5 py-0.5 bg-[#fef3c7] text-[#d97706] text-[10px] font-bold rounded">
                {posts.length}
              </span>
            </button>
            <button
              onClick={() => setActiveView("users")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "users"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "users" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <Users className="size-4" />
              Người dùng
            </button>
            <button
              onClick={() => setActiveView("verification")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "verification"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "verification" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <CheckCircle className="size-4" />
              Tích Xanh
              <span className="ml-auto px-1.5 py-0.5 bg-[#fee2e2] text-[#dc2626] text-[10px] font-bold rounded">
                {verifications.filter(v => v.status === 'pending').length}
              </span>
            </button>
            <button
              onClick={() => setActiveView("bookings")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "bookings"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "bookings" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <Calendar className="size-4" />
              Lịch hẹn
            </button>
            <button
              onClick={() => setActiveView("reviews")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "reviews"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "reviews" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <Award className="size-4" />
              Đánh giá
            </button>
            <button
              onClick={() => setActiveView("inspections")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "inspections"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "inspections" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              <ShieldCheck className="size-4" />
              Lịch kiểm tra
              <span className="ml-auto px-1.5 py-0.5 bg-[#dbeafe] text-[#2563eb] text-[10px] font-bold rounded">
                {/* This will show count of requests */}
              </span>
            </button>
            <button
              onClick={() => setActiveView("revenue")}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all relative ${
                activeView === "revenue"
                  ? "bg-[#dcfce7] text-[#16a34a] font-semibold"
                  : "text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a]"
              }`}
            >
              {activeView === "revenue" && (
                <div className="absolute left-0 w-[3px] h-5 bg-[#16a34a] rounded-r-sm" />
              )}
              📈
              <span className="ml-0.5">Doanh thu</span>
            </button>
          </div>

          {/* HỆ THỐNG */}
          <div>
            <div className="px-2 mb-1.5 text-[10px] font-bold uppercase text-[#94a3b8] tracking-wider">
              HỆ THỐNG
            </div>
            <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] text-[#475569] hover:bg-[#f0fdf4] hover:text-[#16a34a] transition-all">
              <Settings className="size-4" />
              Cài đặt
            </button>
          </div>
        </nav>

        {/* User Area */}
        <div className="border-t border-[#e2e8f0] p-3">
          <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] rounded-full bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center text-white text-xs font-bold">
              LT
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">
                {user?.fullName || user?.username || "Admin"}
              </div>
              <div className="text-[10px] text-[#94a3b8]">
                {user?.role === 'admin' ? 'Hệ thống Quản trị' : 'Quản trị viên'}
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[#94a3b8] hover:text-[#dc2626] transition-colors"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-60">
        {/* Top Bar */}
        <header className="h-[60px] bg-white border-b border-[#e2e8f0] px-6 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-base font-bold text-[#0f172a]">
            {activeView === "dashboard" && "Dashboard"}
            {activeView === "posts" && "Quản lý Tin đăng"}
            {activeView === "users" && "Quản lý Người dùng"}
            {activeView === "verification" && "Xác thực Tích Xanh ✅"}
            {activeView === "bookings" && "Quản lý Lịch hẹn"}
            {activeView === "reviews" && "Quản lý Đánh giá"}
            {activeView === "revenue" && "Doanh Thu"}
            {activeView === "inspections" && "Kiểm tra thực địa"}
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => fetchData()}
              className="px-3.5 py-1.5 bg-[#dcfce7] text-[#16a34a] border border-[#bbf7d0] rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-[#bbf7d0] transition-colors"
            >
              🔄 Làm mới
            </button>
            <button className="px-3.5 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Calendar className="size-4" />
              {new Date().toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
            </button>
            <button className="relative px-3.5 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="size-4 text-gray-600" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            </button>
          </div>
        </header>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
            </div>
          ) : (
            <>
              {activeView === "dashboard" && <DashboardView stats={stats} weeklySearchData={weeklySearchData} recentActivities={recentActivities} topRooms={topRooms} posts={posts} />}
              {activeView === "posts" && <PostsView posts={posts} onUpdateStatus={handleUpdatePropertyStatus} />}
              {activeView === "users" && <UsersView users={users} onToggleStatus={handleToggleUserStatus} onDeleteUser={handleDeleteUser} />}
              {activeView === "verification" && (
                <VerificationView 
                  verifications={verifications} 
                  onApprove={handleApproveVerification} 
                  onComplete={handleCompleteVerification} 
                  onOpenInspect={(v) => { setSelectedVerification(v); setIsInspectionDialogOpen(true); }}
                />
              )}
              {activeView === "bookings" && <BookingsView bookings={bookings} onDeleteBooking={handleDeleteBooking} />}
              {activeView === "reviews" && <ReviewsView reviews={reviews} onDeleteReview={handleDeleteReview} />}
              {activeView === "revenue" && <RevenueView />}
              {activeView === "inspections" && <InspectionsView />}
            </>
          )}
        </div>
      </main>

      {/* Inspection Dialog */}
      {selectedVerification && (
        <InspectionDialog
          isOpen={isInspectionDialogOpen}
          onClose={() => {
            setIsInspectionDialogOpen(false);
            setSelectedVerification(null);
            fetchData(); // Refresh data after dialog closes
          }}
          request={selectedVerification}
        />
      )}
    </div>
  );
}

// Dashboard View Component
function DashboardView({ stats, weeklySearchData, recentActivities, topRooms, posts }: { stats: any; weeklySearchData: any[]; recentActivities: any[]; topRooms: any[]; posts: any[] }) {
  const safePosts = Array.isArray(posts) ? posts : [];
  const total = safePosts.length || 1; // Avoid division by zero
  const approvedPct = Math.round((safePosts.filter(p => p.status === 'approved').length / total) * 100);
  const pendingPct = Math.round((safePosts.filter(p => p.status === 'pending').length / total) * 100);
  const reportedPct = Math.round((safePosts.filter(p => p.status === 'reported').length / total) * 100);

  return (
    <div className="space-y-3.5">
      <div className="grid grid-cols-4 gap-3.5">
        <KPICard
          icon="🏘️"
          iconBg="#dcfce7"
          label="Tổng tin đăng"
          value={stats?.totalProperties?.toLocaleString() || "0"}
          change=""
          topGradient="linear-gradient(90deg, #16a34a, #22c55e)"
        />
        <KPICard
          icon="👥"
          iconBg="#dbeafe"
          label="Người dùng"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          change=""
          topGradient="linear-gradient(90deg, #2563eb, #0ea5e9)"
        />
        <KPICard
          icon="✅"
          iconBg="#fef3c7"
          label="Tích Xanh đã cấp"
          value={stats?.completedVerifications?.toLocaleString() || "0"}
          change=""
          topGradient="linear-gradient(90deg, #d97706, #f59e0b)"
        />
        <KPICard
          icon="⚠️"
          iconBg="#fee2e2"
          label="Chờ xử lý"
          value={stats?.pendingVerifications?.toLocaleString() || "0"}
          change={stats?.pendingVerifications > 0 ? "Cần duyệt ngay" : ""}
          changeNegative={stats?.pendingVerifications > 0}
          topGradient="linear-gradient(90deg, #dc2626, #ef4444)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-[1.4fr_1fr] gap-3.5">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold uppercase text-[#475569]">
              Lượt tìm kiếm theo tuần
            </h3>
            <button className="text-xs text-[#16a34a] hover:text-[#15803d] font-medium flex items-center gap-1">
              Xem chi tiết
              <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="h-[90px] flex items-end justify-between gap-2 mb-3">
            {weeklySearchData.map((item) => (
              <div
                key={item.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${item.value}%`,
                    background: item.highlight
                      ? "linear-gradient(180deg, #16a34a, #bbf7d0)"
                      : "linear-gradient(180deg, #0ea5e9, #bae6fd)",
                  }}
                />
                <span
                  className={`text-[10px] ${
                    item.highlight
                      ? "text-[#16a34a] font-bold"
                      : "text-[#94a3b8]"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-[#e2e8f0] flex items-center gap-4 text-[11.5px]">
            <span className="text-[#94a3b8]">
              Dữ liệu tìm kiếm thời gian thực
            </span>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-[#475569] mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div key={activity.id}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.color === "red"
                        ? "bg-[#dc2626]"
                        : activity.color === "green"
                          ? "bg-[#16a34a]"
                          : activity.color === "amber"
                            ? "bg-[#d97706]"
                            : "bg-[#2563eb]"
                    }`}
                  />
                  <span className="flex-1 text-[12.5px] text-[#475569]">
                    {activity.text}
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">
                    {activity.time}
                  </span>
                </div>
                {idx < recentActivities.length - 1 && (
                  <div className="h-px bg-[#e2e8f0] my-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* Donut Chart */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-[#475569] mb-4">
            Trạng thái tin đăng
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative w-[88px] h-[88px]">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="3.5"
                  strokeDasharray={`${approvedPct} 100`}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                  strokeDasharray={`${pendingPct} 100`}
                  strokeDashoffset={-approvedPct}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                  strokeDasharray={`${reportedPct} 100`}
                  strokeDashoffset={-(approvedPct + pendingPct)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">
                {posts.length.toLocaleString()}
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <span className="text-xs text-[#475569]">Đang hiển thị</span>
                <span className="ml-auto text-xs font-bold text-[#0f172a]">
                  {approvedPct}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                <span className="text-xs text-[#475569]">Chờ duyệt</span>
                <span className="ml-auto text-xs font-bold text-[#0f172a]">
                  {pendingPct}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#dc2626]" />
                <span className="text-xs text-[#475569]">Báo cáo</span>
                <span className="ml-auto text-xs font-bold text-[#0f172a]">
                  {reportedPct}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Rooms */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase text-[#475569] mb-4">
            Top phòng được xem
          </h3>
          <div className="space-y-3">
            {topRooms.map((room, idx) => (
              <div key={room.rank}>
                <div className="flex items-center gap-3">
                  <span className="text-[#94a3b8] font-medium text-sm">
                    #{room.rank}
                  </span>
                  <div className="flex-1">
                    <div className="text-[12.5px] font-semibold text-[#0f172a]">
                      {room.name}
                    </div>
                    <div className="text-[11px] text-[#94a3b8]">
                      {room.location}
                    </div>
                  </div>
                  <span className="text-sm font-bold text-[#16a34a]">
                    {room.views}
                  </span>
                </div>
                {idx < topRooms.length - 1 && (
                  <div className="h-px bg-[#e2e8f0] my-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// KPI Card Component
function KPICard({
  icon,
  iconBg,
  label,
  value,
  change,
  changePositive,
  changeNegative,
  topGradient,
}: {
  icon: string;
  iconBg: string;
  label: string;
  value: string;
  change: string;
  changePositive?: boolean;
  changeNegative?: boolean;
  topGradient: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="h-[3px]" style={{ background: topGradient }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-lg"
            style={{ backgroundColor: iconBg }}
          >
            {icon}
          </div>
        </div>
        <div className="text-[11px] text-[#94a3b8] mb-1">{label}</div>
        <div className="text-2xl font-[800] text-[#0f172a] mb-1">{value}</div>
        <div
          className={`text-[11px] flex items-center gap-1 ${
            changePositive
              ? "text-[#16a34a]"
              : changeNegative
                ? "text-[#dc2626]"
                : "text-[#94a3b8]"
          }`}
        >
          {changePositive && "↑"}
          {change}
        </div>
      </div>
    </div>
  );
}

// Posts View Component
function PostsView({ posts, onUpdateStatus }: { posts: any[], onUpdateStatus: (id: string, status: string) => void }) {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "reported" | "approved"
  >("all");

  const filteredPosts = posts.filter(post => {
    if (activeTab === "all") return true;
    return post.status === activeTab;
  });

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#94a3b8]">Duyệt, ẩn và xử lý vi phạm</p>

      {/* Tab Bar */}
      <div className="flex items-center gap-2">
        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          count={posts.length.toLocaleString()}
        >
          Tất cả
        </TabButton>
        <TabButton
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
          count={posts.filter(p => p.status === "pending").length.toString()}
          variant="amber"
        >
          Chờ duyệt
        </TabButton>
        <TabButton
          active={activeTab === "reported"}
          onClick={() => setActiveTab("reported")}
          count={posts.filter(p => p.status === "reported").length.toString()}
          variant="red"
        >
          Bị báo cáo
        </TabButton>
        <TabButton
          active={activeTab === "approved"}
          onClick={() => setActiveTab("approved")}
          count={posts.filter(p => p.status === "approved").length.toString()}
        >
          Đang hiển thị
        </TabButton>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative w-[220px]">
          <input
            type="text"
            placeholder="Tìm tên phòng, địa chỉ..."
            className="w-full h-9 pl-8 pr-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs focus:border-[#16a34a] focus:outline-none"
          />
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94a3b8]">
            🔍
          </div>
        </div>
        <select className="h-9 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
          <option>Tất cả khu vực</option>
        </select>
        <select className="h-9 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs">
          <option>Tất cả trạng thái</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#e2e8f0]">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                TIN ĐĂNG
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                CHỦ TRỌ
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                GIÁ THUÊ
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                NGÀY ĐĂNG
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                TRẠNG THÁI
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr
                key={post.id || post._id}
                className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 rounded-lg bg-[#dcfce7] flex items-center justify-center text-sm">
                      🏠
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#0f172a]">
                        {post.name}
                      </div>
                      <div className="text-[11px] text-[#94a3b8] truncate max-w-[200px]">
                        📍 {post.address}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm`}
                    >
                      {post.landlordId?.name?.substring(0, 2).toUpperCase() || "LL"}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-[#16a34a]">
                    {post.price?.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">/th</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">
                  {new Date(post.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={post.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {post.status === "pending" && (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(post._id, "approved")}
                          className="px-2.5 py-1 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] rounded-lg text-[11px] font-semibold hover:bg-[#bbf7d0]"
                        >
                          Duyệt
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(post._id, "rejected")}
                          className="px-2.5 py-1 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]"
                        >
                          Từ chối
                        </button>
                      </>
                    )}
                    {post.status === "approved" && (
                      <button 
                        onClick={() => onUpdateStatus(post._id, "reported")}
                        className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]"
                      >
                        Ẩn tin
                      </button>
                    )}
                    {post.status === "reported" && (
                      <>
                        <button 
                          onClick={() => onUpdateStatus(post._id, "approved")}
                          className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]"
                        >
                          Giữ tin
                        </button>
                        <button 
                          onClick={() => onUpdateStatus(post._id, "rejected")}
                          className="px-2.5 py-1 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]"
                        >
                          Xoá
                        </button>
                      </>
                    )}
                    <button className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]">
                      👁
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users View Component
function UsersView({ users, onToggleStatus, onDeleteUser }: { users: any[], onToggleStatus: (id: string) => void, onDeleteUser: (id: string) => void }) {
  const totalLandlords = users.filter(u => u.role === "landlord").length;
  const totalUsers = users.filter(u => u.role === "user").length;
  const totalBlocked = users.filter(u => u.status === "blocked").length;

  return (
    <div className="space-y-4">
      {/* Stat Mini Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Tổng người dùng</div>
          <div className="text-[22px] font-[800] text-[#0f172a]">{users.length.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Chủ trọ</div>
          <div className="text-[22px] font-[800] text-[#d97706]">{totalLandlords.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Người thuê</div>
          <div className="text-[22px] font-[800] text-[#2563eb]">{totalUsers.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Bị khoá</div>
          <div className="text-[22px] font-[800] text-[#dc2626]">{totalBlocked.toLocaleString()}</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-[#e2e8f0]">
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                NGƯỜI DÙNG
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                VAI TRÒ
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                SĐT
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                NGÀY ĐĂNG KÝ
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                HOẠT ĐỘNG
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                TRẠNG THÁI
              </th>
              <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-[#94a3b8]">
                HÀNH ĐỘNG
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id || user._id}
                className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center`}
                    >
                      {user.fullName?.substring(0, 2).toUpperCase() || user.username?.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#0f172a]">
                        {user.fullName || user.username}
                      </div>
                      <div className="text-[11px] text-[#94a3b8]">
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      user.role === "landlord"
                        ? "bg-[#fef3c7] text-[#d97706]"
                        : "bg-[#dbeafe] text-[#2563eb]"
                    }`}
                  >
                    {user.role === "landlord" ? "Chủ trọ" : user.role === "admin" ? "Admin" : "Người thuê"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">
                  {user.phone || "---"}
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "---"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs ${
                      user.status === "blocked"
                        ? "text-[#dc2626]"
                        : "text-[#16a34a]"
                    }`}
                  >
                    {user.status === "blocked" ? "Bị giới hạn" : "Đang hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${
                      user.status === "blocked"
                        ? "bg-[#fee2e2] text-[#dc2626]"
                        : "bg-[#dcfce7] text-[#16a34a]"
                    }`}
                  >
                    {user.status === "blocked" ? "BỊ KHOÁ" : "Hoạt động"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]">
                      Chi tiết
                    </button>
                    {user.status === "blocked" ? (
                      <button 
                        onClick={() => onToggleStatus(user._id)}
                        className="px-2.5 py-1 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] rounded-lg text-[11px] font-semibold hover:bg-[#bbf7d0]"
                      >
                        Mở khoá
                      </button>
                    ) : (
                      <button 
                        onClick={() => onToggleStatus(user._id)}
                        className="px-2.5 py-1 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]"
                      >
                        Khoá
                      </button>
                    )}
                    <button 
                      onClick={() => onDeleteUser(user._id)}
                      className="px-2.5 py-1 bg-white border border-red-200 text-red-600 rounded-lg text-[11px] font-semibold hover:bg-red-50"
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Verification View Component
function VerificationView({ 
  verifications, 
  onApprove, 
  onComplete,
  onOpenInspect 
}: { 
  verifications: any[], 
  onApprove: (id: string, date: string) => void, 
  onComplete: (id: string, level: string, notes?: string) => void,
  onOpenInspect: (v: any) => void
}) {
  return (
    <div className="space-y-4">
      {/* Pipeline */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#d97706] mb-1">{verifications.filter(v => v.status === "pending").length}</div>
          <div className="text-[10px] text-[#94a3b8]">Yêu cầu mới</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#94a3b8] mb-1">{verifications.filter(v => ["approved", "awaiting_photos", "photos_submitted"].includes(v.status)).length}</div>
          <div className="text-[10px] text-[#94a3b8]">Đang xử lý</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#dc2626] mb-1">{verifications.filter(v => v.status === "rejected").length}</div>
          <div className="text-[10px] text-[#94a3b8]">Đã từ chối</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#16a34a] mb-1">
            {verifications.filter(v => v.status === "completed").length}
          </div>
          <div className="text-[10px] text-[#94a3b8]">Đã cấp ✅</div>
        </div>
      </div>

      {/* Verification Cards */}
      <div className="space-y-2.5">
        {verifications.map((item) => (
          <div
            key={item.id || item._id}
            className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 ${
              item.status === "rejected"
                ? "border-[#fecaca]"
                : item.status === "pending"
                  ? "border-[#bae6fd]"
                  : "border-[#e2e8f0]"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-[46px] h-[46px] rounded-[10px] flex items-center justify-center text-xl flex-shrink-0 ${
                item.status === "rejected"
                  ? "bg-[#fee2e2]"
                  : item.status === "pending"
                    ? "bg-[#dbeafe]"
                    : "bg-[#dcfce7]"
              }`}
            >
              🏠
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13.5px] font-bold text-[#0f172a]">
                  {item.propertyId?.name || "Căn trọ chưa xác định"}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.packageType === "premium"
                      ? "bg-[#dbeafe] text-[#0ea5e9]"
                      : "bg-[#dcfce7] text-[#16a34a]"
                  }`}
                >
                  {item.packageType || "Cơ bản"}
                </span>
              </div>
              <div className="text-[11.5px] text-[#94a3b8] mb-2">
                📍 {item.propertyId?.address || "Địa chỉ chưa cập nhật"} • Chủ trọ: {item.landlordId?.name}
              </div>
              {/* Status Info */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#475569]">
                  Trạng thái:
                </span>
                <span className={`text-[11px] font-bold ${item.status === "completed" ? "text-green-500" : "text-amber-500"}`}>
                  {item.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5 text-right">
              {item.status === "pending" && (
                <button
                  onClick={() => {
                    const scheduledDate = prompt("Nhập ngày kiểm tra (YYYY-MM-DD):");
                    if (scheduledDate) onApprove(item._id, scheduledDate);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white rounded-lg text-xs font-bold hover:opacity-90"
                >
                  📍 Phân công thực địa
                </button>
              )}
              {item.status === "approved" && (
                <button
                  onClick={() => onOpenInspect(item)}
                  className="px-4 py-2 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] rounded-lg text-[11px] font-semibold"
                >
                  ✓ Đánh dấu hoàn thành
                </button>
              )}
              {item.status === "completed" ? (
                <button className="px-4 py-2 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] rounded-lg text-[11px] font-semibold">
                  ✓ Đã xác thực
                </button>
              ) : (
                <button className="px-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold">
                  👁 Chi tiết
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  children,
  count,
  variant,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count?: string;
  variant?: "amber" | "red";
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-[12.5px] font-semibold border transition-all ${
        active
          ? "bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]"
          : "bg-white border-[#e2e8f0] text-[#475569] hover:border-[#bbf7d0]"
      }`}
    >
      {children}
      {count && (
        <span
          className={`ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold ${
            variant === "amber"
              ? "bg-[#fef3c7] text-[#d97706]"
              : variant === "red"
                ? "bg-[#fee2e2] text-[#dc2626]"
                : "bg-black/10"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// Status Pill Component
function StatusPill({
  status,
}: {
  status: "pending" | "approved" | "reported";
}) {
  const styles = {
    pending: "bg-[#fef3c7] text-[#d97706]",
    approved: "bg-[#dcfce7] text-[#16a34a]",
    reported: "bg-[#fee2e2] text-[#dc2626]",
  };

  const labels = {
    pending: "Chờ duyệt",
    approved: "Hiển thị",
    reported: "Bị báo cáo",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium ${styles[status]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {labels[status]}
    </span>
  );
}

// Bookings View Component
function BookingsView({ bookings, onDeleteBooking }: { bookings: any[], onDeleteBooking: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#e2e8f0]">
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">CĂN TRỌ</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">KHÁCH THUÊ</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">CHỦ TRỌ</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">NGÀY HẸN</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">TRẠNG THÁI</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{b.propertyId?.name || "N/A"}</td>
                <td className="px-4 py-3 text-gray-600">{b.userId?.fullName || b.userId?.username || "Ẩn danh"}</td>
                <td className="px-4 py-3 text-gray-600">{b.landlordId?.name || "Ẩn danh"}</td>
                <td className="px-4 py-3 text-gray-600">
                  {new Date(b.bookingDate).toLocaleDateString()} {b.bookingTime}
                </td>
                <td className="px-4 py-3 font-semibold uppercase text-[10px]">
                  {b.status}
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => onDeleteBooking(b._id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-xs font-semibold border border-red-200">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <div className="p-4 text-center text-sm text-gray-500">Chưa có lịch hẹn nào.</div>}
      </div>
    </div>
  );
}

// Reviews View Component
function ReviewsView({ reviews, onDeleteReview }: { reviews: any[], onDeleteReview: (id: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-[#e2e8f0] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#e2e8f0]">
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">CĂN TRỌ</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">USER</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">RATING</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">COMMENT</th>
              <th className="px-4 py-3 text-left font-bold uppercase text-[#94a3b8] text-[10px]">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r._id} className="border-b border-[#e2e8f0] hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{r.propertyId?.name || "N/A"}</td>
                <td className="px-4 py-3 text-gray-600">{r.userId?.username || "Ẩn danh"}</td>
                <td className="px-4 py-3 text-orange-500 font-bold">{r.rating} ⭐</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate" title={r.comment}>{r.comment}</td>
                <td className="px-4 py-3">
                  <button onClick={() => onDeleteReview(r._id)} className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-md text-xs font-semibold border border-red-200">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && <div className="p-4 text-center text-sm text-gray-500">Chưa có đánh giá nào.</div>}
      </div>
    </div>
  );
}
