import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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

// Mock data - Trọ yêu thích
const mockFavorites = [
  {
    id: 1,
    image: "🏠",
    title: "Trọ Cao Cấp FPTU",
    price: 3500000,
    area: 25,
    location: "Quận 9, TP.HCM",
    address: "123 Đường D1, Khu Công Nghệ Cao",
    amenities: ["Wifi", "Điều hòa", "Máy giặt", "Bếp"],
    rating: 4.8,
    reviews: 24,
    landlord: "Nguyễn Văn A",
    phone: "0901234567",
    verified: true,
    addedDate: "2024-02-20",
  },
  {
    id: 2,
    image: "🏡",
    title: "Phòng Trọ Làng Đại Học",
    price: 2800000,
    area: 20,
    location: "Thủ Đức, TP.HCM",
    address: "456 Đường Tô Vĩnh Diện",
    amenities: ["Wifi", "Điều hòa", "WC riêng"],
    rating: 4.5,
    reviews: 18,
    landlord: "Trần Thị B",
    phone: "0912345678",
    verified: false,
    addedDate: "2024-02-18",
  },
  {
    id: 3,
    image: "🏢",
    title: "Mini Studio Full Nội Thất",
    price: 4200000,
    area: 35,
    location: "Bình Thạnh, TP.HCM",
    address: "789 Điện Biên Phủ",
    amenities: ["Wifi", "Điều hòa", "Máy giặt", "Bếp", "Ban công"],
    rating: 4.9,
    reviews: 31,
    landlord: "Lê Văn C",
    phone: "0923456789",
    verified: true,
    addedDate: "2024-02-15",
  },
];

// Mock data - Lịch hẹn
const mockAppointments = [
  {
    id: 1,
    propertyId: 1,
    propertyTitle: "Trọ Cao Cấp FPTU",
    propertyImage: "🏠",
    location: "Quận 9, TP.HCM",
    landlord: "Nguyễn Văn A",
    phone: "0901234567",
    date: "2024-02-26",
    time: "14:00",
    status: "confirmed",
    notes: "Xem phòng tầng 2",
    createdAt: "2024-02-24",
  },
  {
    id: 2,
    propertyId: 2,
    propertyTitle: "Phòng Trọ Làng Đại Học",
    propertyImage: "🏡",
    location: "Thủ Đức, TP.HCM",
    landlord: "Trần Thị B",
    phone: "0912345678",
    date: "2024-02-28",
    time: "10:00",
    status: "pending",
    notes: "",
    createdAt: "2024-02-24",
  },
  {
    id: 3,
    propertyId: 3,
    propertyTitle: "Mini Studio Full Nội Thất",
    propertyImage: "🏢",
    location: "Bình Thạnh, TP.HCM",
    landlord: "Lê Văn C",
    phone: "0923456789",
    date: "2024-02-23",
    time: "16:00",
    status: "completed",
    notes: "Đã xem, rất hài lòng",
    createdAt: "2024-02-22",
  },
  {
    id: 4,
    propertyId: 4,
    propertyTitle: "Căn Hộ Mini Q7",
    propertyImage: "🏘️",
    location: "Quận 7, TP.HCM",
    landlord: "Phạm Văn D",
    phone: "0934567890",
    date: "2024-02-25",
    time: "15:00",
    status: "cancelled",
    notes: "Không phù hợp giá",
    createdAt: "2024-02-23",
  },
];

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState("favorites");
  const [favorites, setFavorites] = useState(mockFavorites);
  const [appointments, setAppointments] = useState(mockAppointments);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
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
function TabButton({ active, onClick, icon, children }) {
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
function FavoritesView({ favorites, setFavorites }) {
  const handleRemoveFavorite = (id) => {
    if (confirm("Bạn có chắc muốn xóa khỏi danh sách yêu thích?")) {
      setFavorites(favorites.filter((f) => f.id !== id));
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
            key={property.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start gap-6">
              {/* Image */}
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-5xl flex-shrink-0">
                {property.image}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {property.title}
                      {property.verified && (
                        <span className="ml-2 text-green-600">✓</span>
                      )}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="size-4" />
                        {property.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Maximize className="size-4" />
                        {property.area}m²
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        {property.rating} ({property.reviews} đánh giá)
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {(property.price / 1000000).toFixed(1)}tr
                    </div>
                    <div className="text-xs text-gray-500">/tháng</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-3">{property.address}</p>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {property.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>

                {/* Contact & Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <User className="size-4" />
                      {property.landlord}
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
                    >
                      <Calendar className="size-4 mr-2" />
                      Đặt lịch xem
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      <Eye className="size-4 mr-2" />
                      Xem chi tiết
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveFavorite(property.id)}
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
    amenities: [],
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

  const toggleAmenity = (amenity) => {
    setSearchParams({
      ...searchParams,
      amenities: searchParams.amenities.includes(amenity)
        ? searchParams.amenities.filter((a) => a !== amenity)
        : [...searchParams.amenities, amenity],
    });
  };

  const handleSearch = () => {
    alert(
      "Tìm kiếm với các tiêu chí:\n" + JSON.stringify(searchParams, null, 2),
    );
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
              setSearchParams({
                ...searchParams,
                verified: !searchParams.verified,
              })
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
function AppointmentsView({ appointments, setAppointments }) {
  const [filter] = useState("all");

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const handleCancelAppointment = (id) => {
    if (confirm("Bạn có chắc muốn hủy lịch hẹn này?")) {
      setAppointments(
        appointments.map((a) =>
          a.id === id ? { ...a, status: "cancelled" } : a,
        ),
      );
    }
  };

  const getStatusBadge = (status) => {
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
              key={appointment.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-6">
                {/* Property Image */}
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center text-4xl flex-shrink-0">
                  {appointment.propertyImage}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {appointment.propertyTitle}
                      </h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="size-4" />
                        {appointment.location}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ngày hẹn</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar className="size-4" />
                        {appointment.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Giờ hẹn</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="size-4" />
                        {appointment.time}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Chủ trọ</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <User className="size-4" />
                        {appointment.landlord}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Liên hệ</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="size-4" />
                        {appointment.phone}
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

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xs text-gray-500">
                      Đặt lịch: {appointment.createdAt}
                    </p>
                    <div className="flex items-center gap-2">
                      {appointment.status === "pending" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        >
                          <XCircle className="size-4 mr-2" />
                          Hủy lịch
                        </Button>
                      )}
                      {appointment.status === "confirmed" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-green-300 text-green-700"
                          >
                            <MessageCircle className="size-4 mr-2" />
                            Nhắn tin
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-300 text-blue-700"
                          >
                            <Navigation className="size-4 mr-2" />
                            Chỉ đường
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="size-4 mr-2" />
                        Chi tiết
                      </Button>
                    </div>
                  </div>
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
function FilterButton({ active, onClick, children }) {
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
