import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Shield,
  Phone,
  User,
  TrendingUp,
  Star,
  ShieldCheck,
  Award,
  CreditCard,
  LayoutDashboard,
  Settings,
} from "lucide-react";

// Active tab type
type DashboardTab =
  | "overview"
  | "posts"
  | "subscription"
  | "verification"
  | "settings";

// Mock data - tin đăng của chủ trọ
const mockLandlordPosts: any[] = [];

export function LandlordDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { properties } = useProperties();
  const { getRequestsByLandlord } = useVerification();
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");

  // Filter properties by current landlord
  const landlordPosts = properties.filter(
    (p) => p.landlordId === user?.id || p.ownerName === user?.fullName || p.ownerName === user?.username || p.pinInfo,
  );

  // Get verification requests for this landlord
  const verificationRequests = getRequestsByLandlord(user?.id || "unknown");

  // Calculate stats from real data
  const stats = {
    totalPosts: landlordPosts.length,
    approvedPosts: landlordPosts.filter((p) => p.available).length,
    pendingPosts: 0, // Can add status field later
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
    const badge = badges[status];
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Home className="size-8 text-green-600" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">
                  MapHome - Chủ trọ
                </h1>
                <p className="text-xs text-gray-500">Quản lý tin đăng</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || user?.username}
              </p>
              <div className="flex items-center justify-end gap-2">
                <p className="text-xs text-gray-500">Chủ trọ</p>
                {user?.verificationLevel &&
                  getVerificationBadge(user.verificationLevel)}
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/")} size="sm">
              <Home className="size-4 mr-2" />
              Trang chủ
            </Button>
            <Button variant="destructive" onClick={handleLogout} size="sm">
              <LogOut className="size-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Xin chào, {user?.fullName || user?.username}! 👋
          </h2>
          <p className="text-gray-600">
            Quản lý và theo dõi các tin đăng cho thuê của bạn
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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

        {/* Action Bar */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Tin đăng của bạn</h3>
          <Button
            onClick={() => navigate("/post-room")}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <PlusCircle className="size-4 mr-2" />
            Đăng tin mới
          </Button>
        </div>

        {/* Verification Notice */}
        {user?.verificationLevel && user.verificationLevel < 3 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900 mb-1">
                  Nâng cấp xác thực để tăng độ tin cậy
                </h4>
                <p className="text-sm text-blue-800 mb-3">
                  Tài khoản của bạn đang ở cấp {user.verificationLevel}. Nâng
                  cấp lên cấp 3 để tin đăng được ưu tiên hiển thị và tăng độ tin
                  cậy với người thuê.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-blue-300 text-blue-700"
                >
                  Nâng cấp ngay
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Green Badge CTA */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl p-6 mb-6 text-white">
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
                  Admin đến kiểm tra thực tế • Tăng 50% lượt xem • Ưu tiên hiển
                  thị
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

        {/* Verification Requests Status */}
        {verificationRequests.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="size-5 text-orange-600" />
              Lịch hẹn kiểm tra của bạn
            </h4>
            <div className="space-y-3">
              {verificationRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {req.propertyName}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      📅{" "}
                      {new Date(req.scheduledDate).toLocaleDateString("vi-VN")}{" "}
                      • {req.scheduledTime}
                    </p>
                  </div>
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
              ))}
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-4">
          {landlordPosts.map((post) => {
            // Map verification level from property
            const getGreenBadgeLevelNumber = () => {
              if (post.verificationLevel === "verified") return 3;
              return 0;
            };

            const greenBadgeLevel = getGreenBadgeLevelNumber();
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
                      {post.pinInfo && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 flex items-center gap-1">
                          📌 Đã ghim GPS
                        </span>
                      )}
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
                    {status === "approved" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          alert(
                            `Chức năng sửa tin #${post.id} sẽ có trong phiên bản sau`,
                          )
                        }
                      >
                        <Edit className="size-4 mr-2" />
                        Sửa
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (
                          confirm(
                            `Bạn có chắc muốn xóa tin đăng "${post.name}"?`,
                          )
                        ) {
                          alert(`Chức năng xóa tin sẽ có trong phiên bản sau`);
                        }
                      }}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Xóa
                    </Button>
                  </div>
                </div>

                {/* Additional Info */}
                {post.pinInfo?.note && (
                  <div className="mt-4 bg-orange-50 border border-orange-100 rounded-lg p-3">
                    <p className="text-xs text-orange-800">
                      <span className="font-semibold">📝 Ghi chú vị trí:</span>{" "}
                      {post.pinInfo.note}
                    </p>
                  </div>
                )}

                {post.locationAccuracy && (
                  <div className="mt-2 bg-green-50 border border-green-100 rounded-lg p-3">
                    <p className="text-xs text-green-800">
                      <span className="font-semibold">
                        🛰️ Độ chính xác GPS:
                      </span>{" "}
                      ±{post.locationAccuracy}m
                    </p>
                  </div>
                )}
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
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <PlusCircle className="size-4 mr-2" />
              Đăng tin đầu tiên
            </Button>
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="size-6 text-green-600 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Mẹo để tin đăng của bạn được nhiều người quan tâm:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• Đăng ảnh rõ ràng, chất lượng cao về phòng trọ</li>
                <li>• Mô tả chi tiết về tiện ích và vị trí</li>
                <li>• Cập nhật giá cả chính xác, minh bạch</li>
                <li>• Nâng cấp xác thực lên cấp 3 để tăng độ tin cậy</li>
                <li>• Phản hồi nhanh chóng khi có người liên hệ</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

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
