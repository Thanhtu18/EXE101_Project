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
  | "revenue"
  | "inspections";

// Mock data
const mockStats = {
  totalPosts: 0,
  newThisMonth: 0,
  totalUsers: 0,
  newUsers: 0,
  verifiedBadges: 0,
  newBadges: 0,
  pending: 0,
};

const weeklySearchData: any[] = [];

const recentActivities: any[] = [];

const topRooms: any[] = [];

const mockPosts: any[] = [];

const mockUsers: any[] = [];

const mockVerifications: any[] = [];

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
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
                12
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
                5
              </span>
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
                {user?.fullName || "Lý Hoàng Thành"}
              </div>
              <div className="text-[10px] text-[#94a3b8]">
                Super Admin · CEO
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
            {activeView === "revenue" && "Doanh Thu"}
            {activeView === "inspections" && "Kiểm tra thực địa"}
          </h2>
          <div className="flex items-center gap-3">
            <button className="px-3.5 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-xs font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <Calendar className="size-4" />
              Tháng 2, 2026
            </button>
            <button className="relative px-3.5 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg hover:bg-gray-50 transition-colors">
              <Bell className="size-4 text-gray-600" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "posts" && <PostsView />}
          {activeView === "users" && <UsersView />}
          {activeView === "verification" && <VerificationView />}
          {activeView === "revenue" && <RevenueView />}
          {activeView === "inspections" && <InspectionsView />}
        </div>
      </main>
    </div>
  );
}

// Dashboard View Component
function DashboardView() {
  return (
    <div className="space-y-3.5">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        <KPICard
          icon="🏘️"
          iconBg="#dcfce7"
          label="Tổng tin đăng"
          value="1,284"
          change="+38 so tháng trước"
          changePositive
          topGradient="linear-gradient(90deg, #16a34a, #22c55e)"
        />
        <KPICard
          icon="👥"
          iconBg="#dbeafe"
          label="Người dùng"
          value="3,917"
          change="+124 người dùng mới"
          changePositive
          topGradient="linear-gradient(90deg, #2563eb, #0ea5e9)"
        />
        <KPICard
          icon="✅"
          iconBg="#fef3c7"
          label="Tích Xanh đã cấp"
          value="247"
          change="+12 trong tuần này"
          changePositive
          topGradient="linear-gradient(90deg, #d97706, #f59e0b)"
        />
        <KPICard
          icon="⚠️"
          iconBg="#fee2e2"
          label="Chờ xử lý"
          value="17"
          change="Cần duyệt ngay"
          changeNegative
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
              Tổng tuần: <strong className="text-[#0f172a]">14,820</strong>
            </span>
            <span className="text-[#94a3b8]">
              Cao nhất: <strong className="text-[#16a34a]">Thứ Sáu</strong>
            </span>
            <span className="text-[#94a3b8]">
              Khu vực hot:{" "}
              <strong className="text-[#d97706]">Q9·Làng ĐH</strong>
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
                  strokeDasharray="63 100"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3.5"
                  strokeDasharray="24 100"
                  strokeDashoffset="-63"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#dc2626"
                  strokeWidth="3.5"
                  strokeDasharray="13 100"
                  strokeDashoffset="-87"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[13px] font-bold">
                1,284
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                <span className="text-xs text-[#475569]">Đang hiển thị</span>
                <span className="ml-auto text-xs font-bold text-[#0f172a]">
                  63%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#d97706]" />
                <span className="text-xs text-[#475569]">Chờ duyệt</span>
                <span className="ml-auto text-xs font-bold text-[#0f172a]">
                  24%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#dc2626]" />
                <span className="text-xs text-[#475569]">Bị báo cáo</span>
                <span className="ml-auto text-xs font-bold text-[#0f172a]">
                  13%
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
function PostsView() {
  const [activeTab, setActiveTab] = useState<
    "all" | "pending" | "reported" | "approved"
  >("all");

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#94a3b8]">Duyệt, ẩn và xử lý vi phạm</p>

      {/* Tab Bar */}
      <div className="flex items-center gap-2">
        <TabButton
          active={activeTab === "all"}
          onClick={() => setActiveTab("all")}
          count="1,284"
        >
          Tất cả
        </TabButton>
        <TabButton
          active={activeTab === "pending"}
          onClick={() => setActiveTab("pending")}
          count="12"
          variant="amber"
        >
          Chờ duyệt
        </TabButton>
        <TabButton
          active={activeTab === "reported"}
          onClick={() => setActiveTab("reported")}
          count="5"
          variant="red"
        >
          Bị báo cáo
        </TabButton>
        <TabButton
          active={activeTab === "approved"}
          onClick={() => setActiveTab("approved")}
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
            {mockPosts.map((post) => (
              <tr
                key={post.id}
                className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-8 rounded-lg bg-[#dcfce7] flex items-center justify-center text-sm">
                      {post.emoji}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#0f172a]">
                        {post.title}
                      </div>
                      <div className="text-[11px] text-[#94a3b8]">
                        📍 {post.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full ${post.ownerColor} text-white text-xs font-bold flex items-center justify-center`}
                    >
                      {post.owner}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="text-sm font-bold text-[#16a34a]">
                    {post.price}
                  </span>
                  <span className="text-[11px] text-[#94a3b8]">/th</span>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">
                  {post.date}
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={post.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {post.status === "pending" && (
                      <>
                        <button className="px-2.5 py-1 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] rounded-lg text-[11px] font-semibold hover:bg-[#bbf7d0]">
                          Duyệt
                        </button>
                        <button className="px-2.5 py-1 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]">
                          Từ chối
                        </button>
                      </>
                    )}
                    {post.status === "approved" && (
                      <button className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]">
                        Ẩn tin
                      </button>
                    )}
                    {post.status === "reported" && (
                      <>
                        <button className="px-2.5 py-1 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]">
                          Giữ tin
                        </button>
                        <button className="px-2.5 py-1 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]">
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
function UsersView() {
  return (
    <div className="space-y-4">
      {/* Stat Mini Cards */}
      <div className="grid grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Tổng người dùng</div>
          <div className="text-[22px] font-[800] text-[#0f172a]">3,917</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Chủ trọ</div>
          <div className="text-[22px] font-[800] text-[#d97706]">842</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Người thuê</div>
          <div className="text-[22px] font-[800] text-[#2563eb]">3,075</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-sm">
          <div className="text-[11px] text-[#94a3b8] mb-2">Bị khoá</div>
          <div className="text-[22px] font-[800] text-[#dc2626]">14</div>
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
            {mockUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-[#e2e8f0] hover:bg-[#f8fafc]"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-full ${user.avatarColor} text-white text-xs font-bold flex items-center justify-center`}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <div className="text-[12.5px] font-semibold text-[#0f172a]">
                        {user.name}
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
                    {user.role === "landlord" ? "Chủ trọ" : "Người thuê"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">
                  {user.phone}
                </td>
                <td className="px-4 py-3 text-xs text-[#475569]">
                  {user.joinDate}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs ${
                      user.status === "blocked"
                        ? "text-[#dc2626]"
                        : "text-[#16a34a]"
                    }`}
                  >
                    {user.activity}
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
                      <button className="px-2.5 py-1 bg-[#dcfce7] border border-[#bbf7d0] text-[#16a34a] rounded-lg text-[11px] font-semibold hover:bg-[#bbf7d0]">
                        Mở khoá
                      </button>
                    ) : (
                      <button className="px-2.5 py-1 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]">
                        Khoá
                      </button>
                    )}
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
function VerificationView() {
  const navigate = useNavigate();
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    landlordName: "",
    landlordPhone: "",
    propertyName: "",
    propertyAddress: "",
    district: "",
    roomCount: "",
    scheduledDate: "",
    scheduledTime: "09:00",
    inspectionType: "standard",
    notes: "",
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate ALL required fields in JS (không dựa hoàn toàn vào HTML5 native validation)
    const errors: string[] = [];
    if (!scheduleData.landlordName.trim()) errors.push("Họ tên chủ trọ");
    if (!scheduleData.landlordPhone.trim()) errors.push("Số điện thoại");
    if (!scheduleData.propertyName.trim()) errors.push("Tên căn trọ");
    if (!scheduleData.propertyAddress.trim()) errors.push("Địa chỉ căn trọ");
    if (!scheduleData.scheduledDate) errors.push("Ngày kiểm tra");

    if (errors.length > 0) {
      alert(
        `Vui lòng điền đầy đủ thông tin bắt buộc:\n• ${errors.join("\n• ")}`,
      );
      return;
    }

    const checkoutPayload = {
      type: "inspection",
      inspectionData: scheduleData,
      amount: 199000,
    };

    // Backup vào sessionStorage để tránh mất state do môi trường iframe/sandbox
    try {
      sessionStorage.setItem(
        "inspectionCheckoutData",
        JSON.stringify(checkoutPayload),
      );
    } catch (_) {}

    navigate("/checkout", { state: checkoutPayload });
  };

  return (
    <div className="space-y-4">
      {/* Pipeline */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#d97706] mb-1">5</div>
          <div className="text-[10px] text-[#94a3b8]">Yêu cầu mới</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#2563eb] mb-1">3</div>
          <div className="text-[10px] text-[#94a3b8]">Đang xử lý</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#94a3b8] mb-1">2</div>
          <div className="text-[10px] text-[#94a3b8]">Chờ thực địa</div>
        </div>
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-[#16a34a] mb-1">247</div>
          <div className="text-[10px] text-[#94a3b8]">Đã cấp ✅</div>
        </div>
      </div>

      {/* Schedule Inspection CTA */}
      {!showScheduleForm && (
        <div className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                <ShieldCheck className="size-7 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">
                  Đặt lịch kiểm tra ngay
                </h3>
                <p className="text-blue-100 text-sm">
                  Xác thực thực địa để cấp Tích Xanh cho chủ trọ
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-white/70 text-xs">Chi phí mỗi lần</div>
                <div className="text-white font-bold text-2xl">199.000đ</div>
              </div>
              <button
                onClick={() => setShowScheduleForm(true)}
                className="px-6 py-3 bg-white text-[#2563eb] rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
              >
                <Calendar className="size-4 inline mr-2" />
                Đặt lịch ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Inspection Form */}
      {showScheduleForm && (
        <div className="bg-white rounded-xl border-2 border-[#2563eb] shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="size-6 text-white" />
                <div>
                  <h3 className="text-white font-bold text-base">
                    Đặt lịch kiểm tra thực địa
                  </h3>
                  <p className="text-blue-100 text-xs">
                    Phí: 199.000đ / 1 lần kiểm tra
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleForm(false)}
                className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <XCircle className="size-5" />
              </button>
            </div>
          </div>

          {/* Form Body */}
          <form
            onSubmit={handleScheduleSubmit}
            className="p-6 space-y-5"
            noValidate
          >
            {/* Row 1: Thông tin chủ trọ */}
            <div>
              <div className="text-xs font-bold uppercase text-[#94a3b8] mb-3 flex items-center gap-1.5">
                <Users className="size-3.5" />
                Thông tin chủ trọ
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Họ tên chủ trọ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={scheduleData.landlordName}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        landlordName: e.target.value,
                      })
                    }
                    placeholder="VD: Nguyễn Văn An"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={scheduleData.landlordPhone}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        landlordPhone: e.target.value,
                      })
                    }
                    placeholder="VD: 0901 234 567"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Thông tin căn trọ */}
            <div>
              <div className="text-xs font-bold uppercase text-[#94a3b8] mb-3 flex items-center gap-1.5">
                <Home className="size-3.5" />
                Thông tin căn trọ
              </div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Tên căn trọ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={scheduleData.propertyName}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        propertyName: e.target.value,
                      })
                    }
                    placeholder="VD: Trọ Cao Cấp FPTU"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Số phòng
                  </label>
                  <input
                    type="number"
                    value={scheduleData.roomCount}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        roomCount: e.target.value,
                      })
                    }
                    placeholder="VD: 12"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Địa chỉ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={scheduleData.propertyAddress}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        propertyAddress: e.target.value,
                      })
                    }
                    placeholder="VD: 123 Đường Lê Văn Việt, P. Hiệp Phú"
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Quận/Huyện
                  </label>
                  <select
                    value={scheduleData.district}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        district: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="Q9">TP. Thủ Đức (Q9)</option>
                    <option value="Thủ Đức">Thủ Đức</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                    <option value="Gò Vấp">Gò Vấp</option>
                    <option value="Tân Bình">Tân Bình</option>
                    <option value="Q12">Quận 12</option>
                    <option value="Bình Dương">Bình Dương</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Row 3: Lịch hẹn */}
            <div>
              <div className="text-xs font-bold uppercase text-[#94a3b8] mb-3 flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Lịch hẹn kiểm tra
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Ngày kiểm tra <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={scheduleData.scheduledDate}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        scheduledDate: e.target.value,
                      })
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Khung giờ <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={scheduleData.scheduledTime}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        scheduledTime: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                    required
                  >
                    <option value="08:00">08:00 - 09:00</option>
                    <option value="09:00">09:00 - 10:00</option>
                    <option value="10:00">10:00 - 11:00</option>
                    <option value="13:00">13:00 - 14:00</option>
                    <option value="14:00">14:00 - 15:00</option>
                    <option value="15:00">15:00 - 16:00</option>
                    <option value="16:00">16:00 - 17:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                    Loại kiểm tra
                  </label>
                  <select
                    value={scheduleData.inspectionType}
                    onChange={(e) =>
                      setScheduleData({
                        ...scheduleData,
                        inspectionType: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none"
                  >
                    <option value="standard">Kiểm tra tiêu chuẩn</option>
                    <option value="detailed">Kiểm tra chi tiết</option>
                    <option value="urgent">Kiểm tra khẩn cấp</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Ghi chú */}
            <div>
              <label className="block text-xs font-semibold text-[#475569] mb-1.5">
                Ghi chú thêm (tùy chọn)
              </label>
              <textarea
                value={scheduleData.notes}
                onChange={(e) =>
                  setScheduleData({ ...scheduleData, notes: e.target.value })
                }
                placeholder="VD: Hẹn tại cổng chính, gọi trước 15 phút, cần kiểm tra kỹ hệ thống PCCC..."
                className="w-full min-h-[70px] px-3 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg text-sm focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb] focus:outline-none resize-none"
              />
            </div>

            {/* Summary & Price */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#2563eb] flex items-center justify-center">
                    <ShieldCheck className="size-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0f172a]">
                      Phí kiểm tra thực địa
                    </div>
                    <div className="text-[11px] text-[#94a3b8]">
                      1 lần kiểm tra - Bao gồm báo cáo chi tiết
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#2563eb]">
                    199.000đ
                  </div>
                  <div className="text-[10px] text-[#94a3b8]">
                    Đã bao gồm VAT
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px]">
                <div className="bg-white/70 rounded-lg p-2.5 text-center border border-blue-100">
                  <div className="text-blue-600 mb-0.5">📍</div>
                  <div className="font-semibold text-[#0f172a]">
                    Xác thực GPS
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5 text-center border border-blue-100">
                  <div className="text-blue-600 mb-0.5">📸</div>
                  <div className="font-semibold text-[#0f172a]">
                    Chụp ảnh thực tế
                  </div>
                </div>
                <div className="bg-white/70 rounded-lg p-2.5 text-center border border-blue-100">
                  <div className="text-blue-600 mb-0.5">📋</div>
                  <div className="font-semibold text-[#0f172a]">
                    Báo cáo đánh giá
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleForm(false)}
                className="flex-1 h-11 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-xl text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-[2] h-11 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="size-4" />
                Tiếp tục thanh toán — 199.000đ
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Verification Cards */}
      <div className="space-y-2.5">
        {mockVerifications.map((item) => (
          <div
            key={item.id}
            className={`bg-white rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 ${
              item.warning
                ? "border-[#fecaca]"
                : item.needsInspection
                  ? "border-[#bae6fd]"
                  : "border-[#e2e8f0]"
            }`}
          >
            {/* Icon */}
            <div
              className={`w-[46px] h-[46px] rounded-[10px] flex items-center justify-center text-xl flex-shrink-0 ${
                item.warning
                  ? "bg-[#fee2e2]"
                  : item.needsInspection
                    ? "bg-[#dbeafe]"
                    : "bg-[#dcfce7]"
              }`}
            >
              {item.icon}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13.5px] font-bold text-[#0f172a]">
                  {item.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    item.packageColor === "amber"
                      ? "bg-[#fef3c7] text-[#d97706]"
                      : item.packageColor === "green"
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : item.packageColor === "red"
                          ? "bg-[#fee2e2] text-[#dc2626]"
                          : "bg-[#dbeafe] text-[#0ea5e9]"
                  }`}
                >
                  {item.package}
                </span>
              </div>
              <div className="text-[11.5px] text-[#94a3b8] mb-2">
                📍 {item.location} • {item.rooms} phòng • {item.photos} ảnh
                {item.video && " + 1 video"}
                {item.video360 && " 360°"}
                {!item.video && item.photos < 10 && " (thiếu video)"}
              </div>
              {/* GPS Progress */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-[#475569]">
                  GPS:
                </span>
                <div className="flex-1 h-[5px] bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.gpsStatus === "success"
                        ? "bg-[#16a34a]"
                        : item.gpsStatus === "error"
                          ? "bg-[#dc2626]"
                          : "bg-[#0ea5e9]"
                    }`}
                    style={{ width: `${item.gpsPercent}%` }}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold font-mono ${
                    item.gpsStatus === "success"
                      ? "text-[#16a34a]"
                      : item.gpsStatus === "error"
                        ? "text-[#dc2626]"
                        : "text-[#0ea5e9]"
                  }`}
                >
                  {item.gpsPercent}% · {item.gpsDistance}{" "}
                  {item.gpsStatus === "success"
                    ? "✓"
                    : item.gpsStatus === "error"
                      ? "✗"
                      : "~"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1.5">
              {item.needsInspection ? (
                <button className="px-4 py-2 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] text-white rounded-lg text-xs font-bold hover:opacity-90">
                  📍 Phân công thực địa
                </button>
              ) : item.warning ? (
                <>
                  <button className="px-4 py-2 bg-[#fef3c7] border border-[#fde68a] text-[#d97706] rounded-lg text-[11px] font-semibold hover:bg-[#fde68a]">
                    📋 Yêu cầu bổ sung
                  </button>
                  <button className="px-4 py-2 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]">
                    ✕ Từ chối
                  </button>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white rounded-lg text-xs font-bold hover:opacity-90">
                    ✅ Cấp Tích Xanh
                  </button>
                  <button className="px-4 py-2 bg-[#fee2e2] border border-[#fecaca] text-[#dc2626] rounded-lg text-[11px] font-semibold hover:bg-[#fecaca]">
                    ✕ Từ chối
                  </button>
                </>
              )}
              <button className="px-4 py-2 bg-[#f8fafc] border border-[#e2e8f0] text-[#475569] rounded-lg text-[11px] font-semibold hover:bg-[#e2e8f0]">
                👁 Xem hồ sơ
              </button>
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
