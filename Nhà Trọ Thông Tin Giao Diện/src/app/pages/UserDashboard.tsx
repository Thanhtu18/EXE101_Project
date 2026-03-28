import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  ShieldCheck,
  Settings,
  Camera,
  Upload,
} from "lucide-react";
import { toast } from "sonner";


// Define available views for the user dashboard
type UserView = "favorites" | "search" | "appointments" | "inspections" | "book" | "settings";


export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<UserView>("favorites");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);


  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        const [favRes, bookRes, inspRes] = await Promise.all([
          fetch(`${API_BASE}/api/user/me/favorites`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/user/bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_BASE}/api/user/inspections`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (favRes.ok) setFavorites(await favRes.json());
        if (bookRes.ok) setAppointments(await bookRes.json());
        if (inspRes.ok) setInspections(await inspRes.json());

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
      <header className="bg-white/70 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.05)] border-b border-white/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Home className="size-6" />
              </div>
              <div>
                <h1 className="font-bold text-xl text-gray-900 tracking-tight">MapHome</h1>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">User Console</p>
              </div>
            </div>
          </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                    {user?.fullName || user?.username}
                  </p>
                  <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter bg-green-50 px-2 py-0.5 rounded-full inline-block">
                    Standard Member
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (user?.fullName || user?.username || "U").charAt(0).toUpperCase()
                  )}
                </div>
              </div>
              <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-4" />
              <Button variant="ghost" onClick={handleLogout} size="sm" className="text-gray-500 hover:text-red-600 transition-colors rounded-full px-4">
              <LogOut className="size-4 mr-2" />
              Đăng xuất
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 py-8"
      >
        {/* Welcome Section */}
        <div className="mb-10 text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-4xl font-black text-gray-900 mb-3 tracking-tight"
          >
            Xin chào, {user?.fullName || user?.username}! 👋
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 text-lg font-medium"
          >
            Nơi quản lý hành trình tìm kiếm ngôi nhà mơ ước của bạn
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            { label: "Trọ yêu thích", value: favorites.length, icon: Heart, color: "text-red-500", bg: "bg-red-50" },
            { label: "Lịch hẹn", value: appointments.length, icon: Calendar, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "Chờ xác nhận", value: appointments.filter((a) => a.status === "pending").length, icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
            { label: "Đã hoàn thành", value: appointments.filter((a) => a.status === "completed").length, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="bg-white/60 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="size-5" />
                </div>
              </div>
              <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-none">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar">
          {[
            { id: "favorites", label: "Trọ yêu thích", icon: Heart },
            { id: "search", label: "Tìm kiếm thông minh", icon: Search },
            { id: "appointments", label: "Lịch hẹn của tôi", icon: Calendar },
            { id: "inspections", label: "Yêu cầu kiểm tra", icon: ShieldCheck },
            { id: "settings", label: "Cài đặt", icon: Settings },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView(tab.id as UserView)}
              className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm ${
                activeView === tab.id
                  ? "bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg shadow-green-500/20"
                  : "bg-white text-gray-500 hover:text-gray-900 border border-gray-100"
              }`}
            >
              <tab.icon className="size-4" />
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Views */}
        {activeView === "favorites" && (
          <FavoritesView favorites={favorites} setFavorites={setFavorites} />
        )}
        {activeView === "search" && <SearchView />}
        {activeView === "appointments"}
        {activeView === "appointments" && (
          <AppointmentsView
            appointments={appointments}
            setAppointments={setAppointments}
          />
        )}
        {activeView === "inspections" && (
          <InspectionsView
            inspections={inspections}
            setInspections={setInspections}
          />
        )}
        {activeView === "settings" && <SettingsView />}

      </motion.main>
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
          toast.success("Đã xóa khỏi danh sách yêu thích! ✨");
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
          toast.success("Đã hủy lịch hẹn thành công! ✅");
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

// Inspections View Component
function InspectionsView({
  inspections,
  setInspections,
}: {
  inspections: any[];
  setInspections: (inspections: any[]) => void;
}) {
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const [filter, setFilter] = useState<"all" | "pending" | "completed" | "cancelled">("all");

  const filteredInspections =
    filter === "all"
      ? inspections
      : inspections.filter((i) => i.status === filter);

  const handleCancelInspection = async (id: string) => {
    if (confirm("Bạn có chắc muốn hủy yêu cầu kiểm tra này?")) {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/inspections/${id}/cancel`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          setInspections(
            inspections.map((i) =>
              i._id === id ? { ...i, status: "cancelled" } : i,
            ),
          );
          toast.success("Đã hủy yêu cầu kiểm tra! 🛡️");
        }
      } catch (err) {
        console.error("Failed to cancel inspection:", err);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: {
        label: "Đang chờ",
        color: "bg-orange-100 text-orange-800",
        icon: Clock,
      },
      completed: {
        label: "Đã hoàn thành",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Đã hủy",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
    };
    const badge = badges[status as keyof typeof badges] || badges.pending;
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
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>
            Tất cả ({inspections.length})
          </FilterButton>
          <FilterButton active={filter === "pending"} onClick={() => setFilter("pending")}>
            Đang chờ ({inspections.filter((i) => i.status === "pending").length})
          </FilterButton>
          <FilterButton active={filter === "completed"} onClick={() => setFilter("completed")}>
            Đã hoàn thành ({inspections.filter((i) => i.status === "completed").length})
          </FilterButton>
          <FilterButton active={filter === "cancelled"} onClick={() => setFilter("cancelled")}>
            Đã hủy ({inspections.filter((i) => i.status === "cancelled").length})
          </FilterButton>
        </div>
      </div>

      {filteredInspections.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <ShieldCheck className="size-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Chưa có yêu cầu kiểm tra nào
          </h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "Bạn chưa gửi yêu cầu kiểm tra trọ nào"
              : "Không tìm thấy yêu cầu nào với trạng thái này"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInspections.map((insp) => (
            <div
              key={insp._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0">
                  <img
                    src={insp.propertyId?.image?.startsWith("http") ? insp.propertyId?.image : `${API_BASE}${insp.propertyId?.image || ""}`}
                    alt={insp.propertyId?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {insp.propertyId?.name || "Căn trọ cũ"}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="size-4" />
                        {insp.propertyId?.address?.split(",")[0] || "Hồ Chí Minh"}
                      </p>
                    </div>
                    {getStatusBadge(insp.status)}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 py-3 border-y border-gray-100 mt-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Mã yêu cầu</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        #{insp._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ngày gửi</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {new Date(insp.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Địa điểm</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {insp.propertyId?.address}
                      </p>
                    </div>
                  </div>

                  {insp.status === "pending" && (
                    <div className="flex justify-end mt-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleCancelInspection(insp._id)}
                      >
                        <XCircle className="size-4 mr-2" />
                        Hủy yêu cầu
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

/**
 * SettingsView component for managing user profile and security
 * Allows updating personal info and changing password
 */
function SettingsView() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cài đặt tài khoản</h2>
        <p className="text-gray-600">Quản lý thông tin cá nhân và bảo mật của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl"
        >
          <h3 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-50 text-green-600">
              <User className="size-5" />
            </div>
            Thông tin cá nhân
          </h3>
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as any;
              const fullName = target.fullName.value;
              const phone = target.phone.value;
              const token = localStorage.getItem("token");
              
              try {
                // Update user profile information via backend API
                const res = await fetch(`${API_BASE}/api/user/${user?.id}`, {
                  method: "PUT",
                  headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                  },
                  body: JSON.stringify({ fullName, phone })
                });

                if (res.ok) {
                  toast.success("Cập nhật thông tin thành công! ✨");
                  setTimeout(() => window.location.reload(), 1000);
                } else {
                  const data = await res.json();
                  toast.error(data.message || "Cập nhật thất bại. ❌");
                }
              } catch (err) {
                console.error("Profile update error:", err);
                toast.error("Lỗi cập nhật thông tin. ❌");
              }
            }} 
            className="space-y-5"
          >
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-100 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    (user?.fullName || user?.username || "U").charAt(0).toUpperCase()
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-green-600 text-white rounded-full shadow-lg cursor-pointer hover:bg-green-700 transition-all transform hover:scale-110">
                  <Camera className="size-4" />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      
                      const formData = new FormData();
                      formData.append("image", file);
                      const token = localStorage.getItem("token");
                      
                      try {
                        // 1. Upload image to get URL
                        const uploadRes = await fetch(`${API_BASE}/api/upload/single`, {
                          method: "POST",
                          headers: { Authorization: `Bearer ${token}` },
                          body: formData
                        });
                        
                        if (uploadRes.ok) {
                          const { url } = await uploadRes.json();
                          // 2. Update user profile with new avatar URL
                          const updateRes = await fetch(`${API_BASE}/api/user/${user?.id}`, {
                            method: "PUT",
                            headers: { 
                              "Content-Type": "application/json", 
                              Authorization: `Bearer ${token}` 
                            },
                            body: JSON.stringify({ avatar: url })
                          });
                          
                          if (updateRes.ok) {
                            const updatedUser = await updateRes.json();
                            updateUser(updatedUser);
                            toast.success("Đổi ảnh đại diện thành công! ✨");
                            setTimeout(() => window.location.reload(), 1000);
                          }
                        }
                      } catch (err) {
                        console.error("Avatar upload error:", err);
                        toast.error("Lỗi khi tải ảnh lên. ❌");
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Nhấp vào icon để đổi ảnh</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Họ và tên</label>
              <Input 
                name="fullName" 
                defaultValue={user?.fullName || user?.username} 
                className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Số điện thoại</label>
              <Input 
                name="phone" 
                defaultValue={user?.phone || ""} 
                placeholder="Nhập số điện thoại của bạn"
                className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12" 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email (Read-only)</label>
              <Input 
                disabled 
                value={user?.email || ""} 
                className="rounded-xl border-gray-100 bg-gray-50 text-gray-400 h-12 cursor-not-allowed" 
              />
            </div>

            <Button type="submit" className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg hover:shadow-green-500/20 text-white font-bold h-12 rounded-xl mt-4 transition-all">
              Lưu thay đổi
            </Button>
          </form>
        </motion.div>

        {/* Security / Password Change Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-white/50 shadow-xl"
        >
          <h3 className="font-black text-xl text-gray-900 mb-6 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
              <ShieldCheck className="size-5" />
            </div>
            Bảo mật & Mật khẩu
          </h3>
          
          <form 
            onSubmit={async (e) => {
              e.preventDefault();
              const target = e.target as any;
              const currentPassword = target.currentPassword.value;
              const newPassword = target.newPassword.value;
              const token = localStorage.getItem("token");
              
              try {
                // Change user password via authentication API
                const res = await fetch(`${API_BASE}/api/auth/change-password`, {
                  method: "PUT",
                  headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                  },
                  body: JSON.stringify({ currentPassword, newPassword })
                });

                if (res.ok) {
                  toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại. 🔐");
                  setTimeout(() => {
                    logout();
                    navigate("/login");
                  }, 2000);
                } else {
                  const data = await res.json();
                  toast.error(data.message || "Mật khẩu hiện tại không chính xác. ❌");
                }
              } catch (err) {
                console.error("Password change error:", err);
                toast.error("Lỗi đổi mật khẩu. ❌");
              }
            }} 
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Mật khẩu hiện tại</label>
              <Input 
                type="password" 
                name="currentPassword" 
                placeholder="••••••••" 
                className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12" 
                required 
                minLength={6} 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Mật khẩu mới</label>
              <Input 
                type="password" 
                name="newPassword" 
                placeholder="••••••••" 
                className="rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12" 
                required 
                minLength={6} 
              />
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-[10px] text-orange-800 leading-relaxed">
                <AlertCircle className="size-3 inline mr-1 mb-0.5" />
                <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn sẽ bị đăng xuất khỏi hệ thống để đảm bảo an toàn bảo mật.
              </p>
            </div>

            <Button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg">
              Đổi mật khẩu
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
