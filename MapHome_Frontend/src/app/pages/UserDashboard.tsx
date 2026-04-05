import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  getAvatarUrl,
  getInitials,
  getImageUrl,
} from "@/app/utils/avatarUtils";
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
  Building,
  Sparkles,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { toast } from "sonner";
import { amenityMeta } from "@/app/constants/amenities";
import api from "@/app/utils/api";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { 
  validateFullName, 
  validatePhone, 
  validatePassword 
} from "@/app/utils/validationRules";

// Define available views for the user dashboard
type UserView =
  | "favorites"
  | "search"
  | "appointments"
  | "inspections"
  | "book"
  | "settings";

interface ConfirmModalState {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm?: () => Promise<void> | void;
}

export function UserDashboard() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeView, setActiveView] = useState<UserView>("favorites");
  const [favorites, setFavorites] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [inspections, setInspections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
    open: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) return;

      try {
        const [favRes, bookRes, inspRes] = await Promise.all([
          api.get("/api/user/me/favorites"),
          api.get("/api/user/bookings"),
          api.get("/api/user/inspections"),
        ]);

        setFavorites(favRes.data);
        setAppointments(bookRes.data);
        setInspections(inspRes.data);
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
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Đang tải dữ liệu của bạn...
          </p>
        </div>
      </div>
    );
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
                <h1 className="font-bold text-xl text-gray-900 tracking-tight">
                  MapHome
                </h1>
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">
                  User Console
                </p>
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
              <div className="w-12 h-12 rounded-full border-2 border-white shadow-md overflow-hidden bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center text-white font-bold shrink-0">
                {user?.avatar ? (
                  <img
                    src={getAvatarUrl(user.avatar) || ""}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                    style={{ imageRendering: "-webkit-optimize-contrast" }}
                  />
                ) : (
                  getInitials(user?.fullName, user?.username)
                )}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block mx-4" />
            <Button
              variant="ghost"
              onClick={handleLogout}
              size="sm"
              className="text-gray-500 hover:text-red-600 transition-colors rounded-full px-4"
            >
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
            className="text-indigo-500/80 text-lg font-bold"
          >
            Nơi quản lý hành trình tìm kiếm ngôi nhà mơ ước của bạn
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {[
            {
              label: "Trọ yêu thích",
              value: favorites.length,
              icon: Heart,
              color: "text-red-500",
              bg: "bg-red-50",
            },
            {
              label: "Lịch hẹn",
              value: appointments.length,
              icon: Calendar,
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              label: "Chờ xác nhận",
              value: appointments.filter((a) => a.status === "pending").length,
              icon: Clock,
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
            {
              label: "Đã hoàn thành",
              value: appointments.filter((a) => a.status === "completed")
                .length,
              icon: CheckCircle,
              color: "text-green-500",
              bg: "bg-green-50",
            },
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
              <p className="text-3xl font-black text-indigo-600 mb-1">
                {stat.value}
              </p>
              <p className="text-[10px] font-black text-indigo-500/60 uppercase tracking-widest leading-none">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 no-scrollbar relative">
          {[
            { id: "favorites", label: "Trọ yêu thích", icon: Heart },
            { id: "search", label: "Tìm kiếm thông minh", icon: Search },
            { id: "appointments", label: "Lịch hẹn của tôi", icon: Calendar },
            { id: "inspections", label: "Yêu cầu kiểm tra", icon: ShieldCheck },
            { id: "settings", label: "Cài đặt", icon: Settings },
          ].map((tab) => {
            const isActive = activeView === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(tab.id as UserView)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap shadow-sm z-10 ${
                  isActive
                    ? "text-white"
                    : "bg-white text-gray-500 hover:text-gray-900 border border-gray-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl z-[-1] shadow-lg shadow-green-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon
                  className={`size-4 ${isActive ? "text-white" : ""}`}
                />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content Views */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {activeView === "favorites" && (
              <FavoritesView
                favorites={favorites}
                setFavorites={setFavorites}
                setConfirmModal={setConfirmModal}
              />
            )}
            {activeView === "search" && <SearchView />}
            {activeView === "appointments" && (
              <AppointmentsView
                appointments={appointments}
                setAppointments={setAppointments}
                setConfirmModal={setConfirmModal}
              />
            )}
            {activeView === "inspections" && (
              <InspectionsView
                inspections={inspections}
                setInspections={setInspections}
                setConfirmModal={setConfirmModal}
              />
            )}
            {activeView === "settings" && <SettingsView />}
          </motion.div>
        </AnimatePresence>
      </motion.main>
      <ConfirmDialog
        open={confirmModal.open}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText="Xác nhận"
        cancelText="Huỷ"
        onConfirm={async () => {
          await confirmModal.onConfirm?.();
          setConfirmModal({ open: false });
        }}
        onCancel={() => setConfirmModal({ open: false })}
      />
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
  setConfirmModal,
}: {
  favorites: any[];
  setFavorites: (favorites: any[]) => void;
  setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmModalState>>;
}) {
  const handleRemoveFavorite = async (propertyId: string) => {
    setConfirmModal({
      open: true,
      title: "Xoá khỏi yêu thích",
      description: "Bạn có chắc muốn xóa khỏi danh sách yêu thích?",
      onConfirm: async () => {
        try {
          const res = await api.post("/api/user/me/favorites/toggle", {
            propertyId,
          });

          if (res.status === 200 || res.status === 201) {
            setFavorites(favorites.filter((f) => f._id !== propertyId));
            toast.success("Đã xóa khỏi danh sách yêu thích! ✨");
          }
        } catch (err) {
          console.error("Failed to untoggle favorite:", err);
        }
      },
    });
  };

  const navigate = useNavigate();

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Trống danh sách yêu thích"
        description="Bắt đầu khám phá và lưu lại những căn trọ mơ ước của bạn ngay hôm nay để không bỏ lỡ."
        action={
          <Button
            onClick={() => navigate("/map")}
            className="px-8 h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-2xl font-black shadow-xl shadow-green-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 group"
          >
            <Search className="size-5 group-hover:rotate-12 transition-transform" />
            Tìm trọ ngay
          </Button>
        }
      />
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

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4"
      >
        {favorites.map((property) => (
          <motion.div
            key={property._id}
            variants={{
              hidden: { opacity: 0, x: -20 },
              show: { opacity: 1, x: 0 },
            }}
            whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
            className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex items-start gap-6">
              {/* Image */}
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0">
                <img
                  src={
                    getImageUrl(property.image) ||
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                  }
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {property.name}
                      {property.verificationLevel === "verified" && (
                        <span
                          className="ml-2 text-green-600"
                          title="Đã xác thực"
                        >
                          ✓
                        </span>
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
                  {Object.entries(property.amenities || {}).map(
                    ([key, value], idx) =>
                      value && (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full capitalize"
                        >
                          {key}
                        </span>
                      ),
                  )}
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

// Modern Search View Component with premium UI
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

  const toggleAmenity = (key: string) => {
    setSearchParams((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(key)
        ? prev.amenities.filter((a) => a !== key)
        : [...prev.amenities, key],
    }));
  };

  const navigate = useNavigate();
  const handleSearch = () => navigate("/map");
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
    toast.success("Đã đặt lại bộ lọc! ✨");
  };

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500">
      {/* Header Section */}
      <div className="bg-white/80 p-8 sm:p-10 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-green-500/20">
            <Sparkles className="size-8" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">
              Tìm kiếm thông minh
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Sử dụng bộ lọc nâng cao để tìm căn trọ hoàn hảo
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={handleReset}
          className="rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold px-6 h-12 transition-all border border-gray-100"
        >
          <RefreshCcw className="size-4 mr-2" />
          Đặt lại
        </Button>
      </div>

      <div className="p-8 sm:p-10 space-y-12">
        {/* Section 1: Basic Info */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-green-500 rounded-full" />
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
              Thông tin cơ bản
            </h4>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-2">
              <label className="text-xs font-bold text-indigo-500/60 ml-1">
                Từ khóa tìm kiếm
              </label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-indigo-300 group-focus-within:text-green-600 transition-colors" />
                <Input
                  type="text"
                  value={searchParams.keyword}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      keyword: e.target.value,
                    })
                  }
                  placeholder="Tên phòng trọ, khu phố, địa chỉ..."
                  className="pl-12 h-14 rounded-2xl border-indigo-50 bg-white/50 focus:bg-white transition-all text-base border-2 focus:border-green-500 focus:ring-0 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-indigo-500/60 ml-1">
                Khu vực
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-indigo-300" />
                <select
                  value={searchParams.district}
                  onChange={(e) =>
                    setSearchParams({
                      ...searchParams,
                      district: e.target.value,
                    })
                  }
                  className="w-full h-14 pl-12 pr-4 border-2 border-indigo-50 rounded-2xl text-base font-medium focus:border-green-500 focus:outline-none appearance-none bg-white transition-all shadow-sm"
                >
                  <option value="">Tất cả quận/huyện</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-indigo-300 rotate-90 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Range Filters */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
            <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
              Khoảng giá & Diện tích
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 ml-1 flex items-center gap-2">
                <DollarSign className="size-4 text-green-600" /> Giá thuê hàng
                tháng (VNĐ)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={searchParams.priceMin}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        priceMin: e.target.value,
                      })
                    }
                    placeholder="Tối thiểu"
                    className="h-14 rounded-2xl border-2 border-gray-100 px-6 font-bold text-gray-900 focus:border-green-500 transition-all shadow-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    Đ
                  </span>
                </div>
                <div className="w-8 h-1 bg-gray-200 rounded-full" />
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={searchParams.priceMax}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        priceMax: e.target.value,
                      })
                    }
                    placeholder="Tối đa"
                    className="h-14 rounded-2xl border-2 border-gray-100 px-6 font-bold text-gray-900 focus:border-green-500 transition-all shadow-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    Đ
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-500 ml-1 flex items-center gap-2">
                <Maximize className="size-4 text-blue-600" /> Diện tích sử dụng
                (m²)
              </label>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={searchParams.areaMin}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        areaMin: e.target.value,
                      })
                    }
                    placeholder="Từ"
                    className="h-14 rounded-2xl border-2 border-gray-100 px-6 font-bold text-gray-900 focus:border-blue-500 transition-all shadow-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    m²
                  </span>
                </div>
                <div className="w-8 h-1 bg-gray-200 rounded-full" />
                <div className="relative flex-1">
                  <Input
                    type="number"
                    value={searchParams.areaMax}
                    onChange={(e) =>
                      setSearchParams({
                        ...searchParams,
                        areaMax: e.target.value,
                      })
                    }
                    placeholder="Đến"
                    className="h-14 rounded-2xl border-2 border-gray-100 px-6 font-bold text-gray-900 focus:border-blue-500 transition-all shadow-sm"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                    m²
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Amenities & Verification */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-purple-500 rounded-full" />
              <h4 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">
                Tiện ích mong muốn
              </h4>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
              <ShieldCheck className="size-4 text-purple-600" />
              <span className="text-xs font-bold text-purple-700">
                Xác thực bởi MapHome
              </span>
              <input
                type="checkbox"
                id="verified"
                checked={searchParams.verified}
                onChange={(e) =>
                  setSearchParams({
                    ...searchParams,
                    verified: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {Object.entries(amenityMeta).map(([key, meta]) => {
              const Icon = meta.icon;
              const isActive = searchParams.amenities.includes(key);
              return (
                <motion.button
                  key={key}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleAmenity(key)}
                  className={`flex flex-col items-center justify-center p-5 rounded-[1.5rem] border-2 transition-all gap-3 ${
                    isActive
                      ? "bg-gradient-to-br from-green-500 to-green-600 border-green-500 text-white shadow-xl shadow-green-500/30"
                      : "bg-white border-gray-100 text-gray-500 hover:border-green-200 hover:bg-green-50/30"
                  }`}
                >
                  <div
                    className={`p-3 rounded-2xl ${isActive ? "bg-white/20" : "bg-gray-50"}`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">
                    {meta.label.split(" ").slice(0, 2).join(" ")}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div className="pt-10 flex flex-col sm:flex-row items-center gap-4">
          <Button
            onClick={handleSearch}
            className="w-full sm:flex-[2] h-16 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-3xl text-lg font-black shadow-2xl shadow-green-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Search className="size-6 mr-3 group-hover:rotate-12 transition-transform" />
            Bắt đầu tìm kiếm ngay
            <ArrowRight className="size-5 ml-4 opacity-70 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            className="w-full sm:flex-1 h-16 border-2 border-gray-100 rounded-3xl text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-200 transition-all"
            onClick={() => navigate("/map")}
          >
            <Navigation className="size-5 mr-3 text-blue-500" />
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
  setConfirmModal,
}: {
  appointments: any[];
  setAppointments: (appointments: any[]) => void;
  setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmModalState>>;
}) {
  const [filter, setFilter] = useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const filteredAppointments =
    filter === "all"
      ? appointments
      : appointments.filter((a) => a.status === filter);

  const handleCancelAppointment = async (id: string) => {
    setConfirmModal({
      open: true,
      title: "Hủy lịch hẹn",
      description: "Bạn có chắc muốn hủy lịch hẹn này?",
      onConfirm: async () => {
        try {
          const res = await api.put(`/api/bookings/${id}/cancel`);

          if (res.status === 200) {
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
      },
    });
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
        <EmptyState
          icon={Calendar}
          title="Chưa có lịch hẹn nào"
          description={
            filter === "all"
              ? "Bạn chưa đặt lịch hẹn xem trọ nào. Hãy tìm căn trọ ưng ý và đặt lịch với chủ trọ ngay!"
              : `Hiện tại bạn không có lịch hẹn nào ở trạng thái này.`
          }
        />
      ) : (
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment._id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                show: { opacity: 1, x: 0 },
              }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-6">
                {/* Property Image */}
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0">
                  <img
                    src={
                      getImageUrl(appointment.propertyId?.image) ||
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                    }
                    alt={appointment.propertyId?.name}
                    className="w-full h-full object-cover"
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
                        {appointment.propertyId?.address?.split(",")[0] ||
                          "Hồ Chí Minh"}
                      </p>
                    </div>
                    {getStatusBadge(appointment.status)}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-3 border-y">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Ngày hẹn</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Calendar className="size-4" />
                        {new Date(appointment.bookingDate).toLocaleDateString(
                          "vi-VN",
                        )}
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
                        {appointment.landlordId?.fullName ||
                          appointment.landlordId?.username ||
                          "Chủ trọ"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Liên hệ</p>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                        <Phone className="size-4" />
                        {appointment.phone ||
                          appointment.landlordId?.phone ||
                          "N/A"}
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
            </motion.div>
          ))}
        </motion.div>
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
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className={`relative px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all z-10 flex items-center justify-center min-w-[100px] ${
        active
          ? "text-white"
          : "bg-gray-50/50 text-gray-400 hover:text-gray-600 border border-gray-100 hover:border-gray-200"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeFilterIndicator"
          className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl z-[-1] shadow-lg shadow-green-500/20"
          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

// Premium Empty State Component
function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: any;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-2xl p-20 text-center relative overflow-hidden"
    >
      {/* Aura Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-blue-400/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-28 h-28 bg-white rounded-[2rem] shadow-2xl flex items-center justify-center mx-auto mb-10 border border-white shrink-0"
        >
          <Icon className="size-12 text-green-600/80" />
        </motion.div>

        <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">
          {title}
        </h3>
        <p className="text-gray-500 font-medium max-w-md mx-auto mb-10 leading-relaxed">
          {description}
        </p>

        {action && <div className="flex justify-center">{action}</div>}
      </div>
    </motion.div>
  );
}

// Inspections View Component
function InspectionsView({
  inspections,
  setInspections,
  setConfirmModal,
}: {
  inspections: any[];
  setInspections: (inspections: any[]) => void;
  setConfirmModal: React.Dispatch<React.SetStateAction<ConfirmModalState>>;
}) {
  const [filter, setFilter] = useState<
    "all" | "pending" | "completed" | "cancelled"
  >("all");

  const filteredInspections =
    filter === "all"
      ? inspections
      : inspections.filter((i) => i.status === filter);

  const handleCancelInspection = async (id: string) => {
    setConfirmModal({
      open: true,
      title: "Hủy yêu cầu kiểm tra",
      description: "Bạn có chắc muốn hủy yêu cầu kiểm tra này?",
      onConfirm: async () => {
        try {
          const res = await api.put(`/api/inspections/${id}/cancel`);

          if (res.status === 200) {
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
      },
    });
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
          <FilterButton
            active={filter === "all"}
            onClick={() => setFilter("all")}
          >
            Tất cả ({inspections.length})
          </FilterButton>
          <FilterButton
            active={filter === "pending"}
            onClick={() => setFilter("pending")}
          >
            Đang chờ ({inspections.filter((i) => i.status === "pending").length}
            )
          </FilterButton>
          <FilterButton
            active={filter === "completed"}
            onClick={() => setFilter("completed")}
          >
            Đã hoàn thành (
            {inspections.filter((i) => i.status === "completed").length})
          </FilterButton>
          <FilterButton
            active={filter === "cancelled"}
            onClick={() => setFilter("cancelled")}
          >
            Đã hủy ({inspections.filter((i) => i.status === "cancelled").length}
            )
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
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredInspections.map((insp) => (
            <motion.div
              key={insp._id}
              variants={{
                hidden: { opacity: 0, x: -20 },
                show: { opacity: 1, x: 0 },
              }}
              whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-blue-100 overflow-hidden flex-shrink-0">
                  <img
                    src={
                      getImageUrl(insp.propertyId?.image) ||
                      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400"
                    }
                    alt={insp.propertyId?.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
                        {insp.propertyId?.address?.split(",")[0] ||
                          "Hồ Chí Minh"}
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
            </motion.div>
          ))}
        </motion.div>
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

  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center md:text-left mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Cài đặt tài khoản
        </h2>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân và bảo mật của bạn
        </p>
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

              const fullNameValid = validateFullName(fullName);
              const phoneValid = validatePhone(phone);

              const newErrors = {
                ...fieldErrors,
                fullName: fullNameValid.error || "",
                phone: phoneValid.error || "",
              };
              setFieldErrors(newErrors);

              if (!fullNameValid.valid || !phoneValid.valid) {
                toast.error("Vui lòng kiểm tra lại thông tin! ❌");
                return;
              }

              try {
                // Update user profile information via backend API using axios
                const res = await api.put(`/api/user/${user?.id}`, {
                  fullName,
                  phone,
                });

                if (res.status === 200) {
                  toast.success("Cập nhật thông tin thành công! ✨");
                  setTimeout(() => window.location.reload(), 1000);
                } else {
                  toast.error(res.data.message || "Cập nhật thất bại. ❌");
                }
              } catch (err: any) {
                console.error("Profile update error:", err);
                toast.error(
                  err.response?.data?.message || "Lỗi cập nhật thông tin. ❌",
                );
              }
            }}
            className="space-y-5"
          >
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center gap-4 py-4 border-b border-gray-100 mb-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.avatar ? (
                    <img
                      src={getAvatarUrl(user.avatar) || ""}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      style={{ imageRendering: "-webkit-optimize-contrast" }}
                    />
                  ) : (
                    getInitials(user?.fullName, user?.username)
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
                      try {
                        // 1. Upload image to get URL
                        const uploadRes = await api.post(
                          "/api/upload/single",
                          formData,
                          {
                            headers: { "Content-Type": "multipart/form-data" },
                          },
                        );

                        if (
                          uploadRes.status === 200 ||
                          uploadRes.status === 201
                        ) {
                          const { url } = uploadRes.data;
                          // 2. Update user profile with new avatar URL
                          const updateRes = await api.put(
                            `/api/user/${user?.id}`,
                            { avatar: url },
                          );

                          if (updateRes.status === 200) {
                            const updatedUser = updateRes.data;
                            updateUser(updatedUser);
                            toast.success("Đổi ảnh đại diện thành công! ✨");
                            setTimeout(() => window.location.reload(), 1000);
                          }
                        }
                      } catch (err: any) {
                        console.error("Avatar upload error:", err);
                        toast.error(
                          err.response?.data?.message ||
                            "Lỗi khi tải ảnh lên. ❌",
                        );
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                Nhấp vào icon để đổi ảnh
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                Họ và tên
              </label>
              <Input
                name="fullName"
                defaultValue={user?.fullName || user?.username}
                className={`rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12 ${fieldErrors.fullName ? "border-red-500" : ""}`}
                onChange={() => setFieldErrors({...fieldErrors, fullName: ""})}
                onBlur={(e) => setFieldErrors({...fieldErrors, fullName: validateFullName(e.target.value).error || ""})}
                required
              />
              {fieldErrors.fullName && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-bold">
                  <AlertCircle className="size-3" /> {fieldErrors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                Số điện thoại
              </label>
              <Input
                name="phone"
                defaultValue={user?.phone || ""}
                placeholder="Nhập số điện thoại của bạn"
                className={`rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12 ${fieldErrors.phone ? "border-red-500" : ""}`}
                onChange={() => setFieldErrors({...fieldErrors, phone: ""})}
                onBlur={(e) => setFieldErrors({...fieldErrors, phone: validatePhone(e.target.value).error || ""})}
                required
              />
              {fieldErrors.phone && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-bold">
                  <AlertCircle className="size-3" /> {fieldErrors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                Email (Read-only)
              </label>
              <Input
                disabled
                value={user?.email || ""}
                className="rounded-xl border-gray-100 bg-gray-50 text-gray-400 h-12 cursor-not-allowed"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:shadow-lg hover:shadow-green-500/20 text-white font-bold h-12 rounded-xl mt-4 transition-all"
            >
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

              const newPasswordValid = validatePassword(newPassword);
              
              if (!newPasswordValid.valid) {
                 setFieldErrors({
                   ...fieldErrors,
                   newPassword: newPasswordValid.error || ""
                 });
                 toast.error(newPasswordValid.error || "Mật khẩu không hợp lệ! ❌");
                 return;
              }

              try {
                // Change user password via authentication API using axios
                const res = await api.put("/api/auth/change-password", {
                  currentPassword,
                  newPassword,
                });

                if (res.status === 200) {
                  toast.success(
                    "Đổi mật khẩu thành công! Vui lòng đăng nhập lại. 🔐",
                  );
                  setTimeout(() => {
                    logout();
                    navigate("/login");
                  }, 2000);
                } else {
                  toast.error(
                    res.data.message || "Mật khẩu hiện tại không chính xác. ❌",
                  );
                }
              } catch (err: any) {
                console.error("Password change error:", err);
                toast.error(
                  err.response?.data?.message || "Lỗi đổi mật khẩu. ❌",
                );
              }
            }}
            className="space-y-5"
          >
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                Mật khẩu hiện tại
              </label>
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
              <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">
                Mật khẩu mới
              </label>
              <Input
                type="password"
                name="newPassword"
                placeholder="••••••••"
                className={`rounded-xl border-gray-100 bg-white/50 focus:bg-white transition-all h-12 ${fieldErrors.newPassword ? "border-red-500" : ""}`}
                onChange={() => setFieldErrors({...fieldErrors, newPassword: ""})}
                onBlur={(e) => setFieldErrors({...fieldErrors, newPassword: validatePassword(e.target.value).error || ""})}
                required
              />
              {fieldErrors.newPassword && (
                <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1 font-bold">
                  <AlertCircle className="size-3" /> {fieldErrors.newPassword}
                </p>
              )}
            </div>

            <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-[10px] text-orange-800 leading-relaxed">
                <AlertCircle className="size-3 inline mr-1 mb-0.5" />
                <strong>Lưu ý:</strong> Sau khi đổi mật khẩu thành công, bạn sẽ
                bị đăng xuất khỏi hệ thống để đảm bảo an toàn bảo mật.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-black text-white font-bold h-12 rounded-xl mt-4 transition-all shadow-lg"
            >
              Đổi mật khẩu
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
