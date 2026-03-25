import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/app/contexts/AuthContext";
import { useProperties } from "@/app/contexts/PropertiesContext";
import { useVerification } from "@/app/contexts/VerificationContext";
import { Button } from "@/app/components/ui/button";
import { RequestVerificationDialog } from "@/app/components/RequestVerificationDialog";
import { SubscriptionManagement } from "@/app/components/SubscriptionManagement";
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
  { id: "subscription", label: "Gói đăng ký", icon: CreditCard },
  { id: "verification", label: "Yêu cầu xác thực", icon: ShieldCheck },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export function LandlordDashboardV2() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, isAuthenticated } = useAuth();
  const { properties } = useProperties();
  const { getRequestsByLandlord } = useVerification();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);

  // Get active tab from URL params, default to 'overview'
  const activeTab = (searchParams.get("tab") as DashboardTab) || "overview";

  // Filter properties by current landlord
  const landlordPosts = properties.filter(
    (p) => p.landlordId === user?.id || p.ownerName === user?.fullName || p.ownerName === user?.username || p.pinInfo,
  );

  // Get verification requests
  const verificationRequests = getRequestsByLandlord(user?.id || "unknown");

  // Calculate stats
  const stats = {
    totalPosts: landlordPosts.length,
    approvedPosts: landlordPosts.filter((p) => p.available).length,
    pendingPosts: 0,
    totalViews: landlordPosts.reduce((sum, p) => sum + (p.views || 0), 0),
    totalFavorites: landlordPosts.reduce(
      (sum, p) => sum + (p.favorites || 0),
      0,
    ),
  };

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "landlord") {
      navigate("/login");
    }
  }, [isAuthenticated, user, navigate]);

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
                      key={req.id}
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

      case "settings":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt</h2>
              <p className="text-gray-600">
                Quản lý thông tin tài khoản và cài đặt
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600">Tính năng đang phát triển...</p>
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
                        <Button variant="outline" size="sm">
                          <Edit className="size-4 mr-2" />
                          Sửa
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            if (
                              window.confirm(
                                `Bạn có chắc muốn xóa tin đăng "${post.name}"?`,
                              )
                            ) {
                              window.alert(
                                "Chức năng xóa tin sẽ có trong phiên bản sau",
                              );
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
        <main className="max-w-6xl mx-auto px-8 py-8">{renderContent()}</main>
      </div>

      {/* Verification Request Dialog */}
      <RequestVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        landlordId={user?.id || "unknown"}
        landlordName={user?.fullName || user?.username || "Chủ trọ"}
        landlordPhone={user?.phone || "0123456789"}
      />
    </div>
  );
}
