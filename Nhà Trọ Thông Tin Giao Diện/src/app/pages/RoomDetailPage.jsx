import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import { Separator } from "@/app/components/ui/separator";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  VerificationBadge,
  UnverifiedWarning,
  LocationVerificationInfo,
} from "@/app/components/VerificationBadge";
import { BookingDialog } from "@/app/components/BookingDialog";
import { useFavorites } from "@/app/hooks/useFavorites";
import {
  mockRentalProperties,
  getLandlordById,
  getPropertiesByLandlord,
} from "@/app/components/mockData";
import { mockFacilities } from "@/app/components/mockFacilities";
import { RentalProperty } from "@/app/components/types";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { CompareFloatingBar } from "@/app/components/CompareFloatingBar";
import { Toaster } from "@/app/components/ui/sonner";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Phone,
  Calendar,
  User,
  Star,
  Wifi,
  Tv,
  WashingMachine,
  Utensils,
  Refrigerator,
  Wind,
  Sofa,
  ChevronLeft,
  ChevronRight,
  X,
  Expand,
  Clock,
  MessageCircle,
  Shield,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Home,
  Hospital,
  GraduationCap,
  ShoppingCart,
  TreePine,
  Bus,
} from "lucide-react";

// --- Mock reviews ---
const mockReviews = [
  {
    id: "r1",
    author: "Minh Tuấn",
    rating: 5,
    date: "2026-02-10",
    text: "Phòng sạch sẽ, chủ nhà thân thiện. Giá hợp lý so với khu vực. Rất recommend!",
    avatar: "MT",
  },
  {
    id: "r2",
    author: "Hương Ly",
    rating: 4,
    date: "2026-01-28",
    text: "Vị trí thuận tiện, gần chợ và trường học. Phòng hơi nhỏ nhưng đầy đủ tiện nghi.",
    avatar: "HL",
  },
  {
    id: "r3",
    author: "Thanh Hà",
    rating: 5,
    date: "2026-01-15",
    text: "Đã ở 6 tháng rồi, rất hài lòng. Chủ nhà sửa chữa nhanh khi có vấn đề. An ninh tốt.",
    avatar: "TH",
  },
  {
    id: "r4",
    author: "Quốc Bảo",
    rating: 3,
    date: "2025-12-20",
    text: "Phòng OK, nhưng wifi đôi khi chập chờn. Hy vọng sẽ được cải thiện.",
    avatar: "QB",
  },
];

// --- Extra gallery images ---
const extraGalleryImages = [
  "https://images.unsplash.com/photo-1654506012740-09321c969dc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvciUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzcxOTE3NDY3fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1628602813647-c70518049674?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiYXRocm9vbSUyMGludGVyaW9yJTIwY2xlYW58ZW58MXx8fHwxNzcxODgwMjIwfDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1745429523635-ad375f836bf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBraXRjaGVuJTIwc21hbGwlMjBtb2Rlcm58ZW58MXx8fHwxNzcxOTE3NDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
  "https://images.unsplash.com/photo-1768118422932-4cdcca2ced8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxjb255JTIwY2l0eSUyMHZpZXclMjBhcGFydG1lbnR8ZW58MXx8fHwxNzcxOTE3NDY4fDA&ixlib=rb-4.1.0&q=80&w=1080",
];

const amenityConfig = {
  wifi: { icon: Wifi, label: "WiFi miễn phí" },
  furniture: { icon: Sofa, label: "Nội thất đầy đủ" },
  tv: { icon: Tv, label: "Tivi" },
  washingMachine: { icon: WashingMachine, label: "Máy giặt" },
  kitchen: { icon: Utensils, label: "Bếp riêng" },
  refrigerator: { icon: Refrigerator, label: "Tủ lạnh" },
  airConditioner: { icon: Wind, label: "Máy lạnh" },
};

const facilityTypeIcons = {
  hospital: { icon: Hospital, label: "Bệnh viện", color: "text-red-500" },
  school: { icon: GraduationCap, label: "Trường học", color: "text-amber-500" },
  supermarket: {
    icon: ShoppingCart,
    label: "Siêu thị",
    color: "text-purple-500",
  },
  park: { icon: TreePine, label: "Công viên", color: "text-green-500" },
  bus_stop: { icon: Bus, label: "Trạm xe buýt", color: "text-blue-500" },
};

// Distance helper
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// --- Star Rating Component ---
function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`size-4 ${i <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
        />
      ))}
    </div>
  );
}

// --- Fullscreen Gallery ---
function FullscreenGallery({ images, initialIndex, onClose }) {
  const [current] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((c) => (c + 1) % images.length);
      if (e.key === "ArrowLeft")
        setCurrent((c) => (c - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [images.length, onClose]);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white z-10 p-2"
      >
        <X className="size-8" />
      </button>
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {current + 1} / {images.length}
      </div>
      <button
        onClick={() =>
          setCurrent((c) => (c - 1 + images.length) % images.length)
        }
        className="absolute left-4 text-white/70 hover:text-white p-2"
      >
        <ChevronLeft className="size-10" />
      </button>
      <img
        src={images[current]}
        alt={`Ảnh ${current + 1}`}
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
      />
      <button
        onClick={() => setCurrent((c) => (c + 1) % images.length)}
        className="absolute right-4 text-white/70 hover:text-white p-2"
      >
        <ChevronRight className="size-10" />
      </button>
      {/* Thumbnails */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-16 h-12 rounded overflow-hidden border-2 transition-all ${i === current ? "border-white scale-110" : "border-transparent opacity-60 hover:opacity-90"}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

// --- Mini Map ---
function MiniMap({ property }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  const nearbyFacilities = useMemo(() => {
    return mockFacilities
      .map((f) => ({
        ...f,
        distance: getDistanceKm(
          property.location[0],
          property.location[1],
          f.lat,
          f.lng,
        ),
      }))
      .filter((f) => f.distance < 2)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);
  }, [property]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    mapRef.current = L.map(containerRef.current, {
      scrollWheelZoom: false,
      dragging: true,
      zoomControl: true,
    }).setView(property.location, 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OSM",
    }).addTo(mapRef.current);

    // Property marker
    const propertyIcon = L.divIcon({
      html: `<div style="background:linear-gradient(135deg,#10b981,#059669);width:40px;height:40px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" style="transform:rotate(45deg);"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
      </div>`,
      className: "property-pin",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });

    L.marker(property.location, { icon: propertyIcon })
      .addTo(mapRef.current)
      .bindPopup(`<strong>${property.name}</strong><br/>${property.address}`);

    // Nearby facility markers
    const facilityColors = {
      hospital: "#ef4444",
      school: "#f59e0b",
      supermarket: "#8b5cf6",
      park: "#10b981",
      bus_stop: "#3b82f6",
    };

    nearbyFacilities.forEach((f) => {
      const color = facilityColors[f.type] || "#6b7280";
      const fIcon = L.divIcon({
        html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: "facility-mini",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([f.lat, f.lng], { icon: fIcon })
        .addTo(mapRef.current)
        .bindPopup(
          `<strong>${f.name}</strong><br/>${Math.round(f.distance * 1000)}m`,
        );
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [property]);

  return (
    <div>
      <div ref={containerRef} className="h-[300px] w-full rounded-xl border" />
      {/* Nearby list */}
      {nearbyFacilities.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {nearbyFacilities.map((f) => {
            const config = facilityTypeIcons[f.type];
            const Icon = config?.icon || MapPin;
            return (
              <div
                key={f.id}
                className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-lg"
              >
                <div
                  className={`flex-shrink-0 ${config?.color || "text-gray-500"}`}
                >
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {f.name}
                  </p>
                  <p className="text-xs text-gray-500">{config?.label}</p>
                </div>
                <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                  {f.distance < 1
                    ? `${Math.round(f.distance * 1000)}m`
                    : `${f.distance.toFixed(1)}km`}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --- MAIN PAGE ---
export function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [fullscreenGallery, setFullscreenGallery] = useState(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  const property = mockRentalProperties.find((p) => p.id === id);
  const landlord = property?.landlordId
    ? getLandlordById(property.landlordId)
    : null;

  // Similar properties
  const similarProperties = useMemo(() => {
    if (!property) return [];
    return mockRentalProperties
      .filter((p) => p.id !== property.id)
      .map((p) => ({
        ...p,
        distance: getDistanceKm(
          property.location[0],
          property.location[1],
          p.location[0],
          p.location[1],
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4);
  }, [property]);

  // Gallery images
  const galleryImages = useMemo(() => {
    if (!property) return [];
    const images = [property.image];
    if (
      property.pinInfo?.photoAtPin &&
      property.pinInfo.photoAtPin !== property.image
    ) {
      images.push(property.pinInfo.photoAtPin);
    }
    // Add extras based on property id to vary
    const offset = parseInt(property.id) % extraGalleryImages.length;
    for (let i = 0; i < 3; i++) {
      images.push(extraGalleryImages[(offset + i) % extraGalleryImages.length]);
    }
    return images;
  }, [property]);

  const favorite = property ? isFavorite(property.id) : false;

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Reviews for this property (mock - use property id to vary)
  const reviews = useMemo(() => {
    if (!property) return [];
    const offset = parseInt(property.id) % 2;
    return mockReviews.slice(offset, offset + 3);
  }, [property]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
      : "0";

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto">
              <Home className="size-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Không tìm thấy phòng trọ
            </h2>
            <p className="text-gray-600">
              Phòng trọ này không tồn tại hoặc đã bị xóa
            </p>
            <Button
              onClick={() => navigate("/map")}
              className="bg-green-600 hover:bg-green-700"
            >
              <MapPin className="size-4 mr-2" />
              Quay lại bản đồ
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const activeAmenities = Object.entries(property.amenities)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const inactiveAmenities = Object.entries(property.amenities)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Fullscreen Gallery */}
      {fullscreenGallery !== null && (
        <FullscreenGallery
          images={galleryImages}
          initialIndex={fullscreenGallery}
          onClose={() => setFullscreenGallery(null)}
        />
      )}

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/")}
              className="hover:text-green-600 transition-colors"
            >
              Trang chủ
            </button>
            <span>/</span>
            <button
              onClick={() => navigate("/map")}
              className="hover:text-green-600 transition-colors"
            >
              Tìm trọ
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">
              {property.name}
            </span>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* === GALLERY === */}
          <div className="mb-6">
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] rounded-2xl overflow-hidden">
              {/* Main image */}
              <div
                className="col-span-2 row-span-2 relative cursor-pointer group"
                onClick={() => setFullscreenGallery(0)}
              >
                <ImageWithFallback
                  src={galleryImages[0]}
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                <div className="absolute bottom-3 left-3 flex gap-2">
                  {property.pinInfo && (
                    <Badge className="bg-orange-500 text-white shadow-lg">
                      📌 Chủ trọ đã ghim
                    </Badge>
                  )}
                  <Badge
                    variant={property.available ? "default" : "secondary"}
                    className="shadow-lg"
                  >
                    {property.available ? "🟢 Còn phòng" : "🔴 Hết phòng"}
                  </Badge>
                </div>
              </div>
              {/* Smaller images */}
              {galleryImages.slice(1, 5).map((img, i) => (
                <div
                  key={i}
                  className="relative cursor-pointer group overflow-hidden"
                  onClick={() => setFullscreenGallery(i + 1)}
                >
                  <ImageWithFallback
                    src={img}
                    alt={`Ảnh ${i + 2}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all" />
                  {/* Show more overlay on last */}
                  {i === 3 && galleryImages.length > 5 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{galleryImages.length - 5} ảnh
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Gallery expand button */}
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFullscreenGallery(0)}
                className="text-xs"
              >
                <Expand className="size-3.5 mr-1.5" />
                Xem tất cả {galleryImages.length} ảnh
              </Button>
            </div>
          </div>

          {/* === CONTENT GRID === */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                      {property.name}
                    </h1>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="size-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{property.address}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <VerificationBadge
                        level={property.verificationLevel}
                        verifiedAt={property.verifiedAt}
                        locationAccuracy={property.locationAccuracy}
                        size="md"
                      />
                      {property.pinInfo && (
                        <Badge
                          className="bg-orange-100 text-orange-800 border border-orange-200"
                          variant="outline"
                        >
                          📌 GPS đã ghim
                        </Badge>
                      )}
                      <div className="flex items-center gap-1 text-sm text-amber-600">
                        <Star className="size-4 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">{avgRating}</span>
                        <span className="text-gray-400">
                          ({reviews.length} đánh giá)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => toggleFavorite(property.id)}
                      className="h-10 w-10"
                    >
                      <Heart
                        className={`size-5 ${favorite ? "fill-red-500 text-red-500" : "text-gray-500"}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleShare}
                      className="h-10 w-10"
                    >
                      {copied ? (
                        <Check className="size-5 text-green-600" />
                      ) : (
                        <Share2 className="size-5 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Price & Area bar */}
                <div className="flex items-center gap-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-5 border border-blue-100">
                  <div>
                    <p className="text-3xl font-bold text-blue-600">
                      {property.price.toLocaleString("vi-VN")}đ
                    </p>
                    <p className="text-sm text-gray-500">/tháng</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {property.area}m²
                    </p>
                    <p className="text-sm text-gray-500">Diện tích</p>
                  </div>
                  <Separator orientation="vertical" className="h-12" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {Math.round(
                        property.price / property.area,
                      ).toLocaleString("vi-VN")}
                      đ
                    </p>
                    <p className="text-sm text-gray-500">/m²/tháng</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b">
                <div className="flex gap-1">
                  {[
                    { key: "info", label: "Thông tin", icon: Home },
                    {
                      key: "reviews",
                      label: `Đánh giá (${reviews.length})`,
                      icon: Star,
                    },
                    { key: "nearby", label: "Tiện ích lân cận", icon: MapPin },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                        activeTab === tab.key
                          ? "border-green-600 text-green-700"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <tab.icon className="size-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Verification Info */}
                  {property.verificationLevel === "unverified" && (
                    <UnverifiedWarning />
                  )}
                  {property.verificationLevel === "location-verified" &&
                    property.locationAccuracy && (
                      <LocationVerificationInfo
                        locationAccuracy={property.locationAccuracy}
                      />
                    )}

                  {/* Pin Info */}
                  {property.pinInfo && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                          <MapPin className="size-4 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-orange-900">
                            Chủ trọ đã ghim vị trí GPS
                          </h3>
                          <p className="text-xs text-orange-600">
                            Ghim lúc{" "}
                            {new Date(
                              property.pinInfo.pinnedAt,
                            ).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      </div>
                      {property.pinInfo.note && (
                        <p className="text-sm text-orange-800 bg-white/50 rounded-lg p-3 italic">
                          💬 "{property.pinInfo.note}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Tiện ích phòng
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {activeAmenities.map((key) => {
                        const cfg = amenityConfig[key];
                        if (!cfg) return null;
                        const Icon = cfg.icon;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100"
                          >
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                              <Icon className="size-5 text-green-700" />
                            </div>
                            <span className="text-sm font-medium text-green-900">
                              {cfg.label}
                            </span>
                          </div>
                        );
                      })}
                      {inactiveAmenities.map((key) => {
                        const cfg = amenityConfig[key];
                        if (!cfg) return null;
                        const Icon = cfg.icon;
                        return (
                          <div
                            key={key}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 opacity-50"
                          >
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Icon className="size-5 text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-400 line-through">
                              {cfg.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mini Map */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Vị trí trên bản đồ
                    </h3>
                    <MiniMap property={property} />
                    <Button
                      variant="outline"
                      className="mt-3 w-full"
                      onClick={() => navigate("/map")}
                    >
                      <ExternalLink className="size-4 mr-2" />
                      Mở bản đồ lớn
                    </Button>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="bg-amber-50 rounded-xl p-6 border border-amber-100 flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold text-amber-600">
                        {avgRating}
                      </p>
                      <StarRating rating={Math.round(Number(avgRating))} />
                      <p className="text-xs text-gray-500 mt-1">
                        {reviews.length} đánh giá
                      </p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1 space-y-1.5">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviews.filter(
                          (r) => r.rating === star,
                        ).length;
                        const pct =
                          reviews.length > 0
                            ? (count / reviews.length) * 100
                            : 0;
                        return (
                          <div key={star} className="flex items-center gap-2">
                            <span className="text-xs w-3 text-gray-600">
                              {star}
                            </span>
                            <Star className="size-3 fill-amber-400 text-amber-400" />
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-amber-400 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review list */}
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="bg-white rounded-xl p-5 border shadow-sm"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {review.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.date).toLocaleDateString(
                                "vi-VN",
                              )}
                            </p>
                          </div>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          {review.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "nearby" && (
                <div>
                  <MiniMap property={property} />
                </div>
              )}
            </div>

            {/* RIGHT: Sidebar */}
            <div className="space-y-5">
              {/* Sticky wrapper */}
              <div className="lg:sticky lg:top-24 space-y-5">
                {/* CTA Card */}
                <Card className="shadow-lg border-green-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-600 to-blue-600 p-4 text-white">
                    <p className="text-2xl font-bold">
                      {property.price.toLocaleString("vi-VN")}đ
                      <span className="text-base font-normal opacity-80">
                        /tháng
                      </span>
                    </p>
                    <p className="text-sm opacity-80 mt-1">
                      {property.area}m² •{" "}
                      {property.address.split(",").pop()?.trim()}
                    </p>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                      size="lg"
                      onClick={() => setIsBookingOpen(true)}
                    >
                      <Calendar className="size-5 mr-2" />
                      Đặt lịch xem phòng
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={() =>
                        (window.location.href = `tel:${property.phone.replace(/\s/g, "")}`)
                      }
                    >
                      <Phone className="size-5 mr-2" />
                      Gọi {property.phone}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-green-700 border-green-300 hover:bg-green-50"
                      size="lg"
                    >
                      <MessageCircle className="size-5 mr-2" />
                      Nhắn Zalo
                    </Button>
                  </CardContent>
                </Card>

                {/* Landlord Card */}
                {landlord && (
                  <Card className="shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                          {landlord.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900">
                              {landlord.name}
                            </h3>
                            {landlord.verified && (
                              <ShieldCheck className="size-4 text-green-600" />
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-amber-600">
                            <Star className="size-3.5 fill-amber-400 text-amber-400" />
                            <span className="font-semibold">
                              {landlord.rating}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-gray-900">
                            {landlord.totalListings}
                          </p>
                          <p className="text-[10px] text-gray-500">Tin đăng</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-lg font-bold text-green-600">
                            {landlord.responseRate}%
                          </p>
                          <p className="text-[10px] text-gray-500">Phản hồi</p>
                        </div>
                        <div className="text-center p-2 bg-gray-50 rounded-lg">
                          <p className="text-sm font-bold text-blue-600">
                            {landlord.responseTime}
                          </p>
                          <p className="text-[10px] text-gray-500">Trả lời</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="size-3" />
                        Tham gia từ{" "}
                        {new Date(landlord.joinedDate).toLocaleDateString(
                          "vi-VN",
                          { month: "long", year: "numeric" },
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Safety tips */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2 text-sm">
                      <Shield className="size-4" />
                      Lưu ý an toàn
                    </h4>
                    <ul className="text-xs text-yellow-800 space-y-1.5">
                      <li>• Xem phòng trực tiếp trước khi đặt cọc</li>
                      <li>• Không chuyển tiền trước khi ký hợp đồng</li>
                      <li>• Kiểm tra giấy tờ sở hữu nhà</li>
                      <li>• Ưu tiên tin đã xác thực GPS</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* === SIMILAR PROPERTIES === */}
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Phòng trọ tương tự gần đây
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/map")}
              >
                Xem tất cả
                <ChevronRight className="size-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {similarProperties.map((sp) => (
                <Card
                  key={sp.id}
                  className="cursor-pointer hover:shadow-lg transition-all overflow-hidden group"
                  onClick={() => navigate(`/room/${sp.id}`)}
                >
                  <div className="relative h-40 overflow-hidden">
                    <ImageWithFallback
                      src={sp.image}
                      alt={sp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {sp.pinInfo && (
                      <Badge className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] shadow">
                        📌 Đã ghim
                      </Badge>
                    )}
                    <Badge
                      variant={sp.available ? "default" : "secondary"}
                      className="absolute top-2 right-2 text-[10px] shadow"
                    >
                      {sp.available ? "Còn phòng" : "Hết phòng"}
                    </Badge>
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm text-gray-900 truncate mb-1">
                      {sp.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {sp.address}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-blue-600">
                        {sp.price.toLocaleString("vi-VN")}đ
                      </p>
                      <span className="text-xs text-gray-400">
                        {sp.area}m² •{" "}
                        {sp.distance < 1
                          ? `${Math.round(sp.distance * 1000)}m`
                          : `${sp.distance.toFixed(1)}km`}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <CompareFloatingBar />
      <Toaster />

      <BookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        property={property}
      />
    </div>
  );
}
