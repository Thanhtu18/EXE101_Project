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
  ImageIcon,
  Check,
  Pin,
  Sparkles,
  CalendarDays,
  FileText,
  Map as MapIcon,
  ChevronRight,
  TrendingUp,
  User,
  Phone,
  Wifi,
  Wind,
  Refrigerator,
  UtensilsCrossed,
  Armchair,
  Waves,
  Tv,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { LandlordPinMap } from "@/app/components/LandlordPinMap";
import { useProperties } from "@/app/contexts/PropertiesContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { toast } from "sonner";
import { RentalProperty, GreenBadgeLevel } from "@/app/components/types";
import { vietnamLocations, Province, District, Ward } from "@/app/data/vietnamLocations";
import { amenityLabels, amenityMeta } from "@/app/constants/amenities";


type Step = "info" | "pin-map" | "verify" | "upload-photos" | "preview";

export function PostRoomPage() {
  const navigate = useNavigate();
  const { addProperty } = useProperties();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("info");
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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

  const [selectedProvince, setSelectedProvince] = useState("HCM");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const availableDistricts = useMemo(() => {
    if (!selectedProvince) return [];
    const province = vietnamLocations.find((p: Province) => p.code === selectedProvince);
    return province?.districts || [];
  }, [selectedProvince]);

  const availableWards = useMemo(() => {
    if (!selectedDistrict) return [];
    const district = availableDistricts.find(
      (d: District) => d.code === selectedDistrict,
    );
    return district?.wards || [];
  }, [selectedDistrict, availableDistricts]);

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

  const steps: { key: Step; label: string; icon: any }[] = [
    { key: "info", label: "Thông tin", icon: FileText },
    { key: "pin-map", label: "Ghim bản đồ", icon: MapIcon },
    { key: "verify", label: "Xác thực GPS", icon: ShieldCheck },
    { key: "upload-photos", label: "Tải ảnh", icon: Camera },
    { key: "preview", label: "Xem trước", icon: Sparkles },
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
          toast.success("Đã xác thực vị trí thành công! 📍");
        },
        () => {
          setIsGettingLocation(false);
          toast.error("Không thể lấy vị trí GPS. Vui lòng cho phép truy cập vị trí.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
      );
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).slice(0, 5 - uploadedImages.length);
      setIsUploading(true);
      const token = localStorage.getItem("token");
      const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const formDataUpload = new FormData();
        formDataUpload.append("image", file);
        try {
          const res = await fetch(`${API_BASE}/api/uploads/single`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formDataUpload,
          });
          if (res.ok) {
            const data = await res.json();
            uploadedUrls.push(data.url);
          } else {
            toast.error("Lỗi khi tải ảnh lên " + file.name);
          }
        } catch (err) {
          console.error("Upload error:", err);
          toast.error("Lỗi kết nối khi tải ảnh " + file.name);
        }
      }

      setUploadedImages((prev) => [...prev, ...uploadedUrls]);
      setIsUploading(false);
      if (uploadedUrls.length > 0) {
        toast.success(`Đã tải lên ${uploadedUrls.length} ảnh thành công! ✨`);
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleFinalSubmit = async () => {
    if (!pinnedLocation) {
      toast.error("Vui lòng ghim vị trí trên bản đồ trước khi đăng tin! 📍");
      return;
    }
    let verificationLevel: GreenBadgeLevel = locationData ? "verified" : "none";
    const newProperty = {
      name: formData.name,
      address: fullAddress,
      price: Number(formData.price) || 0,
      location: [pinnedLocation.lat, pinnedLocation.lng] as [number, number],
      amenities: amenities,
      image: uploadedImages[0] || "",
      images: uploadedImages,
      area: Number(formData.area) || 0,
      description: formData.description,
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
      toast.success("Đăng tin thành công! ✨");
      navigate("/landlord/dashboard");
    }
  };

  const toggleAmenity = (key: string) => {
    setAmenities((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };


  return (
    <div className="min-h-screen w-screen bg-[#f8fafc] flex flex-col relative overflow-hidden font-sans">
      {/* Background Aura - Dynamic & Smooth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-200/30 rounded-full blur-[150px] animate-pulse duration-[10s]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/30 rounded-full blur-[150px] animate-pulse duration-[8s] delay-1000" />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/40 backdrop-blur-xl border-b border-white/40 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/")}
              className="rounded-2xl hover:bg-white/50 transition-all"
            >
              <ArrowLeft className="size-6 text-gray-700" />
            </Button>
            <div className="flex items-center gap-3">
               <div className="p-3 bg-gradient-to-br from-emerald-500 to-indigo-600 rounded-2xl shadow-xl shadow-emerald-100/50">
                  <Home className="size-6 text-white" />
               </div>
               <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">MapHome</h1>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mt-1 ml-0.5">Kênh Đăng Tin</p>
               </div>
            </div>
          </div>
          
          <Button
            onClick={() => navigate("/pricing")}
             className="bg-white/60 backdrop-blur-md border border-white/60 text-slate-900 hover:bg-emerald-600 hover:text-white px-6 py-6 rounded-2xl font-black shadow-xl transition-all group border-none"
          >
            <TrendingUp className="size-5 mr-2 group-hover:scale-110 transition-transform" />
            Gói dịch vụ
          </Button>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="relative z-40 bg-white/20 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-[18px] z-0 rounded-full" />
            <motion.div 
               className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-400 to-indigo-500 -translate-y-[18px] z-0 rounded-full shadow-[0_0_15px_rgba(52,211,153,0.3)]"
               initial={{ width: "0%" }}
               animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
               transition={{ duration: 0.8, ease: "circOut" }}
            />

            {steps.map((s, i) => {
              const StepIcon = s.icon;
              const isActive = i === currentStepIndex;
              const isCompleted = i < currentStepIndex;
              
              return (
                <div key={s.key} className="relative z-10 flex flex-col items-center group">
                  <motion.div
                    animate={{
                      scale: isActive ? 1.3 : 1,
                      backgroundColor: isCompleted ? "#10b981" : isActive ? "#4f46e5" : "#fff",
                      borderColor: isCompleted ? "#10b981" : isActive ? "#4f46e5" : "#f1f5f9",
                      boxShadow: isActive ? "0 10px 25px -10px rgba(79, 70, 229, 0.5)" : "none"
                    }}
                    className={`size-12 rounded-2xl flex items-center justify-center border-4 transition-all shadow-xl`}
                  >
                    {isCompleted ? (
                      <Check className="size-6 text-white" />
                    ) : (
                      <StepIcon className={`size-6 ${isActive ? "text-white" : "text-slate-300"}`} />
                    )}
                  </motion.div>
                  <span className={`text-[9px] mt-4 font-black uppercase tracking-[0.2em] transition-all ${isActive ? "text-indigo-600 translate-y-1" : "text-slate-400"}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-30 flex-1 px-4 py-12 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-2xl overflow-hidden"
            >
          {/* ===== STEP 1: INFO ===== */}
          {step === "info" && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.08 } }
              }}
              className="p-8 md:p-14 space-y-12"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100"
              >
                <div className="flex gap-5 items-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center shadow-inner">
                    <Home className="size-8 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Thông tin cơ bản</h2>
                    <p className="text-slate-500 font-medium">Bắt đầu bằng những thông tin quan trọng nhất</p>
                  </div>
                </div>
                <div className="px-5 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Đang chỉnh sửa</span>
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                <div className="space-y-8">
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tên phòng trọ / Căn hộ *</Label>
                    <Input
                      placeholder="VD: Cửa sổ trời Rooftop - Quận 1"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="h-16 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all text-lg font-bold bg-white/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Giá thuê (đ/tháng) *</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="3000000"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="h-16 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all text-lg font-black bg-white/50 pl-12"
                        />
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">₫</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Diện tích (m²) *</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="25"
                          value={formData.area}
                          onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                          className="h-16 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all text-lg font-black bg-white/50 pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">m²</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Mô tả chi tiết</Label>
                    <textarea
                      placeholder="Mô tả về không gian, tiện ích xung quanh, giờ giấc tự do..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full min-h-[160px] p-5 rounded-[2rem] border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all text-base font-medium bg-white/50 resize-none outline-none shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-8 bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 text-slate-900 mb-2">
                       <MapPin className="size-5 text-indigo-500" />
                       <span className="font-black text-sm uppercase tracking-widest">Địa chỉ & Liên hệ</span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-500 ml-1">Tỉnh / Thành phố</Label>
                        <Select
                          value={selectedProvince}
                          onValueChange={(value) => {
                            setSelectedProvince(value);
                            setSelectedDistrict("");
                            setSelectedWard("");
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                            <SelectValue placeholder="Chọn tỉnh/thành phố" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                            {vietnamLocations.map((province) => (
                              <SelectItem key={province.code} value={province.code} className="font-bold py-3">
                                {province.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-500 ml-1">Quận/Huyện</Label>
                        <Select
                          value={selectedDistrict}
                          onValueChange={(value) => {
                            setSelectedDistrict(value);
                            setSelectedWard("");
                          }}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                            <SelectValue placeholder="Chọn quận/huyện" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                            {availableDistricts.map((district) => (
                              <SelectItem key={district.code} value={district.code} className="font-bold py-3">
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-500 ml-1">Phường/Xã</Label>
                        <Select
                          value={selectedWard}
                          onValueChange={setSelectedWard}
                          disabled={!selectedDistrict}
                        >
                          <SelectTrigger className="h-14 rounded-xl border-slate-200 bg-white font-bold outline-none focus:ring-2 focus:ring-indigo-100">
                            <SelectValue placeholder="Chọn phường/xã" />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                            {availableWards.map((ward) => (
                              <SelectItem key={ward.code} value={ward.code} className="font-bold py-3">
                                {ward.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold text-slate-500 ml-1">Số nhà, tên đường</Label>
                        <Input
                          placeholder="VD: Số 123 Đường Láng"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="h-14 rounded-xl border-slate-200 bg-white font-bold focus:ring-2 focus:ring-indigo-100"
                        />
                      </div>
                    </div>

                    {fullAddress && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-br from-indigo-900/95 to-slate-900/95 backdrop-blur-xl text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group border border-emerald-500/20"
                      >
                        <div className="absolute top-[-10%] right-[-5%] p-4 opacity-10 transform group-hover:scale-150 group-hover:rotate-[30deg] transition-transform duration-1000">
                          <Pin className="size-32 text-emerald-400" />
                        </div>
                        <div className="relative z-10 flex items-start gap-4">
                           <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/30">
                              <MapPin className="size-6 text-emerald-400" />
                           </div>
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-2 flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                 Địa chỉ hiển thị
                              </p>
                              <p className="text-xl font-black leading-tight tracking-tight pr-8">{fullAddress}</p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="space-y-4 pt-4 border-t border-slate-200">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Số điện thoại liên hệ *</Label>
                      <Input
                        type="tel"
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="h-16 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all text-xl font-black bg-white/50"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-emerald-100 rounded-2xl">
                         <Check className="size-6 text-emerald-600" />
                      </div>
                      <h3 className="font-black text-slate-900 uppercase tracking-[0.2em] text-sm">Tiện ích kèm theo</h3>
                   </div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Đã chọn: {Object.values(amenities).filter(Boolean).length}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(amenityMeta).map(([key, meta]) => {
                    const Icon = meta.icon;
                    const isActive = amenities[key as keyof typeof amenities];
                    return (
                      <button
                        key={key}
                        onClick={() => toggleAmenity(key)}
                        className={`group relative p-6 rounded-[2rem] flex flex-col items-center justify-center gap-4 transition-all duration-300 border-2 active:scale-95 ${
                          isActive
                            ? "bg-emerald-600 border-emerald-600 shadow-2xl shadow-emerald-100/50 text-white"
                            : "bg-white border-slate-100 hover:border-indigo-100 text-slate-400 hover:text-slate-900"
                        }`}
                      >
                        <div className={`p-4 rounded-2xl transition-all duration-300 ${
                          isActive ? "bg-white/20 scale-110" : "bg-slate-50 group-hover:bg-indigo-50"
                        }`}>
                           <Icon className={`size-7 transition-all ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
                        </div>
                        <div className="text-center">
                           <p className={`text-[11px] font-black uppercase tracking-tight leading-tight px-2 ${isActive ? "text-white" : "text-slate-950"}`}>
                              {meta.label}
                           </p>
                        </div>
                        {isActive && (
                           <motion.div 
                             layoutId="active-badge"
                             className="absolute top-3 right-3 w-3 h-3 bg-white rounded-full shadow-lg"
                           />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                className="pt-10 flex flex-col gap-4"
              >
                <Button
                  onClick={handleNext}
                  className="w-full h-20 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-[1.8rem] text-xl font-black shadow-2xl shadow-emerald-100 transition-all hover:translate-y-[-4px] group border-none"
                >
                  Ghim bản đồ để tiếp tục
                  <ChevronRight className="size-6 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bước 1/5: Thông tin tổng quan</p>
              </motion.div>
            </motion.div>
          )}

          {/* ===== STEP 2: PIN MAP ===== */}
          {step === "pin-map" && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              className="p-8 md:p-14 space-y-10"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="text-center space-y-3"
              >
                <div className="bg-orange-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                  <Pin className="size-10 text-orange-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Ghim vị trí chính xác</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  Di chuyển bản đồ để ghim đúng vị trí phòng trọ của bạn. Đây là thông tin quan trọng nhất để khách hàng tìm thấy bạn.
                </p>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-6"
              >
                {[
                  { icon: "🎯", title: "Chính xác", desc: "Giảm 90% cuộc gọi hỏi đường", color: "bg-emerald-50 text-emerald-700" },
                  { icon: "⭐", title: "Ưu tiên", desc: "Hiển thị nổi bật trên bản đồ", color: "bg-indigo-50 text-indigo-700" },
                  { icon: "🛡️", title: "Tin cậy", desc: "Đạt chuẩn Trust-Score cao", color: "bg-purple-50 text-purple-700" }
                ].map((item, i) => (
                  <div key={i} className={`${item.color} rounded-3xl p-5 border border-white/50 shadow-sm transition-all hover:translate-y-[-2px]`}>
                    <div className="text-3xl mb-3">{item.icon}</div>
                    <p className="font-black text-sm uppercase tracking-tighter mb-1">{item.title}</p>
                    <p className="text-[11px] font-bold opacity-70 leading-tight">{item.desc}</p>
                  </div>
                ))}
              </motion.div>

              <div className="relative rounded-[2.5rem] overflow-hidden border-8 border-white/60 shadow-2xl h-[450px]">
                <LandlordPinMap
                  onPinLocation={(lat, lng) => setPinnedLocation({ lat, lng })}
                  initialLocation={
                    pinnedLocation
                      ? [pinnedLocation.lat, pinnedLocation.lng]
                      : undefined
                  }
                />
                
                {pinnedLocation && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-xl text-white p-6 rounded-3xl border border-white/20 shadow-2xl flex items-center justify-between"
                   >
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500 rounded-2xl animate-pulse">
                           <Target className="size-6 text-white" />
                        </div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-widest text-emerald-400">Đã xác định tọa độ</p>
                           <p className="text-sm font-bold opacity-80">{pinnedLocation.lat.toFixed(6)}, {pinnedLocation.lng.toFixed(6)}</p>
                        </div>
                     </div>
                     <div className="hidden md:block text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-50 mb-1">Trạng thái ghim</p>
                        <p className="text-xs font-bold">Vị trí đã sẵn sàng ✅</p>
                     </div>
                   </motion.div>
                )}
              </div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.98 },
                  show: { opacity: 1, scale: 1 }
                }}
                className="space-y-4"
              >
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">💬 Ghi chú chỉ dẫn (Tuỳ chọn)</Label>
                <Input
                  placeholder="VD: Đi thẳng hẻm 12, ngôi nhà màu xanh cuối đường..."
                  value={pinNote}
                  onChange={(e) => setPinNote(e.target.value)}
                  className="h-16 rounded-2xl border-2 border-slate-100 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100/50 transition-all text-lg font-bold bg-white/50"
                />
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="flex gap-4 pt-6"
              >
                <Button variant="ghost" onClick={handleBack} className="flex-1 h-20 rounded-[1.8rem] font-black text-slate-400 hover:text-slate-900 text-lg">
                   <ArrowLeft className="size-6 mr-2" /> Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-[2] h-20 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-[1.8rem] text-xl font-black shadow-2xl shadow-emerald-100 transition-all hover:translate-y-[-4px] group border-none"
                >
                  Xác thực GPS & Tiếp tục
                  <ChevronRight className="size-6 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ===== STEP 3: GPS VERIFY ===== */}
          {step === "verify" && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              className="p-8 md:p-14 space-y-10"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="text-center space-y-3"
              >
                <div className="bg-emerald-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-[-3deg]">
                  <ShieldCheck className="size-10 text-emerald-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Xác thực GPS "Trust Score"</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  Tăng độ tin cậy tuyệt đối cho tin đăng của bạn. Tin đăng có GPS được ưu tiên hiển thị gấp 5 lần.
                </p>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-8"
              >
                <h3 className="font-black text-indigo-900 mb-6 flex items-center gap-3 uppercase tracking-widest text-sm">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <ShieldCheck className="size-5" />
                  </div>
                  Lộ trình xác thực tin cậy
                </h3>
                <div className="space-y-6">
                  {[
                    { step: "1", title: "Chưa xác thực", desc: "Tin hiển thị mờ, có nhãn cảnh báo", color: "bg-slate-200" },
                    { step: "2", title: "Xác thực SĐT (OTP)", desc: "Xác minh chủ sở hữu số điện thoại", color: "bg-blue-200" },
                    { step: locationData ? "✓" : "3", title: "Xác thực GPS (Hoàn tất)", desc: "Ghi nhận vị trí thực tế tại căn phòng", color: locationData ? "bg-emerald-500 text-white" : "bg-emerald-200", highlight: !!locationData }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-start gap-4 p-4 rounded-2xl transition-all ${item.highlight ? "bg-white shadow-xl scale-[1.02]" : "opacity-60"}`}>
                      <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 font-black`}>
                        {item.step}
                      </div>
                      <div>
                        <p className={`font-black uppercase tracking-tighter ${item.highlight ? "text-emerald-600" : "text-slate-900"}`}>{item.title}</p>
                        <p className="text-xs font-bold text-slate-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                className="bg-white border-4 border-dashed border-slate-100 rounded-[3rem] p-12 text-center shadow-inner"
              >
                {locationData ? (
                  <div className="space-y-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 flex items-center justify-center mx-auto shadow-xl">
                      <MapPin className="size-12 text-emerald-600 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-emerald-900 mb-2">
                        Xác thực thành công!
                      </h4>
                      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mt-6">
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Độ chính xác</p>
                          <p className="text-lg font-black text-slate-900">±{locationData.accuracy}m</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tọa độ</p>
                          <p className="text-sm font-black text-slate-900">{locationData.lat.toFixed(4)}, {locationData.lng.toFixed(4)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mx-auto">
                      <Camera className="size-12 text-slate-300" />
                    </div>
                    <div className="max-w-sm mx-auto">
                      <h4 className="text-xl font-black text-slate-900 mb-3">Đứng tại phòng trọ</h4>
                      <p className="text-sm font-bold text-slate-500 leading-relaxed">
                        Vui lòng cho phép MapHome truy cập vị trí của bạn để hoàn tất chứng chỉ xác thực GPS.
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={isGettingLocation}
                      className="h-20 px-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-lg font-black shadow-2xl shadow-emerald-100 transition-all active:scale-95 border-none"
                    >
                      {isGettingLocation ? (
                        <>
                          <Loader2 className="size-6 mr-3 animate-spin" />
                          Đang định vị...
                        </>
                      ) : (
                        <>
                          <MapPin className="size-6 mr-3" />
                          Xác thực GPS ngay
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="flex gap-4 pt-6"
              >
                <Button variant="ghost" onClick={handleBack} className="flex-1 h-20 rounded-[1.8rem] font-black text-slate-400 hover:text-slate-900 text-lg">
                   <ArrowLeft className="size-6 mr-2" /> Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-[2] h-20 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-[1.8rem] text-xl font-black shadow-2xl shadow-emerald-100 transition-all hover:translate-y-[-4px] group border-none"
                >
                  {locationData ? "Tiếp tục — Tải ảnh" : "Bỏ qua xác thực"}
                  <ArrowLeft className="size-6 ml-2 rotate-180 group-hover:-translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ===== STEP 4: UPLOAD PHOTOS ===== */}
          {step === "upload-photos" && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              className="p-8 md:p-14 space-y-12"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="text-center space-y-3"
              >
                <div className="bg-indigo-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-6">
                  <Camera className="size-10 text-indigo-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Hình ảnh thực tế</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  Tải lên ít nhất 3 hình ảnh rõ nét. Hình ảnh đẹp giúp tăng tỉ lệ chốt đơn lên 300%.
                </p>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="grid grid-cols-2 md:grid-cols-5 gap-6"
              >
                {uploadedImages.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    className="aspect-square rounded-3xl overflow-hidden relative border-4 border-white shadow-xl group"
                  >
                    <img src={img} alt="Upload" className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-2 bg-rose-500/90 backdrop-blur-md text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-600 scale-75 group-hover:scale-100"
                    >
                      <X className="size-4" />
                    </button>
                    {idx === 0 && (
                       <div className="absolute bottom-2 left-2 px-3 py-1 bg-indigo-950/80 backdrop-blur-md text-[8px] font-black text-white rounded-lg uppercase tracking-widest border border-white/20">
                          🌟 Ảnh bìa
                       </div>
                    )}
                  </motion.div>
                ))}
                
                {uploadedImages.length < 5 && (
                  <label className={`aspect-square rounded-[2.5rem] border-4 border-dashed border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:border-indigo-400 hover:bg-indigo-50 group ${isUploading ? "opacity-50 pointer-events-none" : ""}`}>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                    <div className="p-4 bg-white rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                       {isUploading ? <Loader2 className="size-8 text-indigo-600 animate-spin" /> : <Upload className="size-8 text-indigo-600" />}
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{isUploading ? "Đang tải..." : "Tải thêm ảnh"}</span>
                  </label>
                )}
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="bg-indigo-50/50 border border-indigo-100 rounded-[2.5rem] p-8 flex items-start gap-6"
              >
                 <div className="p-4 bg-white rounded-2xl shadow-xl">
                    <Sparkles className="size-8 text-amber-500" />
                 </div>
                 <div>
                    <h4 className="font-black text-indigo-900 uppercase tracking-tight mb-2">Bí kíp chụp ảnh nghìn đơn</h4>
                    <ul className="text-sm text-indigo-700 font-medium space-y-2 opacity-80">
                       <li>• Chụp vào ban ngày để có ánh sáng tự nhiên tốt nhất</li>
                       <li>• Sắp xếp phòng gọn gàng, sạch sẽ tạo thiện cảm</li>
                       <li>• Chụp đủ các góc: Giường, nhà vệ sinh, ban công...</li>
                    </ul>
                 </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="flex gap-4 pt-6"
              >
                <Button variant="ghost" onClick={handleBack} className="flex-1 h-20 rounded-[1.8rem] font-black text-slate-400 hover:text-slate-900 text-lg">
                   <ArrowLeft className="size-6 mr-2" /> Quay lại
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-[2] h-20 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white rounded-[1.8rem] text-xl font-black shadow-2xl shadow-emerald-100 transition-all hover:translate-y-[-4px] group border-none"
                >
                  Xem trước tin đăng
                  <ChevronRight className="size-6 ml-2 group-hover:translate-x-2 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}

          {/* ===== STEP 5: PREVIEW ===== */}
          {step === "preview" && (
            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              className="p-8 md:p-14 space-y-12"
            >
              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="text-center space-y-3"
              >
                <div className="bg-indigo-100 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-xl rotate-[-6deg]">
                  <Sparkles className="size-10 text-indigo-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Kiệt tác của bạn</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                  Kiểm tra lại tất cả thông tin lần cuối trước khi đưa tin đăng của bạn lên bản đồ MapHome.
                </p>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  show: { opacity: 1, scale: 1 }
                }}
                className="max-w-2xl mx-auto"
              >
                 <div className="bg-white rounded-[3rem] border-8 border-white shadow-2xl overflow-hidden relative group">
                    <div className="aspect-[16/10] relative">
                        <img 
                          src={uploadedImages.length > 0 ? (uploadedImages[0].startsWith("http") ? uploadedImages[0] : (import.meta as any).env?.VITE_API_BASE + uploadedImages[0]) : "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop"} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-[2000ms]" 
                          alt="Preview"
                        />
                       <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-transparent to-transparent" />
                       <div className="absolute bottom-8 left-8 right-8 text-white">
                          <div className="flex items-center gap-2 mb-3">
                             {locationData && (
                                <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                   <ShieldCheck className="size-3" /> Đã xác thực GPS
                                </span>
                             )}
                             <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-white/20">
                                {formData.area} m²
                             </span>
                          </div>
                          <h3 className="text-4xl font-black leading-tight mb-2">{formData.name || "Tên phòng trọ"}</h3>
                          <p className="text-xl font-black text-emerald-400">{(Number(formData.price) || 0).toLocaleString()} <span className="text-sm">₫/tháng</span></p>
                       </div>
                    </div>
                    
                    <div className="p-10 space-y-10">
                       <div className="flex items-start gap-4">
                          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-500 shadow-sm">
                             <MapPin className="size-6" />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Vị trí thực tế</p>
                             <p className="text-lg font-black text-slate-900">{fullAddress}</p>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-8">
                          <div className="flex items-start gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-500 shadow-sm">
                               <User className="size-6" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Người phụ trách</p>
                               <p className="text-lg font-black text-slate-900">{user?.fullName || "Chủ trọ"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-4">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-indigo-500 shadow-sm">
                               <Phone className="size-6" />
                            </div>
                            <div>
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Hotline liên hệ</p>
                               <p className="text-lg font-black text-slate-900">{formData.phone}</p>
                            </div>
                          </div>
                       </div>
                       
                       <div className="space-y-4 pt-6 border-t border-slate-100">
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Tiện ích đi kèm</p>
                          <div className="flex flex-wrap gap-3">
                             {Object.entries(amenities).filter(([_, v]) => v).map(([k, _]) => (
                                <span key={k} className="px-5 py-2.5 bg-indigo-50/50 rounded-2xl text-[10px] font-black text-indigo-700 uppercase tracking-widest border border-indigo-100 flex items-center gap-2">
                                   <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                                   {amenityLabels[k as keyof typeof amenityLabels]}
                                </span>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </motion.div>

              <motion.div 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  show: { opacity: 1, y: 0 }
                }}
                className="flex gap-4 pt-6"
              >
                <Button variant="ghost" onClick={handleBack} className="flex-1 h-20 rounded-[1.8rem] font-black text-slate-400 hover:text-slate-900 text-lg">
                   <ArrowLeft className="size-6 mr-2" /> Quay lại
                </Button>
                <Button
                  onClick={handleFinalSubmit}
                  className="flex-[3] h-24 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-[2rem] text-2xl font-black shadow-2xl shadow-emerald-100 transition-all hover:scale-[1.02] active:scale-95 group border-none"
                >
                  XUẤT BẢN NGAY LẬP TỨC
                  <Check className="size-8 ml-3 group-hover:rotate-12 transition-transform" />
                </Button>
              </motion.div>
            </motion.div>
          )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function Target(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
