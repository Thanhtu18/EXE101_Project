import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import api from "@/app/utils/api";
import { getAvatarUrl, getInitials } from "@/app/utils/avatarUtils";
import { useVerification } from "@/app/contexts/VerificationContext";
import { useProperties } from "@/app/contexts/PropertiesContext";
import { Button } from "@/app/components/ui/button";
import { InspectionDialog } from "@/app/components/InspectionDialog";
import { VerificationRequest } from "@/app/components/types";
import { UserDetailDialog } from "@/app/components/UserDetailDialog";
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
  Filter,
  User,
  Download,
  ShieldCheck,
  Clock,
  Award,
  XCircle,
  Phone,
  MapPinned,
  Trash2,
  Star,
} from "lucide-react";
import { RevenueView } from "./RevenueView";
import { InspectionsView } from "@/app/components/InspectionsView";
import { SettingsView } from "./SettingsView";
import { toast } from "sonner";

type AdminView =
  | "dashboard"
  | "posts"
  | "users"
  | "verification"
  | "bookings"
  | "reviews"
  | "revenue"
  | "inspections"
  | "settings";

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
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [adminNotifications, setAdminNotifications] = useState<any[]>([]);

  const fetchData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
      setLoading(!showRefresh);

      // Parallel fetch for dashboard data
      const [
        statsRes, searchRes, topRoomsRes, 
        postsRes, usersRes, verificationsRes, 
        bookingsRes, reviewsRes,
        notifRes
      ] = await Promise.all([
        api.get(`/api/admin/stats?month=${selectedMonth}&year=${selectedYear}`),
        api.get("/api/admin/stats/weekly-search"),
        api.get("/api/admin/stats/top-rooms"),
        api.get("/api/admin/properties"),
        api.get("/api/admin/users"),
        api.get("/api/admin/verification-requests"),
        api.get("/api/admin/bookings"),
        api.get("/api/admin/reviews"),
        api.get("/api/admin/notifications")
      ]);

      const stats = statsRes.data;
      const searchData = searchRes.data || [];
      const topRoomsData = topRoomsRes.data || [];
      const postsData = postsRes.data || [];
      const usersData = usersRes.data || [];
      const verificationsData = verificationsRes.data || [];
      const bookingsData = bookingsRes.data || [];
      const reviewsData = reviewsRes.data || [];
      const notifsData = notifRes.data || [];

      if (stats) setStats(stats);
      setAdminNotifications(notifsData);
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
          time: new Date(v.requestedAt || v.createdAt).toLocaleTimeString("vi-VN"),
          color: v.status === "pending" ? "blue" : "green"
        })),
        ...postsData.slice(0, 1).map((p: any) => ({
          id: `p-${p._id}`,
          text: `Tin đăng mới: '${p.name}'`,
          time: new Date(p.createdAt).toLocaleTimeString("vi-VN"),
          color: "green"
        }))
      ];
      setRecentActivities(activities);

      if (showRefresh) {
        setTimeout(() => setIsRefreshing(false), 800);
        toast.success("Dữ liệu đã được làm mới! ✨");
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
      setIsRefreshing(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchData();
    }
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleUpdatePropertyStatus = async (id: string, status: string) => {
    try {
      const res = await api.put(`/api/admin/properties/${id}/status`, { status });
      if (res.status === 200) {
        setPosts(posts.map((p) => (p._id === id ? { ...p, status } : p)));
        toast.success("Cập nhật trạng thái tin đăng thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleUserStatus = async (id: string) => {
    try {
      const res = await api.put(`/api/admin/users/${id}/status`);
      if (res.status === 200) {
        setUsers(
          users.map((u) =>
            u._id === id
              ? { ...u, status: u.status === "blocked" ? "active" : "blocked" }
              : u
          )
        );
        toast.success("Cập nhật trạng thái người dùng thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleApproveVerification = async (id: string, date: string) => {
    try {
      const res = await api.put(`/api/admin/verification/${id}/approve`, { scheduledDate: date });
      if (res.status === 200) {
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
      const res = await api.put(`/api/admin/verification/${id}/complete`, { badgeAwarded: badgeLevel, inspectorNotes: notes });
      if (res.status === 200) {
        setVerifications(
          verifications.map((v) =>
            v._id === id ? { ...v, status: badgeLevel === "none" ? "rejected" : "completed", inspectorNotes: notes } : v
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
      const res = await api.delete(`/api/admin/bookings/${id}`);
      if (res.status === 200) {
        setBookings(bookings.filter((b) => b._id !== id));
        toast.success("Đã xóa lịch hẹn thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm("Bác có chắc muốn xóa đánh giá này?")) return;
    try {
      const res = await api.delete(`/api/admin/reviews/${id}`);
      if (res.status === 200) {
        setReviews(reviews.filter((r) => r._id !== id));
        toast.success("Đã xóa đánh giá thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm("Bác có chắc muốn XÓA VĨNH VIỄN người dùng này?")) return;
    try {
      const res = await api.delete(`/api/admin/users/${id}`);
      if (res.status === 200) {
        setUsers(users.filter((u) => u._id !== id));
        toast.success("Đã xóa người dùng thành công! ✅");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenUserDetail = (userId: string) => {
    setSelectedUserId(userId);
    setIsUserDetailOpen(true);
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex font-sans">
      {/* Background Aura Effects */}
      <div className="fixed inset-0 z-0 bg-gradient-to-tr from-[#f0f9f5] via-white to-[#f0f2f9]" />

      {/* Sidebar Navigation */}
      <aside className="w-80 bg-white/70 backdrop-blur-3xl border-r border-white/40 flex-shrink-0 sticky top-0 h-screen overflow-hidden flex flex-col z-20 shadow-[4px_0_30px_rgba(0,0,0,0.02)]">
        {/* Logo Section */}
        <div className="p-10">
          <div 
            className="flex items-center gap-4 px-2 hover:scale-105 transition-transform cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 p-3 rounded-[20px] shadow-2xl shadow-blue-100">
              <Home className="size-8 text-white" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-slate-800 tracking-tighter leading-none">MapHome</h1>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full mt-2 inline-block shadow-sm">Admin Panel</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-6 space-y-8 overflow-y-auto no-scrollbar">
          {/* NAVIGATION SECTIONS */}
          {[
            {
              title: "Tổng quan",
              items: [{ id: "dashboard", label: "Dashboard", icon: LayoutDashboard }]
            },
            {
              title: "Quản lý",
              items: [
                { id: "posts", label: "Tin đăng", icon: FileText, count: posts.length, color: "blue" },
                { id: "users", label: "Người dùng", icon: Users },
                { id: "verification", label: "Tích Xanh", icon: CheckCircle, count: verifications.filter(v => v.status === 'pending').length, color: "rose" },
                { id: "bookings", label: "Lịch hẹn", icon: Calendar },
                { id: "reviews", label: "Đánh giá", icon: Award },
                { id: "inspections", label: "Lịch kiểm tra", icon: ShieldCheck },
                { id: "revenue", label: "Doanh thu", icon: TrendingUp },
              ]
            },
            {
              title: "Hệ thống",
              items: [{ id: "settings", label: "Cài đặt", icon: Settings }]
            }
          ].map((section, sIdx) => (
            <div key={section.title}>
              <div className="px-4 mb-4 text-[10px] font-black uppercase text-indigo-500/70 tracking-[0.2em]">
                {section.title}
              </div>
              <div className="space-y-2">
                {section.items.map((item) => {
                  const isActive = activeView === item.id;
                  const Icon = item.icon;
                  return (
                    <motion.button
                      key={item.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveView(item.id as any)}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-[22px] text-sm font-black tracking-tight transition-all relative group ${
                        isActive
                          ? "bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 text-white shadow-[0_15px_35px_rgba(59,130,246,0.2)]"
                          : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
                      }`}
                    >
                      <div className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : ""}`}>
                        <Icon className="size-5 flex-shrink-0" />
                      </div>
                      <span>{item.label}</span>
                      {item.count !== undefined && (
                        <span className={`ml-auto px-2 py-0.5 rounded-lg text-[9px] font-black ${
                          isActive ? "bg-white/20 text-white" : `bg-${item.color || 'slate'}-50 text-${item.color || 'slate'}-600`
                        }`}>
                          {item.count}
                        </span>
                      )}
                      {isActive && (
                        <motion.div 
                          layoutId="activeAdminTab"
                          className="absolute right-4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" 
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Card */}
        <div className="p-6 mt-auto">
          <div className="p-5 rounded-[32px] bg-white/50 border border-white/60 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-[18px] border-2 border-white shadow-xl overflow-hidden bg-gradient-to-br from-emerald-500 via-blue-500 to-indigo-600 flex items-center justify-center text-white text-[11px] font-black shrink-0">
                {user?.avatar ? (
                  <img src={getAvatarUrl(user.avatar) || ""} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.fullName, user?.username)
                )}
              </div>
              <div className="flex-1 min-w-0 pr-1">
                <div className="text-[13px] font-black text-slate-800 truncate">
                  {user?.fullName || user?.username || "Admin"}
                </div>
                <div className="text-[9px] text-indigo-600 font-black uppercase tracking-tight">
                  System Administrator
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="rounded-xl h-10 bg-slate-50 hover:bg-white text-slate-500 hover:text-indigo-600 font-black text-[10px] p-0"
              >
                <Home className="size-3.5 mr-1.5" /> Trang chủ
              </Button>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="rounded-xl h-10 bg-rose-50 hover:bg-rose-100 text-rose-500 font-black text-[10px] p-0"
              >
                <LogOut className="size-3.5 mr-1.5" /> Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative z-10 flex flex-col h-screen">
        <div className="flex-1 w-full flex flex-col">
          {/* Luminous 3.0: Premium Sticky Header */}
          <header className="px-10 py-5 flex items-center justify-between sticky top-0 z-40 bg-white/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.03)] border-b border-white mb-6">
            <div className="flex flex-col">
              <h2 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Hệ thống quản trị</h2>
            <div className="text-4xl font-black bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-600 bg-clip-text text-transparent tracking-tighter leading-tight">
                {activeView === "dashboard" && "Dashboard Tổng Quan"}
                {activeView === "posts" && "Quản lý Tin đăng"}
                {activeView === "users" && "Quản lý Người dùng"}
                {activeView === "verification" && "Xác thực Tích Xanh"}
                {activeView === "bookings" && "Quản lý Lịch hẹn"}
                {activeView === "reviews" && "Quản lý Đánh giá"}
                {activeView === "revenue" && "Báo cáo Doanh Thu"}
                {activeView === "inspections" && "Kiểm tra thực địa"}
                {activeView === "settings" && "Cấu hình hệ thống"}
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-xl border border-white/40 p-2 rounded-[28px] shadow-2xl shadow-slate-200/50">
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => fetchData(true)}
                className="w-12 h-12 bg-white rounded-[20px] shadow-sm flex items-center justify-center text-emerald-500 hover:text-emerald-600 transition-colors border border-slate-50"
              >
                <motion.div
                  animate={isRefreshing ? { rotate: 360 } : {}}
                  transition={{ repeat: isRefreshing ? Infinity : 0, duration: 1, ease: "linear" }}
                >
                  <TrendingUp className="size-5" />
                </motion.div>
              </motion.button>

              <div className="h-8 w-px bg-slate-200/50" />

              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsDatePickerOpen(!isDatePickerOpen);
                    setIsNotificationOpen(false);
                  }}
                  className={`px-6 py-3 rounded-[20px] text-[11px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${
                    isDatePickerOpen 
                      ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100" 
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Calendar className="size-4" />
                  {`Tháng ${selectedMonth}, ${selectedYear}`}
                </motion.button>

                <AnimatePresence>
                  {isDatePickerOpen && (
                    <MonthYearPicker 
                      selectedMonth={selectedMonth} 
                      selectedYear={selectedYear}
                      onSelect={(m, y) => {
                        setSelectedMonth(m);
                        setSelectedYear(y);
                        setIsDatePickerOpen(false);
                      }}
                      onClose={() => setIsDatePickerOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsNotificationOpen(!isNotificationOpen);
                    setIsDatePickerOpen(false);
                  }}
                  className={`w-12 h-12 rounded-[20px] flex items-center justify-center transition-all relative ${
                    isNotificationOpen 
                      ? "bg-amber-500 text-white shadow-xl shadow-amber-100" 
                      : "bg-white text-slate-400 hover:text-amber-500"
                  }`}
                >
                  <Bell className="size-5" />
                  {!isNotificationOpen && adminNotifications.length > 0 && (
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </motion.button>

                <AnimatePresence>
                  {isNotificationOpen && (
                    <NotificationTray 
                      notifications={adminNotifications}
                      onClose={() => setIsNotificationOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

        <div className="p-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center scale-75">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeView}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {activeView === "dashboard" && <DashboardView stats={stats} weeklySearchData={weeklySearchData} recentActivities={recentActivities} topRooms={topRooms} posts={posts} />}
                {activeView === "posts" && <PostsView posts={posts} onUpdateStatus={handleUpdatePropertyStatus} />}
                {activeView === "users" && <UsersView users={users} onToggleStatus={handleToggleUserStatus} onDeleteUser={handleDeleteUser} onViewDetail={handleOpenUserDetail} />}
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
                {activeView === "settings" && <SettingsView />}
              </motion.div>
            </AnimatePresence>
          )}
          </div>
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

      {/* User Detail Dialog */}
      <UserDetailDialog
        isOpen={isUserDetailOpen}
        onClose={() => {
          setIsUserDetailOpen(false);
          setSelectedUserId(null);
          fetchData(); // Refresh if status changed
        }}
        userId={selectedUserId}
      />
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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { 
          opacity: 1, 
          transition: { 
            staggerChildren: 0.15,
            delayChildren: 0.1
          } 
        }
      }}
      className="space-y-10"
    >
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          icon="🏘️"
          iconBg="#f0fdf4"
          label="Tổng tin đăng"
          value={stats?.totalProperties?.toLocaleString() || "0"}
          change="Phát triển"
          changePositive
          topGradient="linear-gradient(90deg, #10b981, #34d399)"
        />
        <KPICard
          icon="👥"
          iconBg="#eff6ff"
          label="Người dùng"
          value={stats?.totalUsers?.toLocaleString() || "0"}
          change="+12.5%"
          changePositive
          topGradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
        />
        <KPICard
          icon="✅"
          iconBg="#fffbeb"
          label="Tích Xanh đã cấp"
          value={stats?.completedVerifications?.toLocaleString() || "0"}
          change="Tuyệt vời"
          changePositive
          topGradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
        />
        <KPICard
          icon="⚠️"
          iconBg="#fff1f2"
          label="Chờ xử lý"
          value={stats?.pendingVerifications?.toLocaleString() || "0"}
          change={stats?.pendingVerifications > 0 ? "Cần duyệt" : "Tốt"}
          changeNegative={stats?.pendingVerifications > 0}
          topGradient="linear-gradient(90deg, #ef4444, #f87171)"
        />
      </div>

      {/* Charts & Timeline Row */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-[1.6fr_1fr] gap-6"
      >
        {/* Weekly Search Chart */}
        <motion.div 
          variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }}
          className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-sm font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
                Lượt tìm kiếm
              </h3>
              <p className="text-xs text-slate-400 font-semibold mt-1">Dữ liệu theo tuần (Real-time)</p>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <TrendingUp className="size-5 text-emerald-500" />
            </button>
          </div>
          
          <div className="h-[200px] flex items-end justify-between gap-6 px-2">
            {weeklySearchData.map((item) => (
              <div key={item.day} className="flex-1 flex flex-col items-center gap-3">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ duration: 1, delay: 0.5, ease: "circOut" }}
                  className={`w-full max-w-[40px] rounded-2xl relative group ${
                    item.highlight
                      ? "bg-gradient-to-t from-emerald-500 to-emerald-300"
                      : "bg-slate-100 group-hover:bg-slate-200"
                  }`}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.value}%
                  </div>
                </motion.div>
                <span className={`text-[10px] font-bold ${item.highlight ? "text-emerald-600" : "text-slate-400"}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Modern Activity Feed */}
        <motion.div 
          variants={{ hidden: { opacity: 0, x: 20 }, show: { opacity: 1, x: 0 } }}
          className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wider">
              Hoạt động hệ thống
            </h3>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">Mới nhất</span>
          </div>
          
          <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
            {recentActivities.map((activity, idx) => (
              <div key={activity.id} className="relative pl-8 group">
                {/* Dot */}
                <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full border-4 border-white shadow-sm z-10 transition-transform group-hover:scale-125 ${
                  activity.color === "red" ? "bg-rose-500" : 
                  activity.color === "green" ? "bg-emerald-500" : 
                  activity.color === "amber" ? "bg-amber-500" : "bg-blue-500"
                }`} />
                
                <div>
                  <p className="text-[13px] text-slate-700 font-medium leading-relaxed">
                    {activity.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="size-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Row - Status & Top Rooms */}
      <motion.div 
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-2 gap-6"
      >
        {/* Status Pie Summary */}
        <motion.div 
           variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
           className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm"
        >
          <h3 className="text-sm font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider mb-8">
            Trạng thái tin đăng
          </h3>
          <div className="flex items-center justify-around gap-8">
            <div className="relative w-[130px] h-[130px] group">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-sm" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray={`${approvedPct} 100`} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray={`${pendingPct} 100`} strokeDashoffset={-approvedPct} />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${reportedPct} 100`} strokeDashoffset={-(approvedPct + pendingPct)} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-800">{posts.length}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">Tin đăng</span>
              </div>
            </div>

            <div className="flex-1 space-y-4">
              {[
                { label: "Đang hiển thị", value: approvedPct, color: "emerald" },
                { label: "Chờ phê duyệt", value: pendingPct, color: "amber" },
                { label: "Bị báo cáo", value: reportedPct, color: "rose" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-${item.color}-500`} />
                      <span className="font-bold text-slate-600">{item.label}</span>
                    </div>
                    <span className="font-black text-slate-900">{item.value}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className={`h-full bg-${item.color}-500`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Performing Rooms */}
        <motion.div 
          variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
          className="bg-white rounded-[32px] border border-slate-100 p-8 shadow-sm"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-sm font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-wider">
              Top phòng được xem
            </h3>
            <Eye className="size-5 text-emerald-500" />
          </div>
          
          <div className="space-y-6">
            {topRooms.map((room, idx) => (
              <div key={room.rank} className="group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center font-black text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-all">
                    0{room.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-black text-slate-800 truncate group-hover:text-emerald-500 transition-colors">
                      {room.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="size-3 text-slate-300" />
                      <span className="text-[11px] text-slate-400 font-medium truncate">{room.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">
                      {room.views.toLocaleString()}
                    </p>
                    <p className="text-[9px] uppercase font-bold text-slate-300">Lượt xem</p>
                  </div>
                </div>
                {idx < topRooms.length - 1 && <div className="h-px bg-slate-50 mt-4" />}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Enhanced KPI Card Component
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
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 10 } }}
      className="relative overflow-hidden rounded-[40px] p-8 transition-all group shadow-xl shadow-slate-200/30 bg-white/80 backdrop-blur-3xl border border-white/50"
    >
      <div className="flex flex-col gap-6 relative z-10">
        <div className="flex items-center justify-between">
          <div 
            className="w-14 h-14 rounded-[22px] flex items-center justify-center text-2xl shadow-lg shadow-slate-100 group-hover:scale-110 transition-transform duration-300 border border-white"
            style={{ background: topGradient, color: 'white' }}
          >
            {icon}
          </div>
          {change && (
             <motion.div 
               initial={{ x: 10, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-slate-50 text-slate-500 border border-slate-100 shadow-sm"
             >
               {changePositive ? '＋' : '↓'} {change}
             </motion.div>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
          <div className="text-5xl font-black text-slate-900 tracking-tighter group-hover:tracking-tight transition-all duration-500 drop-shadow-sm">
            {value}
          </div>
        </div>
      </div>
      {/* Refined Bottom Accent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-2 opacity-40 group-hover:opacity-100 transition-opacity"
        style={{ background: topGradient }}
      />
    </motion.div>
  );
}

// Posts View Component
function PostsView({ posts, onUpdateStatus }: { posts: any[], onUpdateStatus: (id: string, status: string) => void }) {
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "reported" | "approved">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = (posts || []).filter(post => {
    const matchesTab = activeTab === "all" || post.status === activeTab;
    const matchesSearch = post.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.address?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.05 } }
      }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Quản lý Tin đăng</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Duyệt, ẩn và xử lý vi phạm tin đăng toàn hệ thống</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            <input
              type="text"
              placeholder="Tìm tên phòng, địa chỉ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-2xl text-sm focus:border-emerald-500 outline-none w-64 transition-all shadow-sm"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors shadow-sm">
            <Filter className="size-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Tab Bar with layoutId */}
      <div className="flex items-center p-1 bg-slate-100/50 rounded-2xl w-fit">
        {[
          { id: "all", label: "Tất cả", icon: null },
          { id: "pending", label: "Chờ duyệt", icon: "⏳", color: "amber" },
          { id: "reported", label: "Bị báo cáo", icon: "⚠️", color: "rose" },
          { id: "approved", label: "Hiển thị", icon: "✅", color: "emerald" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative px-6 py-2 text-xs font-bold transition-all rounded-xl ${
              activeTab === tab.id ? "text-emerald-700" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabPill"
                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {tab.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                activeTab === tab.id ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-500"
              }`}>
                {(posts || []).filter(p => tab.id === 'all' ? true : p.status === tab.id).length}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <motion.div
              layout
              key={post._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.2 } },
                exit: { opacity: 0, scale: 0.95 }
              }}
              whileHover={{ scale: 1.01, y: -8, transition: { type: "spring", stiffness: 400, damping: 10 } }}
              className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[40px] p-8 hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
            >
              <div className="flex items-center gap-6">
                {/* Image / Thumbnail */}
                <div className="w-24 h-24 rounded-2xl bg-slate-50 flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform">
                  {post.images && post.images.length > 0 ? (
                    <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">🏠</div>
                  )}
                  <div className="absolute top-2 left-2">
                    <StatusPill status={post.status} />
                  </div>
                </div>

                {/* Info Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-[15px] font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors">
                        {post.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="size-3 text-slate-300" />
                        <span className="text-xs text-slate-400 font-medium truncate">{post.address}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black text-emerald-600 tracking-tighter">
                        {post.price?.toLocaleString()}
                        <span className="text-[10px] text-slate-400 tracking-normal ml-0.5 font-bold uppercase">/tháng</span>
                      </div>
                      <div className="flex items-center justify-end gap-2 mt-1">
                         <span className="text-[10px] font-bold text-slate-300 uppercase">{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[8px] font-black flex items-center justify-center shadow-sm">
                           {post.landlordId?.name?.substring(0, 2).toUpperCase() || "LL"}
                        </div>
                        <span className="text-xs font-bold text-slate-600">{post.landlordId?.name || "Chưa có tên"}</span>
                      </div>
                      <div className="text-[10px] font-bold text-slate-300 flex items-center gap-1">
                        <User className="size-3" />
                         {post.landlordId?.email}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {post.status === "pending" && (
                        <>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onUpdateStatus(post._id, "approved")}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all"
                          >
                            Duyệt tin
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onUpdateStatus(post._id, "rejected")}
                            className="px-4 py-2 bg-white border border-rose-100 text-rose-500 rounded-xl text-xs font-black hover:bg-rose-50 transition-all"
                          >
                            Từ chối
                          </motion.button>
                        </>
                      )}
                      
                      {post.status === "reported" && (
                        <>
                          <button 
                            onClick={() => onUpdateStatus(post._id, "approved")}
                            className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all"
                          >
                            Giữ lại tin
                          </button>
                          <button 
                            onClick={() => onUpdateStatus(post._id, "rejected")}
                            className="px-4 py-2 bg-rose-500 text-white rounded-xl text-xs font-black hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"
                          >
                            Gỡ vĩnh viễn
                          </button>
                        </>
                      )}

                      <button className="p-2 hover:bg-slate-50 text-slate-400 hover:text-emerald-500 transition-all rounded-xl">
                        <Eye className="size-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredPosts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-100"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <span className="text-4xl text-slate-200">🔍</span>
            </div>
            <h3 className="text-lg font-black bg-gradient-to-r from-slate-400 to-slate-300 bg-clip-text text-transparent uppercase tracking-widest">Không tìm thấy tin đăng</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-[280px] font-semibold">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn xem sao nhé.</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

// Users View Component
function UsersView({ 
  users, 
  onToggleStatus, 
  onDeleteUser,
  onViewDetail
}: { 
  users: any[], 
  onToggleStatus: (id: string) => void, 
  onDeleteUser: (id: string) => void,
  onViewDetail: (id: string) => void
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "landlord" | "user" | "admin">("all");

  const totalLandlords = users.filter(u => u.role === "landlord").length;
  const totalUsers = users.filter(u => u.role === "user").length;
  const totalBlocked = users.filter(u => u.status === "blocked").length;

  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.fullName || user.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-8"
    >
      {/* Stat Mini Cards */}
      <div className="grid grid-cols-4 gap-6">
        <KPICard
          icon="👥"
          iconBg="#eff6ff"
          label="Tổng người dùng"
          value={users.length.toLocaleString()}
          change="Hệ thống"
          changePositive
          topGradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
        />
        <KPICard
          icon="🏠"
          iconBg="#fffbeb"
          label="Chủ trọ"
          value={totalLandlords.toLocaleString()}
          change="Đối tác"
          changePositive
          topGradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
        />
        <KPICard
          icon="👤"
          iconBg="#f0fdf4"
          label="Người thuê"
          value={totalUsers.toLocaleString()}
          change="Khách hàng"
          changePositive
          topGradient="linear-gradient(90deg, #10b981, #34d399)"
        />
        <KPICard
          icon="🚫"
          iconBg="#fff1f2"
          label="Bị khoá"
          value={totalBlocked.toLocaleString()}
          change="Vi phạm"
          changeNegative
          topGradient="linear-gradient(90deg, #ef4444, #f87171)"
        />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center p-1 bg-slate-100/50 rounded-2xl w-fit">
          {[
            { id: "all", label: "Tất cả" },
            { id: "landlord", label: "Chủ trọ" },
            { id: "user", label: "Người thuê" },
            { id: "admin", label: "Admin" },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => setFilterRole(role.id as any)}
              className={`relative px-6 py-2 text-xs font-bold transition-all rounded-xl ${
                filterRole === role.id ? "text-blue-700" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {filterRole === role.id && (
                <motion.div
                  layoutId="rolePill"
                  className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/50"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{role.label}</span>
            </button>
          ))}
        </div>

        <div className="relative group w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
           <input
             type="text"
             placeholder="Tìm tên, email..."
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all shadow-sm"
           />
        </div>
      </div>

      {/* Modern User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredUsers.map((user) => (
            <motion.div
              layout
              key={user._id || user.id}
              variants={{
                hidden: { opacity: 0, scale: 0.9, y: 20 },
                show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.3 } },
                exit: { opacity: 0, scale: 0.9 }
              }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/60 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center text-xl font-black text-white shadow-lg ${
                    user.role === 'admin' ? 'bg-indigo-500' : user.role === 'landlord' ? 'bg-amber-500' : 'bg-blue-500'
                  }`}>
                    {user.fullName?.substring(0, 1).toUpperCase() || user.username?.substring(0, 1).toUpperCase()}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                    user.status === 'blocked' ? 'bg-rose-500' : 'bg-emerald-500'
                  }`} />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-black text-slate-800">{user.fullName || user.username}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase ${
                      user.role === 'landlord' ? 'bg-amber-50 text-amber-600' : user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 'bg-blue-50 text-blue-600'
                    }`}>
                      {user.role === 'landlord' ? 'Chủ trọ' : user.role === 'admin' ? 'Admin' : 'Người thuê'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">{user.email}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                       <Calendar className="size-3" />
                       {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                        <Phone className="size-3" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => onViewDetail(user._id)}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all rounded-xl"
                  title="Chi tiết"
                >
                  <Eye className="size-5" />
                </button>
                <button 
                  onClick={() => onToggleStatus(user._id)}
                  className={`p-2.5 rounded-xl transition-all ${
                    user.status === 'blocked' 
                    ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                    : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'
                  }`}
                  title={user.status === 'blocked' ? 'Mở khoá' : 'Khoá'}
                >
                  {user.status === 'blocked' ? <ShieldCheck className="size-5" /> : <XCircle className="size-5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Reusable Modern Empty State
function ModernEmptyState({ icon, title, description, color = "emerald" }: { icon: string, title: string, description: string, color?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-8 text-center bg-white rounded-[40px] border border-slate-100 shadow-sm"
    >
      <div className={`w-24 h-24 bg-${color}-50 rounded-[32px] flex items-center justify-center text-4xl mb-6 shadow-inner rotate-3`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-sm font-medium leading-relaxed">{description}</p>
    </motion.div>
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
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-10"
    >
      {/* Premium Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <KPICard
          icon="⏳"
          iconBg="#fffbeb"
          label="Yêu cầu mới"
          value={verifications.filter(v => v.status === "pending").length.toLocaleString()}
          change="Chờ duyệt"
          changePositive
          topGradient="linear-gradient(90deg, #f59e0b, #fbbf24)"
        />
        <KPICard
          icon="⚙️"
          iconBg="#eff6ff"
          label="Đang xử lý"
          value={verifications.filter(v => ["approved", "awaiting_photos", "photos_submitted"].includes(v.status)).length.toLocaleString()}
          change="Tiến độ"
          changePositive
          topGradient="linear-gradient(90deg, #3b82f6, #60a5fa)"
        />
        <KPICard
          icon="❌"
          iconBg="#fff1f2"
          label="Đã từ chối"
          value={verifications.filter(v => v.status === "rejected").length.toLocaleString()}
          change="Vi phạm"
          changeNegative
          topGradient="linear-gradient(90deg, #ef4444, #f87171)"
        />
        <KPICard
          icon="✅"
          iconBg="#f0fdf4"
          label="Đã cấp"
          value={verifications.filter(v => v.status === "completed").length.toLocaleString()}
          change="Thành công"
          changePositive
          topGradient="linear-gradient(90deg, #10b981, #34d399)"
        />
      </div>

      {/* Modern Verification List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent tracking-tight uppercase">Danh sách yêu cầu kiểm tra</h3>
            <div className="text-[10px] font-black text-emerald-500 uppercase tracking-widest px-3 py-1 bg-emerald-50/80 rounded-lg border border-emerald-100 shadow-sm shadow-emerald-50">
              Tổng số yêu cầu: {verifications.length}
            </div>
        </div>

        <AnimatePresence mode="popLayout">
          {verifications.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 pb-10">
              {verifications.map((item) => (
                <motion.div
                  layout
                  key={item.id || item._id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.005, y: -4 }}
                  className={`bg-white border rounded-[32px] p-6 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group flex items-center gap-6 ${
                    item.status === "rejected" ? "border-rose-100" : item.status === "pending" ? "border-amber-100" : "border-slate-100"
                  }`}
                >
                  {/* Property Icon/Preview */}
                  <div className={`w-20 h-20 rounded-[24px] flex items-center justify-center text-3xl flex-shrink-0 shadow-inner group-hover:rotate-3 transition-transform ${
                    item.status === "rejected" ? "bg-rose-50" : item.status === "pending" ? "bg-amber-50" : "bg-emerald-50"
                  }`}>
                    🏠
                  </div>

                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5">
                      <h4 className="text-[15px] font-black text-slate-800 tracking-tight group-hover:text-emerald-600 transition-colors truncate">
                        {item.propertyId?.name || "Căn trọ chưa xác thực"}
                      </h4>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                        item.packageType === "premium" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      }`}>
                        {item.packageType || "Basic"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] font-medium text-slate-400">
                      <span className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 text-slate-300" />
                        {item.propertyId?.address || "Hồ Chí Minh"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <User className="size-3.5 text-slate-300" />
                        Chủ: <span className="text-slate-600 font-bold">{item.landlordId?.name}</span>
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="mt-3 flex items-center gap-2">
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Trạng thái:</span>
                       <StatusPill status={item.status === 'completed' ? 'completed' : item.status === 'rejected' ? 'rejected' : item.status === 'approved' ? 'approved' : 'pending'} />
                    </div>
                  </div>

                  {/* Detailed Actions */}
                  <div className="flex items-center gap-3">
                    {item.status === "pending" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          const scheduledDate = window.prompt("Nhập ngày kiểm tra (YYYY-MM-DD):");
                          if (scheduledDate) {
                            onApprove(item._id, scheduledDate);
                          }
                        }}
                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-[11px] font-black shadow-lg shadow-blue-100 hover:opacity-90 transition-all flex items-center gap-2"
                      >
                        <Calendar className="size-3.5" /> Phân công
                      </motion.button>
                    )}
                    
                    {item.status === "approved" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onOpenInspect(item)}
                        className="px-5 py-2.5 bg-emerald-500 text-white rounded-2xl text-[11px] font-black shadow-lg shadow-emerald-100 hover:bg-emerald-600 transition-all flex items-center gap-2"
                      >
                         ✓ Hoàn thành
                      </motion.button>
                    )}

                    {item.status === "completed" ? (
                      <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-[11px] font-black flex items-center gap-2">
                        <ShieldCheck className="size-3.5" /> Đã xác thực
                      </div>
                    ) : (
                      <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition-all rounded-xl">
                        <Eye className="size-5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <ModernEmptyState 
              icon="🛡️" 
              title="Chưa có yêu cầu xác thực" 
              description="Khi chủ trọ đăng ký kiểm định căn hộ, yêu cầu sẽ hiện lên tại đây để bạn xử lý thực địa."
              color="blue"
            />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
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
      className={`px-6 py-2.5 rounded-2xl text-[12.5px] font-black border transition-all relative ${
        active
          ? "bg-emerald-50 border-emerald-100 text-emerald-600 shadow-sm"
          : "bg-white border-slate-100 text-slate-400 hover:border-emerald-100 hover:text-slate-600"
      }`}
    >
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {count && (
          <span
            className={`px-1.5 py-0.5 rounded-lg text-[9px] font-black ${
              variant === "amber"
                ? "bg-amber-100 text-amber-600"
                : variant === "red"
                  ? "bg-rose-100 text-rose-600"
                  : "bg-slate-100 text-slate-500"
            }`}
          >
            {count}
          </span>
        )}
      </span>
    </button>
  );
}

// Status Pill Component
function StatusPill({ status }: { status: string }) {
  const styles: any = {
    pending: { label: "Chờ duyệt", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
    approved: { label: "Đang hiển thị", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
    reported: { label: "Bị báo cáo", bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
    completed: { label: "Hoàn tất", bg: "bg-indigo-50", text: "text-indigo-600", dot: "bg-indigo-500" },
    rejected: { label: "Từ chối", bg: "bg-slate-50", text: "text-slate-600", dot: "bg-slate-400" },
  };

  const s = styles[status] || styles.pending;
  
  return (
    <div className={`px-2.5 py-1 rounded-full ${s.bg} ${s.text} text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5`}>
      <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </div>
  );
}

// Bookings View Component
function BookingsView({ bookings, onDeleteBooking }: { bookings: any[], onDeleteBooking: (id: string) => void }) {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h3 className="text-lg font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight uppercase">Lịch hẹn xem phòng</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Toàn bộ các lượt đặt lịch từ người dùng</p>
          </div>
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest px-3 py-1 bg-blue-50/80 rounded-lg border border-blue-100 shadow-sm shadow-blue-50">
            {bookings.length} GIAO DỊCH
          </div>
      </div>

      <AnimatePresence mode="popLayout">
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {bookings.map((b) => (
              <motion.div
                layout
                key={b._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden"
              >
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      <Home className="size-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-black text-[16px] text-slate-800 tracking-tight truncate max-w-[180px]">
                        {b.propertyId?.name || "Căn hộ"}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MapPin className="size-3 text-slate-300" />
                        <span className="text-[11px] text-slate-400 font-bold truncate max-w-[150px]">{b.propertyId?.address || "Hồ Chí Minh"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                    {b.status}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-6 mb-8 p-5 bg-slate-50/50 rounded-[24px] border border-slate-50">
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Khách thuê</span>
                      <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">
                            {(b.userId?.fullName || b.userId?.username || "A").substring(0,1).toUpperCase()}
                         </div>
                         <span className="text-xs font-black text-slate-700 truncate">{b.userId?.fullName || b.userId?.username || "Ẩn danh"}</span>
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Ngày hẹn</span>
                      <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                         <Calendar className="size-3.5 text-blue-500" />
                         {new Date(b.bookingDate).toLocaleDateString()}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                     <Clock className="size-3.5" />
                     {b.bookingTime}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDeleteBooking(b._id)} 
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl text-[11px] font-black transition-all border border-rose-100"
                  >
                    <Trash2 className="size-3.5" /> Huỷ lịch
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <ModernEmptyState 
            icon="📅" 
            title="Chưa có lịch hẹn" 
            description="Hiện tại hệ thống chưa ghi nhận lượt đặt lịch xem phòng nào từ khách hàng."
            color="amber"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Reviews View Component
function ReviewsView({ reviews, onDeleteReview }: { reviews: any[], onDeleteReview: (id: string) => void }) {
  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-4 px-2">
          <div>
            <h3 className="text-lg font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent tracking-tight uppercase">Cộng đồng đánh giá</h3>
            <p className="text-xs text-slate-400 font-bold mt-1">Quản lý các phản hồi và xếp hạng từ người dùng</p>
          </div>
          <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest px-3 py-1 bg-indigo-50/80 rounded-lg border border-indigo-100 shadow-sm shadow-indigo-50">
            {reviews.length} NHẬN XÉT
          </div>
      </div>

      <AnimatePresence mode="popLayout">
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
            {reviews.map((r) => (
              <motion.div
                layout
                key={r._id}
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all flex flex-col group relative"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-xl shadow-inner border border-white">
                      💬
                    </div>
                    <div>
                        <h4 className="font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent text-[15px] truncate max-w-[150px]">{r.propertyId?.name || "Tin đăng"}</h4>
                       <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] font-bold text-slate-400">bởi</span>
                          <span className="text-[11px] font-black text-indigo-600">{r.userId?.username || "Ẩn danh"}</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-xl border border-amber-100">
                     <Star className="size-3 text-amber-500 fill-amber-500" />
                     <span className="text-[11px] font-black text-amber-600">{r.rating}</span>
                  </div>
                </div>

                <div className="flex-1">
                   <div className="p-5 bg-slate-50/50 rounded-[24px] border border-slate-50 italic text-[13px] text-slate-600 font-medium leading-relaxed relative">
                      <div className="absolute -top-3 left-6 text-slate-200 text-4xl font-serif">"</div>
                      {r.comment || "Không có nội dung bình luận."}
                   </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                   <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                      ID: #{r._id.substring(r._id.length - 6).toUpperCase()}
                   </div>
                   <motion.button 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => onDeleteReview(r._id)} 
                     className="px-4 py-2 bg-white border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl text-[11px] font-black transition-all flex items-center gap-2"
                   >
                     <Trash2 className="size-3.5" /> Gỡ bỏ
                   </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <ModernEmptyState 
            icon="⭐" 
            title="Chưa có đánh giá nào" 
            description="Hãy chờ đợi những phản hồi đầu tiên từ người dùng sau khi họ trải nghiệm dịch vụ."
            color="indigo"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// --- NEW HELPER COMPONENTS ---

function MonthYearPicker({ selectedMonth, selectedYear, onSelect, onClose }: { selectedMonth: number, selectedYear: number, onSelect: (m: number, y: number) => void, onClose: () => void }) {
  const months = [
    "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
    "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
  ];
  const years = [2024, 2025, 2026];

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute top-12 right-0 w-80 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-5 z-50 backdrop-blur-xl"
      >
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 px-1">Chọn năm</div>
            <div className="flex gap-2">
              {years.map(y => (
                <button
                  key={y}
                  onClick={() => onSelect(selectedMonth, y)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedYear === y 
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 px-1">Chọn tháng</div>
            <div className="grid grid-cols-3 gap-2">
              {months.map((m, idx) => (
                <button
                  key={m}
                  onClick={() => onSelect(idx + 1, selectedYear)}
                  className={`py-2 rounded-xl text-[11px] font-bold transition-all ${
                    selectedMonth === idx + 1 
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" 
                      : "bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function NotificationTray({ notifications, onClose }: { notifications: any[], onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        className="absolute top-12 right-0 w-96 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden z-50 backdrop-blur-xl flex flex-col max-h-[500px]"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white/50 sticky top-0 backdrop-blur-md">
          <h3 className="text-sm font-black text-slate-800">Thông báo hệ thống</h3>
          <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-bold rounded-full">
            {notifications.length} mới
          </span>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar py-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div 
                key={n.id} 
                className="px-5 py-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 group cursor-pointer"
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shadow-sm group-hover:scale-110 transition-transform ${
                    n.type === 'user' ? 'bg-blue-50' : 
                    n.type === 'property' ? 'bg-emerald-50' : 
                    n.type === 'verification' ? 'bg-amber-50' : 'bg-indigo-50'
                  }`}>
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-black text-slate-800 mb-0.5">{n.title}</div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{n.message}</p>
                    <div className="text-[10px] text-slate-400 mt-2 font-medium">
                      {new Date(n.time).toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 italic text-sm">
              <Bell className="size-10 mb-3 opacity-20" />
              Không có thông báo mới
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-50/50 border-t border-slate-100">
          <button className="w-full py-2 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">
            Xem tất cả thông báo
          </button>
        </div>
      </motion.div>
    </>
  );
}
