import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckCircle,
  Settings,
  LogOut,
  MapPin,
  Calendar,
  Bell,
  ChevronRight,
} from "lucide-react";
import { RevenueView } from "./RevenueView";

/* ================= MOCK DATA ================= */

const mockPosts = [
  {
    id: 1,
    title: "Trọ Cao Cấp FPTU",
    owner: "NV",
    price: "3.5M",
    date: "22/02/2026",
    status: "pending",
  },
  {
    id: 2,
    title: "Phòng Làng ĐH",
    owner: "TT",
    price: "2.8M",
    date: "21/02/2026",
    status: "approved",
  },
  {
    id: 3,
    title: "Mini Studio",
    owner: "LM",
    price: "4.2M",
    date: "20/02/2026",
    status: "reported",
  },
];

const mockUsers = [
  {
    id: 1,
    name: "Lê Thị Hương",
    role: "landlord",
    phone: "0901 234 567",
    status: "active",
  },
  {
    id: 2,
    name: "Nguyễn Minh Khoa",
    role: "user",
    phone: "0912 345 678",
    status: "active",
  },
  {
    id: 3,
    name: "Trịnh Văn Cò",
    role: "landlord",
    phone: "0945 678 901",
    status: "blocked",
  },
];

const mockVerifications = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    location: "Q9",
    gpsPercent: 94,
    gpsDistance: "28m",
    gpsStatus: "success",
  },
  {
    id: 2,
    name: "Trần Thị Bảo",
    location: "Thủ Đức",
    gpsPercent: 38,
    gpsDistance: "2.1km",
    gpsStatus: "error",
  },
];

/* ================= MAIN COMPONENT ================= */

export function AdminPage() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col fixed h-screen">
        <div className="p-5 border-b flex items-center gap-2">
          <MapPin className="text-green-600" />
          <span className="font-bold">MapHome Admin</span>
        </div>

        <nav className="flex-1 p-3 space-y-2">
          <SidebarButton
            active={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
            icon={<LayoutDashboard size={16} />}
          >
            Dashboard
          </SidebarButton>
          <SidebarButton
            active={activeView === "posts"}
            onClick={() => setActiveView("posts")}
            icon={<FileText size={16} />}
          >
            Tin đăng
          </SidebarButton>
          <SidebarButton
            active={activeView === "users"}
            onClick={() => setActiveView("users")}
            icon={<Users size={16} />}
          >
            Người dùng
          </SidebarButton>
          <SidebarButton
            active={activeView === "verification"}
            onClick={() => setActiveView("verification")}
            icon={<CheckCircle size={16} />}
          >
            Tích Xanh
          </SidebarButton>
          <SidebarButton
            active={activeView === "revenue"}
            onClick={() => setActiveView("revenue")}
            icon={"📈"}
          >
            Doanh thu
          </SidebarButton>
          <SidebarButton icon={<Settings size={16} />}>Cài đặt</SidebarButton>
        </nav>

        <div className="p-3 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 text-sm"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-60">
        <header className="h-14 bg-white border-b px-6 flex justify-between items-center">
          <h2 className="font-bold capitalize">{activeView}</h2>
          <div className="flex gap-3 items-center">
            <Calendar size={18} />
            <Bell size={18} />
          </div>
        </header>

        <div className="p-6">
          {activeView === "dashboard" && <DashboardView />}
          {activeView === "posts" && <PostsView />}
          {activeView === "users" && <UsersView />}
          {activeView === "verification" && <VerificationView />}
          {activeView === "revenue" && <RevenueView />}
        </div>
      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarButton({ children, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded text-sm transition ${
        active
          ? "bg-green-100 text-green-600"
          : "hover:bg-gray-100 text-gray-600"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

/* ===== Dashboard ===== */

function DashboardView() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <KPICard label="Tổng tin" value="1,284" />
      <KPICard label="Người dùng" value="3,917" />
      <KPICard label="Tích xanh" value="247" />
      <KPICard label="Chờ xử lý" value="17" />
    </div>
  );
}

function KPICard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded border shadow-sm">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}

/* ===== POSTS ===== */

function PostsView() {
  return (
    <div className="bg-white rounded border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="p-3 text-left">Tin</th>
            <th className="p-3 text-left">Chủ</th>
            <th className="p-3 text-left">Giá</th>
            <th className="p-3 text-left">Ngày</th>
            <th className="p-3 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {mockPosts.map((post) => (
            <tr key={post.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{post.title}</td>
              <td className="p-3">{post.owner}</td>
              <td className="p-3">{post.price}</td>
              <td className="p-3">{post.date}</td>
              <td className="p-3">
                <StatusPill status={post.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== USERS ===== */

function UsersView() {
  return (
    <div className="bg-white rounded border overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100 text-xs uppercase text-gray-500">
          <tr>
            <th className="p-3 text-left">Tên</th>
            <th className="p-3 text-left">Vai trò</th>
            <th className="p-3 text-left">SĐT</th>
            <th className="p-3 text-left">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id} className="border-t hover:bg-gray-50">
              <td className="p-3">{user.name}</td>
              <td className="p-3">{user.role}</td>
              <td className="p-3">{user.phone}</td>
              <td className="p-3">
                {user.status === "active" ? "Hoạt động" : "Bị khóa"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== VERIFICATION ===== */

function VerificationView() {
  return (
    <div className="space-y-4">
      {mockVerifications.map((item) => (
        <div key={item.id} className="bg-white p-4 rounded border shadow-sm">
          <div className="flex justify-between mb-2">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-gray-500">{item.location}</div>
            </div>
            <div className="text-xs font-mono">
              {item.gpsPercent}% · {item.gpsDistance}
            </div>
          </div>

          <div className="h-2 bg-gray-200 rounded">
            <div
              className={`h-2 rounded ${
                item.gpsStatus === "success" ? "bg-green-500" : "bg-red-500"
              }`}
              style={{ width: `${item.gpsPercent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===== STATUS ===== */

function StatusPill({ status }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    approved: "bg-green-100 text-green-700",
    reported: "bg-red-100 text-red-700",
  };

  const labels = {
    pending: "Chờ duyệt",
    approved: "Hiển thị",
    reported: "Bị báo cáo",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-semibold ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
