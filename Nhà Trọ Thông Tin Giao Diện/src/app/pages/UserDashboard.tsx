import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Home,
  LogOut,
  Heart,
  Search,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Maximize,
  Phone,
  User,
  ChevronRight,
  Star,
  Trash2,
  Eye,
  Filter,
  X,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageCircle,
  Navigation,
} from "lucide-react";

type UserView = "favorites" | "search" | "appointments" | "book";

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<UserView>("favorites");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const [favRes, bookRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/me/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/user/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (favRes.ok) setFavorites(await favRes.json());
        if (bookRes.ok) setAppointments(await bookRes.json());
      } catch (err) {
        console.error("Failed to fetch user dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate, API_BASE]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Đang tải dữ liệu của bạn...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <Home className="size-8 text-green-600" />
              <div>
                <h1 className="font-bold text-xl text-gray-900">MapHome</h1>
                <p className="text-xs text-gray-500">Tài khoản của bạn</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || user?.username}
              </p>
              <p className="text-xs text-gray-500">Người dùng</p>
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
            Quản lý trọ yêu thích và lịch hẹn xem phòng của bạn
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Trọ yêu thích</p>
              <Heart className="size-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {favorites.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Lịch hẹn</p>
              <Calendar className="size-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {appointments.length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Chờ xác nhận</p>
              <Clock className="size-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">
              {appointments.filter((a) => a.status === "pending").length}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Đã xem</p>
              <CheckCircle className="size-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              {appointments.filter((a) => a.status === "completed").length}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <TabButton
            active={activeView === "favorites"}
            onClick={() => setActiveView("favorites")}
            icon={<Heart className="size-4" />}
          >
            Trọ yêu thích
          </TabButton>
          <TabButton
            active={activeView === "search"}
            onClick={() => setActiveView("search")}
            icon={<Search className="size-4" />}
          >
            Tìm kiếm nâng cao
          </TabButton>
          <TabButton
            active={activeView === "appointments"}
            onClick={() => setActiveView("appointments")}
            icon={<Calendar className="size-4" />}
          >
            Lịch hẹn của tôi
          </TabButton>
        </div>

        {/* Content Views */}
        {activeView === "favorites" && (
          <FavoritesView favorites={favorites} setFavorites={setFavorites} />
        )}
        {activeView === "search" && <SearchView />}
        {activeView === "appointments" && (
          <AppointmentsView
            appointments={appointments}
            setAppointments={setAppointments}
          />
        )}
      </main>
    </div>
  );
}

// Tab Button Component
function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg"
          : "bg-white text-gray-700 hover:bg-gray-50 shadow"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

// Favorites View Component
function FavoritesView({
  favorites,
  setFavorites,
}: {
  favorites: any[];
  setFavorites: (favorites: any[]) => void;
}) {
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const handleRemoveFavorite = async (propertyId: string) => {
    if (confirm("Bạn có chắc muốn xóa khỏi danh sách yêu thích?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/user/me/favorites/toggle`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}` 
          },
          body: JSON.stringify({ propertyId }),
        });
        
        if (res.ok) {
          setFavorites(favorites.filter((f) => f._id !== propertyId));
        }
      } catch (err) {
        console.error("Failed to untoggle favorite:", err);
      }
    }
  };

  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-12 text-center">
        <Heart className="size-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Chưa có trọ yêu thích nào
        </h3>
        <p className="text-gray-600 mb-6">
          Bắt đầu khám phá và lưu các căn trọ bạn thích
        </p>
        <Button
          onClick={() => navigate("/map")}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Search className="size-4 mr-2" />
          Tìm trọ ngay
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {favorites.length} căn trọ đã lưu
        </h3>
        <Button
          variant="outline"
          onClick={() => navigate("/map")}
          className="border-green-300 text-green-700"
        >
          <Search className="size-4 mr-2" />
          Tìm thêm trọ
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {favorites.map((property) => (
          <div
            key={property._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start gap-6">
              {/* Image */}
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0">
                <img 
                  src={property.image?.startsWith("http") ? property.image : `${API_BASE}${property.image || ""}`} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as any).src = "";
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {property.name}
                      {property.verificationLevel === "verified" && (
                        <span className="ml-2 text-green-600" title="Đã xác thực">✓</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        {property.address?.split(",")[0]}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="size-4" />
                        {property.area}m²
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        {property.rating?.toFixed(1) || "5.0"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {property.price?.toLocaleString("vi-VN")}đ
                    </div>
                    <div className="text-xs text-gray-500">/tháng</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{property.address}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {Object.entries(property.amenities || {}).map(([key, value], idx) => (
                    value && (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full capitalize"
                      >
                        {key}
                      </span>
                    )
                  ))}
                </div>

                {/* Contact & Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="size-4" />
                      {property.ownerName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="size-4" />
                      {property.phone}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-300 text-blue-700"
                      onClick={() => navigate(`/room/${property._id}`)}
                    >
                      <Calendar className="size-4 mr-2" />
                      Đặt lịch xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                      onClick={() => navigate(`/room/${property._id}`)}
                    >
                      <Eye className="size-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFavorite(property._id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Search View Component
function SearchView() {
  const [searchParams, setSearchParams] = useState({
    keyword: "",
    district: "",
    priceMin: "",
    priceMax: "",
    areaMin: "",
    areaMax: "",
    amenities: [] as string[],
    verified: false,
  });

  const amenitiesList = [
    "Wifi",
    "Điều hòa",
    "Máy giặt",
    "Bếp",
    "WC riêng",
    "Ban công",
    "Gác lửng",
    "Chỗ để xe",
  ];

  const districts = [
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Thủ Đức",
    "Bình Thạnh",
    "Tân Bình",
    "Phú Nhuận",
    "Gò Vấp",
  ];

  const toggleAmenity = (amenity: string) => {
    setSearchParams({
      ...searchParams,
      amenities: searchParams.amenities.includes(amenity)
        ? searchParams.amenities.filter((a) => a !== amenity)
        : [...searchParams.amenities, amenity],
    });
  };

  const navigate = useNavigate();

  const handleSearch = () => {
    navigate("/map");
  };

  const handleReset = () => {
    setSearchParams({
      keyword: "",
      district: "",
      priceMin: "",
      priceMax: "",
      areaMin: "",
      areaMax: "",
      amenities: [],
      verified: false,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Tìm kiếm nâng cao</h3>
        <Button variant="outline" onClick={handleReset} size="sm">
          <X className="size-4 mr-2" />
          Đặt lại
        </Button>
      </div>

      <div className="space-y-6">
        {/* Keyword Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Từ khóa
          </label>
          <Input
            type="text"
            value={searchParams.keyword}
            onChange={(e) =>
              setSearchParams({ ...searchParams, keyword: e.target.value })
            }
            placeholder="Tên phòng trọ, địa chỉ..."
            className="w-full"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khu vực
          </label>
          <select
            value={searchParams.district}
            onChange={(e) =>
              setSearchParams({ ...searchParams, district: e.target.value })
            }
            className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">Tất cả quận/huyện</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khoảng giá (triệu đồng/tháng)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              value={searchParams.priceMin}
              onChange={(e) =>
                setSearchParams({ ...searchParams, priceMin: e.target.value })
              }
              placeholder="Từ"
            />
            <Input
              type="number"
              value={searchParams.priceMax}
              onChange={(e) =>
                setSearchParams({ ...searchParams, priceMax: e.target.value })
              }
              placeholder="Đến"
            />
          </div>
        </div>

        {/* Area Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diện tích (m²)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              value={searchParams.areaMin}
              onChange={(e) =>
                setSearchParams({ ...searchParams, areaMin: e.target.value })
              }
              placeholder="Từ"
            />
            <Input
              type="number"
              value={searchParams.areaMax}
              onChange={(e) =>
                setSearchParams({ ...searchParams, areaMax: e.target.value })
              }
              placeholder="Đến"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tiện ích
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {amenitiesList.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  searchParams.amenities.includes(amenity)
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-white border-gray-300 text-gray-700 hover:border-green-300"
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Verified Only */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="verified"
            checked={searchParams.verified}
            onChange={(e) =>
              setSearchParams({ ...searchParams, verified: e.target.checked })
            }
            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label
            htmlFor="verified"
            className="text-sm font-medium text-gray-700"
          >
            Chỉ hiển thị trọ đã xác thực
          </label>
        </div>

        {/* Search Button */}
        <div className="flex items-center gap-3 pt-4 border-t">
          <Button
            onClick={handleSearch}
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Search className="size-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button variant="outline" className="border-gray-300">
            <Navigation className="size-4 mr-2" />
            Xem trên bản đồ
          </Button>
        </div>
      </div>
    </div>
  );
}

// Appointments View Component
function AppointmentsView({
  appointments,
  setAppointments,
}: {
  appointments: any[];
  setAppointments: (appointments: any[]) => void;
}) {
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const handleCancelAppointment = async (id: string) => {
    if (confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (res.ok) {
          setAppointments(
            appointments.map((a) =>
              a._id === id ? { ...a, status: "cancelled" } : a,
            ),
          );
        }
      } catch (err) {
        console.error("Failed to cancel booking:", err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        label: "Chờ xác nhận",
        color: "bg-orange-100 text-orange-800",
        icon: Clock,
      },
      confirmed: {
        label: "Đã xác nhận",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      completed: {
        label: "Đã hoàn thành",
        color: "bg-blue-100 text-blue-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
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

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Tất cả ({appointments.length})
          </FilterButton>
          <FilterButton
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          >
            Chờ xác nhận (
            {appointments.filter((a) => a.status === "pending").length})
          </FilterButton>
          <FilterButton
            active={filter === "confirmed"}
            onClick={() => setFilter("confirmed")}
          >
            Đã xác nhận (
            {appointments.filter((a) => a.status === "confirmed").length})
          </FilterButton>
          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          >
            Đã hoàn thành (
            {appointments.filter((a) => a.status === "completed").length})
          </FilterButton>
          <FilterButton
            active={filter === "cancelled"}
            onClick={() => setFilter("cancelled")}
          >
            Đã hủy (
            {appointments.filter((a) => a.status === "cancelled").length})
          </FilterButton>
        </div>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <Calendar className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có lịch hẹn nào
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "Bạn chưa đặt lịch hẹn xem trọ nào"
              : `Không có lịch hẹn ${
                  filter === "pending"
                    ? "chờ xác nhận"
                    : filter === "confirmed"
                      ? "đã xác nhận"
                      : filter === "completed"
                        ? "đã hoàn thành"
                        : "đã hủy"
                }`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-6">
                {/* Property Image */}
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={appointment.propertyId?.image?.startsWith("http") ? appointment.propertyId?.image : `${API_BASE}${appointment.propertyId?.image || ""}`}
                    alt={appointment.propertyId?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400";
                    }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {appointment.propertyId?.name || "Căn trọ cũ"}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="size-4" />
                        {appointment.propertyId?.address?.split(",")[0] || "Hồ Chí Minh"}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ngày hẹn</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar className="size-4" />
                        {new Date(appointment.bookingDate).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Giờ hẹn</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="size-4" />
                        {appointment.bookingTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chủ trọ</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <User className="size-4" />
                        {appointment.landlordId?.fullName || appointment.landlordId?.username || "Chủ trọ"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Liên hệ</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="size-4" />
                        {appointment.phone || appointment.landlordId?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Ghi chú:</p>
                      <p className="text-sm text-gray-700">
                        {appointment.notes}
                      </p>
                    </div>
                  )}
                  
                  {appointment.status === "pending" && (
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleCancelAppointment(appointment._id)}
                      >
                        <XCircle className="size-4 mr-2" />
                        Hủy lịch hẹn
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Filter Button Component
function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
        active
          ? "bg-gradient-to-r from-green-600 to-blue-600 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
}
