import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import {
  ArrowLeft,
  Home,
  Upload,
  MapPin,
  ShieldCheck,
  Camera,
  Loader2,
  X,
  Image as ImageIcon,
  Check,
  Pin,
} from "lucide-react";
import { LandlordPinMap } from "@/app/components/LandlordPinMap";
import { useProperties } from "@/app/contexts/PropertiesContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { RentalProperty, GreenBadgeLevel } from "@/app/components/types";
import { vietnamLocations, Province, District, Ward } from "@/app/data/vietnamLocations";

type Step = "info" | "pin-map" | "verify" | "upload-photos" | "preview";

export function PostRoomPage() {
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("info");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationData, setLocationData] = useState<{
    lat: number;
    lng: number;
    accuracy: number;
  } | null>(null);
  const [pinnedLocation, setPinnedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [pinNote, setPinNote] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState({
    wifi: false,
    furniture: false,
    airConditioner: false,
    washingMachine: false,
    refrigerator: false,
    kitchen: false,
    tv: false,
  });
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    area: "",
    street: "",
    description: "",
    phone: "",
  });

  // Address fields
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  // Get available districts based on selected province
  const availableDistricts = useMemo(() => {
    if (!selectedProvince) return [];
    const province = vietnamLocations.find((p: Province) => p.code === selectedProvince);
    return province?.districts || [];
  }, [selectedProvince]);

  // Get available wards based on selected district
  const availableWards = useMemo(() => {
    if (!selectedDistrict) return [];
    const district = availableDistricts.find(
      (d: District) => d.code === selectedDistrict,
    );
    return district?.wards || [];
  }, [selectedDistrict, availableDistricts]);

  // Build full address
  const fullAddress = useMemo(() => {
    const parts = [];
    if (formData.street) parts.push(formData.street);
    if (selectedWard) {
      const ward = availableWards.find((w: Ward) => w.code === selectedWard);
      if (ward) parts.push(ward.name);
    }
    if (selectedDistrict) {
      const district = availableDistricts.find(
        (d: District) => d.code === selectedDistrict,
      );
      if (district) parts.push(district.name);
    }
    if (selectedProvince) {
      const province = vietnamLocations.find(
        (p: Province) => p.code === selectedProvince,
      );
      if (province) parts.push(province.name);
    }
    return parts.join(", ");
  }, [
    formData.street,
    selectedWard,
    selectedDistrict,
    selectedProvince,
    availableWards,
    availableDistricts,
  ]);

  const steps: { key: Step; label: string; icon: string }[] = [
    { key: "info", label: "Thông tin", icon: "1" },
    { key: "pin-map", label: "Ghim bản đồ", icon: "2" },
    { key: "verify", label: "Xác thực GPS", icon: "3" },
    { key: "upload-photos", label: "Tải ảnh", icon: "4" },
    { key: "preview", label: "Xem trước", icon: "5" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex].key);
    }
  };

  const handleGetLocation = () => {
    setIsGettingLocation(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          setLocationData({
            lat: latitude,
            lng: longitude,
            accuracy: Math.round(accuracy),
          });
          setIsGettingLocation(false);
        },
        () => {
          // GPS fallback
          const lat =
            pinnedLocation?.lat || 10.7769 + (Math.random() - 0.5) * 0.005;
          const lng =
            pinnedLocation?.lng || 106.7009 + (Math.random() - 0.5) * 0.005;
          setLocationData({
            lat,
            lng,
            accuracy: 0,
          });
          setIsGettingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 5 - uploadedImages.length);
      const imageUrls = fileArray.map((file) => URL.createObjectURL(file));
      setUploadedImages([...uploadedImages, ...imageUrls]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async () => {
    if (!pinnedLocation) {
      alert("Vui lòng ghim vị trí trên bản đồ trước khi đăng tin!");
      return;
    }

    // Determine verification level
    let verificationLevel: GreenBadgeLevel;
    if (locationData) {
      verificationLevel = "verified";
    } else {
      verificationLevel = "none";
    }

    const newProperty = {
      name: formData.name,
      address: fullAddress,
      price: Number(formData.price) || 0,
      location: [pinnedLocation.lat, pinnedLocation.lng] as [number, number],
      amenities: amenities,
      image: uploadedImages[0] || "",
      area: Number(formData.area) || 0,
      available: true,
      phone: formData.phone,
      ownerName: user?.fullName || user?.username || "Chủ trọ",
      verificationLevel: verificationLevel,
      verifiedAt: locationData ? new Date().toISOString() : undefined,
      locationAccuracy: locationData?.accuracy,
      landlordId: user?.id || "unknown",
      pinInfo: {
        pinnedAt: new Date().toISOString(),
        pinnedBy: user?.id || "unknown",
        note: pinNote || undefined,
      },
    };

    const success = await addProperty(newProperty);

    if (success) {
      const message =
        `✅ Tin đăng đã được gửi thành công!\n\n` +
        `📌 Vị trí ghim: ${pinnedLocation.lat.toFixed(6)}, ${pinnedLocation.lng.toFixed(6)}\n` +
        `🛰️ GPS xác thực: ${locationData ? `${locationData.lat.toFixed(6)}, ${locationData.lng.toFixed(6)} (±${locationData.accuracy}m)` : "Chưa xác thực"}\n` +
        `📷 Số ảnh: ${uploadedImages.length}\n` +
        `✅ Mức xác thực: ${verificationLevel === "verified" ? "Đã xác thực GPS" : "Chưa xác thực"}\n\n` +
        `Tin đăng đã được thêm vào bản đồ!\n\n` +
        `Nhấn OK để xem tin đăng trong Dashboard chủ trọ.`;

      alert(message);
      navigate("/landlord/dashboard");
    } else {
      alert("❌ Có lỗi xảy ra khi đăng tin. Vui lòng thử lại!");
    }
  };

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  const amenityLabels: Record<string, string> = {
    wifi: "📶 WiFi",
    furniture: "🛋️ Nội thất",
    airConditioner: "❄️ Máy lạnh",
    washingMachine: "🧺 Máy giặt",
    refrigerator: "🧊 Tủ lạnh",
    kitchen: "🍳 Bếp",
    tv: "📺 TV",
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="size-5" />
          </Button>
          <Home className="size-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Đăng tin cho thuê trọ
          </h1>
        </div>
      </header>

      {/* Pricing Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">🎉 Nâng cấp tin đăng của bạn!</p>
                <p className="text-xs text-white/90">
                  Chọn gói dịch vụ phù hợp để tiếp cận nhiều người thuê hơn • Từ
                  chỉ 50.000đ/tháng
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/pricing")}
              className="bg-white text-orange-600 hover:bg-gray-100 font-semibold shadow-lg flex-shrink-0"
            >
              Xem gói dịch vụ
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all text-sm
                      ${
                        i < currentStepIndex
                          ? "border-green-600 bg-green-600 text-white"
                          : i === currentStepIndex
                            ? "border-blue-600 bg-blue-50 text-blue-600"
                            : "border-gray-300 bg-white text-gray-400"
                      }`}
                  >
                    {i < currentStepIndex ? (
                      <Check className="size-4" />
                    ) : (
                      s.icon
                    )}
                  </div>
                  <span
                    className={`text-[11px] mt-1 whitespace-nowrap ${i === currentStepIndex ? "text-blue-600 font-semibold" : "text-gray-400"}`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 sm:w-14 mx-1 ${i < currentStepIndex ? "bg-green-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-3xl mx-auto">
          {/* ===== STEP 1: INFO ===== */}
          {step === "info" && (
            <>
              <div className="text-center mb-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Home className="size-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Thông tin phòng trọ
                </h2>
                <p className="text-gray-600">
                  Điền thông tin chi tiết để thu hút người thuê
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tên phòng trọ *
                  </label>
                  <Input
                    type="text"
                    placeholder="VD: Phòng trọ cao cấp gần trường"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Giá thuê (đ/tháng) *
                    </label>
                    <Input
                      type="number"
                      placeholder="3000000"
                      value={formData.price}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Diện tích (m²) *
                    </label>
                    <Input
                      type="number"
                      placeholder="25"
                      value={formData.area}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, area: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Địa chỉ *
                  </label>

                  {/* Province Select */}
                  <div>
                    <Label
                      htmlFor="province"
                      className="text-xs text-gray-600 mb-1"
                    >
                      Tỉnh/Thành phố
                    </Label>
                    <Select
                      value={selectedProvince}
                      onValueChange={(value) => {
                        setSelectedProvince(value);
                        setSelectedDistrict("");
                        setSelectedWard("");
                      }}
                    >
                      <SelectTrigger id="province">
                        <SelectValue placeholder="Chọn tỉnh/thành phố" />
                      </SelectTrigger>
                      <SelectContent>
                        {vietnamLocations.map((province) => (
                          <SelectItem key={province.code} value={province.code}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* District Select */}
                  <div>
                    <Label
                      htmlFor="district"
                      className="text-xs text-gray-600 mb-1"
                    >
                      Quận/Huyện
                    </Label>
                    <Select
                      value={selectedDistrict}
                      onValueChange={(value) => {
                        setSelectedDistrict(value);
                        setSelectedWard("");
                      }}
                      disabled={!selectedProvince}
                    >
                      <SelectTrigger id="district">
                        <SelectValue
                          placeholder={
                            selectedProvince
                              ? "Chọn quận/huyện"
                              : "Chọn tỉnh trước"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDistricts.map((district) => (
                          <SelectItem key={district.code} value={district.code}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ward Select */}
                  <div>
                    <Label
                      htmlFor="ward"
                      className="text-xs text-gray-600 mb-1"
                    >
                      Phường/Xã
                    </Label>
                    <Select
                      value={selectedWard}
                      onValueChange={setSelectedWard}
                      disabled={!selectedDistrict}
                    >
                      <SelectTrigger id="ward">
                        <SelectValue
                          placeholder={
                            selectedDistrict
                              ? "Chọn phường/xã"
                              : "Chọn quận trước"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWards.map((ward) => (
                          <SelectItem key={ward.code} value={ward.code}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Street Address */}
                  <div>
                    <Label
                      htmlFor="street"
                      className="text-xs text-gray-600 mb-1"
                    >
                      Số nhà, tên đường
                    </Label>
                    <Input
                      id="street"
                      type="text"
                      placeholder="VD: Số 123 Đường Láng"
                      value={formData.street}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, street: e.target.value })
                      }
                    />
                  </div>

                  {/* Address Preview */}
                  {fullAddress && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs font-semibold text-blue-900 mb-1">
                        📍 Địa chỉ đầy đủ:
                      </p>
                      <p className="text-sm text-blue-700">{fullAddress}</p>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Địa chỉ sẽ được kiểm tra với GPS ở bước ghim bản đồ
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    className="w-full min-h-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Mô tả về phòng trọ, tiện ích, vị trí..."
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Số điện thoại liên hệ *
                  </label>
                  <Input
                    type="tel"
                    placeholder="0912 345 678"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiện ích
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(amenityLabels).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAmenity(key)}
                        className={`px-3 py-2 rounded-lg border text-sm text-left transition-all ${
                          amenities[key as keyof typeof amenities]
                            ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                >
                  Tiếp tục — Ghim bản đồ
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </>
          )}

          {/* ===== STEP 2: PIN MAP ===== */}
          {step === "pin-map" && (
            <>
              <div className="text-center mb-6">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Pin className="size-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Ghim vị trí trên bản đồ
                </h2>
                <p className="text-gray-600">
                  Xác định vị trí chính xác của phòng trọ để người thuê dễ tìm
                </p>
              </div>

              {/* Why Pin section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <div className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                  <div className="text-2xl mb-1">🎯</div>
                  <p className="text-xs font-semibold text-green-800">
                    Chính xác
                  </p>
                  <p className="text-[11px] text-green-600">
                    Người thuê biết đúng vị trí
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 text-center border border-blue-100">
                  <div className="text-2xl mb-1">⭐</div>
                  <p className="text-xs font-semibold text-blue-800">Ưu tiên</p>
                  <p className="text-[11px] text-blue-600">
                    Hiển thị nổi bật trên bản đồ
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center border border-purple-100">
                  <div className="text-2xl mb-1">🛡️</div>
                  <p className="text-xs font-semibold text-purple-800">
                    Tin cậy
                  </p>
                  <p className="text-[11px] text-purple-600">
                    Badge "Chủ trọ đã ghim"
                  </p>
                </div>
              </div>

              {/* Map component */}
              <LandlordPinMap
                onPinLocation={(lat, lng) => setPinnedLocation({ lat, lng })}
                initialLocation={
                  pinnedLocation
                    ? [pinnedLocation.lat, pinnedLocation.lng]
                    : undefined
                }
              />

              {/* Pin note */}
              {pinnedLocation && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    💬 Ghi chú vị trí{" "}
                    <span className="text-gray-400 font-normal">
                      (tuỳ chọn)
                    </span>
                  </label>
                  <Input
                    type="text"
                    placeholder="VD: Hẻm xe hơi, cổng thứ 2, tầng 3..."
                    value={pinNote}
                    onChange={(e) => setPinNote(e.target.value)}
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {pinnedLocation ? "Tiếp tục — Xác thực GPS" : "Bỏ qua ghim"}
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </>
          )}

          {/* ===== STEP 3: GPS VERIFY ===== */}
          {step === "verify" && (
            <>
              <div className="text-center mb-8">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="size-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Xác thực vị trí GPS
                </h2>
                <p className="text-gray-600">
                  Tăng độ tin cậy cho tin đăng — hệ thống "Trust is King"
                </p>
              </div>

              {/* Trust levels */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <ShieldCheck className="size-5" />
                  Cấp độ xác thực
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Chưa xác thực</p>
                      <p className="text-gray-600">
                        Tin hiển thị mờ, có cảnh báo
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Xác thực SĐT (OTP)
                      </p>
                      <p className="text-gray-600">
                        Sẽ có trong phiên bản đầy đủ
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${locationData ? "bg-green-600 text-white" : "bg-green-200"}`}
                    >
                      <span className="text-xs font-semibold">
                        {locationData ? "✓" : "3"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-green-900">
                        ✓ Xác thực GPS (Khuyến nghị)
                      </p>
                      <p className="text-green-700">
                        Hệ thống ghi vị trí GPS chính xác của bạn
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* GPS Verification */}
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
                {locationData ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                      <MapPin className="size-8 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-2">
                        ✅ Đã xác thực vị trí GPS
                      </h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Vĩ độ: {locationData.lat.toFixed(6)}</p>
                        <p>Kinh độ: {locationData.lng.toFixed(6)}</p>
                        <p className="font-medium text-green-700">
                          Độ chính xác: ±{locationData.accuracy}m
                        </p>
                      </div>
                    </div>
                    {pinnedLocation && (
                      <div className="bg-green-50 rounded-lg p-3 text-sm">
                        <p className="text-green-800">
                          📌 Ghim bản đồ: {pinnedLocation.lat.toFixed(4)},{" "}
                          {pinnedLocation.lng.toFixed(4)}
                        </p>
                        <p className="text-green-600 text-xs mt-1">
                          Khoảng cách GPS ↔ Ghim: ~
                          {Math.round(
                            Math.sqrt(
                              Math.pow(
                                (locationData.lat - pinnedLocation.lat) *
                                  111000,
                                2,
                              ) +
                                Math.pow(
                                  (locationData.lng - pinnedLocation.lng) *
                                    111000 *
                                    Math.cos(
                                      (locationData.lat * Math.PI) / 180,
                                    ),
                                  2,
                                ),
                            ),
                          )}
                          m
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="size-16 text-gray-400 mx-auto" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Xác thực tại phòng trọ
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Hãy đến tại phòng trọ và nhấn nút bên dưới.
                        <br />
                        Hệ thống sẽ ghi nhận vị trí GPS chính xác.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="size-5 mr-2 animate-spin" />
                          Đang lấy vị trí...
                        </>
                      ) : (
                        <>
                          <MapPin className="size-5 mr-2" />
                          Xác thực vị trí GPS
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {locationData ? "Tiếp tục — Tải ảnh" : "Bỏ qua xác thực"}
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </>
          )}

          {/* ===== STEP 4: UPLOAD PHOTOS ===== */}
          {step === "upload-photos" && (
            <>
              <div className="text-center mb-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="size-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Tải ảnh phòng trọ
                </h2>
                <p className="text-gray-600">
                  Tải lên tối đa 5 ảnh để thu hút người thuê
                </p>
              </div>

              {uploadedImages.length > 0 && (
                <div className="mb-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                  {uploadedImages.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Room ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadedImages.length < 5 && (
                <div className="mb-6">
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <ImageIcon className="size-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-semibold text-gray-900 mb-2">
                        Nhấn để tải ảnh lên
                      </h4>
                      <p className="text-sm text-gray-600">
                        Còn lại: {5 - uploadedImages.length} ảnh
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG tối đa 5MB mỗi ảnh
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {!locationData && !pinnedLocation && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Bạn chưa ghim vị trí hoặc xác thực
                    GPS. Tin đăng sẽ có độ tin cậy thấp hơn.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  Xem trước tin đăng
                  <ArrowLeft className="size-4 ml-2 rotate-180" />
                </Button>
              </div>
            </>
          )}

          {/* ===== STEP 5: PREVIEW ===== */}
          {step === "preview" && (
            <>
              <div className="text-center mb-6">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="size-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Xem trước tin đăng
                </h2>
                <p className="text-gray-600">
                  Kiểm tra lại thông tin trước khi đăng
                </p>
              </div>

              {/* Preview Card */}
              <div className="border rounded-xl overflow-hidden mb-6 shadow-sm">
                {/* Image placeholder */}
                <div className="h-44 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  {uploadedImages.length > 0 ? (
                    <img
                      src={uploadedImages[0]}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-500">
                      <ImageIcon className="size-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Chưa có ảnh</p>
                    </div>
                  )}
                </div>

                <div className="p-5 space-y-4">
                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {pinnedLocation && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold border border-orange-200">
                        📌 Chủ trọ đã ghim GPS
                      </span>
                    )}
                    {locationData && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold border border-green-200">
                        🛰️ Xác thực GPS ±{locationData.accuracy}m
                      </span>
                    )}
                    {!pinnedLocation && !locationData && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold border border-gray-200">
                        ⚠️ Chưa xác thực
                      </span>
                    )}
                  </div>

                  {/* Title & Price */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {formData.name || "Phòng trọ chưa đặt tên"}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {fullAddress || "Chưa có địa chỉ"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-3 border-y">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {formData.price
                          ? Number(formData.price).toLocaleString("vi-VN")
                          : "---"}
                        đ
                      </p>
                      <p className="text-xs text-gray-500">/tháng</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        {formData.area || "--"}m²
                      </p>
                      <p className="text-xs text-gray-500">Diện tích</p>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Tiện ích:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(amenities)
                        .filter(([_, v]) => v)
                        .map(([key]) => (
                          <span
                            key={key}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
                          >
                            {amenityLabels[key]}
                          </span>
                        ))}
                      {Object.values(amenities).every((v) => !v) && (
                        <span className="text-xs text-gray-400">
                          Chưa chọn tiện ích
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pin Info */}
                  {pinnedLocation && (
                    <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="size-4 text-orange-600" />
                        <span className="text-sm font-semibold text-orange-900">
                          Vị trí ghim
                        </span>
                      </div>
                      <p className="text-xs text-orange-700">
                        {pinnedLocation.lat.toFixed(6)},{" "}
                        {pinnedLocation.lng.toFixed(6)}
                      </p>
                      {pinNote && (
                        <p className="text-xs text-orange-600 mt-1 italic">
                          "{pinNote}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {formData.description && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Mô tả:
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {formData.description}
                      </p>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Liên hệ:
                    </p>
                    <p className="text-sm text-gray-600">
                      📞 {formData.phone || "Chưa có SĐT"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleBack}
                >
                  <ArrowLeft className="size-4 mr-2" />
                  Chỉnh sửa
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                  size="lg"
                >
                  <Upload className="size-4 mr-2" />
                  Đăng tin
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
