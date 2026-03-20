import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Separator } from "@/app/components/ui/separator";
import { Badge } from "@/app/components/ui/badge";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { VNPayRedirectModal } from "@/app/components/VNPayRedirectModal";
import {
  Check,
  ChevronLeft,
  Shield,
  Lock,
  CreditCard,
  Smartphone,
  Calendar,
  MapPin,
  Home,
  Star,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Users,
} from "lucide-react";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  features: string[];
  badge?: string;
}

const pricingTiers: Record<string, PricingTier> = {
  basic: {
    id: "basic",
    name: "G\u00f3i Basic",
    price: 50000,
    features: [
      "GPS x\u00e1c th\u1ef1c \u0111\u1ed9 ch\u00ednh x\u00e1c 50m",
      "Huy hi\u1ec7u xanh tin c\u1eady",
      "Highlight nh\u1eb9 tr\u00ean b\u1ea3n \u0111\u1ed3",
      "Y\u00eau c\u1ea7u qu\u1ea3n tr\u1ecb vi\u00ean ki\u1ec3m tra",
      "Tin \u0111\u0103ng hi\u1ec3n th\u1ecb 30 ng\u00e0y",
    ],
  },
  standard: {
    id: "standard",
    name: "G\u00f3i Standard",
    price: 100000,
    badge: "Ph\u1ed5 bi\u1ebfn nh\u1ea5t",
    features: [
      "T\u1ea5t c\u1ea3 t\u00ednh n\u0103ng Basic",
      "Video 360\u00b0 ph\u00f2ng tr\u1ecd",
      "Th\u1ed1ng k\u00ea l\u01b0\u1ee3t xem chi ti\u1ebft",
      "\u01afu ti\u00ean top t\u00ecm ki\u1ebfm",
      "Tin \u0111\u0103ng v\u0129nh vi\u1ec5n",
    ],
  },
  pro: {
    id: "pro",
    name: "G\u00f3i Pro",
    price: 200000,
    badge: "Chuy\u00ean nghi\u1ec7p",
    features: [
      "T\u1ea5t c\u1ea3 t\u00ednh n\u0103ng Standard",
      "Boost v\u1ecb tr\u00ed 7 ng\u00e0y/th\u00e1ng",
      "H\u1ed7 tr\u1ee3 \u0111\u0103ng tin Concierge",
      "\u01afu ti\u00ean hi\u1ec3n th\u1ecb cao nh\u1ea5t",
      "Ph\u00e2n t\u00edch n\u00e2ng cao",
    ],
  },
};

const inspectionTypeLabels: Record<string, string> = {
  standard: "Ki\u1ec3m tra ti\u00eau chu\u1ea9n",
  detailed: "Ki\u1ec3m tra chi ti\u1ebft",
  urgent: "Ki\u1ec3m tra kh\u1ea9n c\u1ea5p",
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVNPayModal, setShowVNPayModal] = useState(false);

  // Đọc state từ location trước, fallback sessionStorage nếu bị mất (iframe/sandbox issue)
  const rawState =
    location.state ||
    (() => {
      try {
        const stored = sessionStorage.getItem("inspectionCheckoutData");
        if (stored) {
          const parsed = JSON.parse(stored);
          // Xóa sau khi đọc để tránh dùng lại
          sessionStorage.removeItem("inspectionCheckoutData");
          return parsed;
        }
      } catch (_) {}
      return null;
    })();

  const checkoutType = rawState?.type || "subscription";
  const isInspection = checkoutType === "inspection";
  const inspectionData = rawState?.inspectionData;

  const selectedTierId = rawState?.selectedTier || "standard";
  const billingCycle = rawState?.billingCycle || "monthly";
  const selectedTier = pricingTiers[selectedTierId];

  useEffect(() => {
    // Chỉ redirect nếu KHÔNG có bất kỳ data nào (tránh redirect vô lý)
    if (!isInspection && !selectedTier) {
      navigate("/pricing");
    }
    // Không redirect về admin nếu thiếu inspectionData — hiển thị fallback thay thế
  }, [isInspection, selectedTier, navigate]);

  if (!isInspection && !selectedTier) return null;

  // Nếu là inspection nhưng thiếu data → hiển thị thông báo thay vì redirect
  if (isInspection && !inspectionData) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="size-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy thông tin lịch hẹn
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              Phiên làm việc đã hết hạn hoặc xảy ra lỗi. Vui lòng quay lại và
              điền lại thông tin.
            </p>
            <Button
              onClick={() => navigate("/admin/dashboard")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <ChevronLeft className="size-4 mr-2" />
              Quay lại Admin Dashboard
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const serviceFee = 0;
  const totalAmount = isInspection ? 199000 : selectedTier.price + serviceFee;
  const duration = isInspection
    ? "1 l\u1ea7n ki\u1ec3m tra"
    : billingCycle === "monthly"
      ? "1 th\u00e1ng (30 ng\u00e0y)"
      : "12 th\u00e1ng (1 n\u0103m)";

  const handlePayment = () => {
    if (!agreedToTerms) {
      alert(
        "Vui l\u00f2ng \u0111\u1ed3ng \u00fd v\u1edbi \u0111i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng \u0111\u1ec3 ti\u1ebfp t\u1ee5c",
      );
      return;
    }
    setShowVNPayModal(true);
  };

  const handleVNPayComplete = () => {
    navigate("/payment-success", {
      state: {
        type: checkoutType,
        tier: isInspection
          ? {
              id: "inspection",
              name: "Ki\u1ec3m tra th\u1ef1c \u0111\u1ecba",
              price: 199000,
            }
          : selectedTier,
        amount: totalAmount,
        orderId: "MH" + Date.now(),
        inspectionData: isInspection ? inspectionData : undefined,
      },
    });
  };

  const handleCancelPayment = () => {
    setShowVNPayModal(false);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Progress Stepper */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
                  <Check className="size-5" strokeWidth={3} />
                </div>
                <span className="text-xs font-semibold text-green-600 mt-2 whitespace-nowrap">
                  {isInspection
                    ? "\u0110\u1eb7t l\u1ecbch"
                    : "Ch\u1ecdn g\u00f3i"}
                </span>
              </div>
              <div className="h-0.5 w-20 bg-green-600 mx-2" />
            </div>
            <div className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white animate-pulse">
                  <span className="font-bold">2</span>
                </div>
                <span className="text-xs font-semibold text-blue-600 mt-2 whitespace-nowrap">
                  X\u00e1c nh\u1eadn
                </span>
              </div>
              <div className="h-0.5 w-20 bg-gray-300 mx-2" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                <span className="font-bold">3</span>
              </div>
              <span className="text-xs font-medium text-gray-400 mt-2 whitespace-nowrap">
                Ho\u00e0n t\u1ea5t
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-3 space-y-6">
            <Button
              variant="ghost"
              onClick={() =>
                navigate(isInspection ? "/admin/dashboard" : "/pricing")
              }
              className="mb-4"
            >
              <ChevronLeft className="size-4 mr-2" />
              {isInspection
                ? "Quay l\u1ea1i Admin Dashboard"
                : "Quay l\u1ea1i ch\u1ecdn g\u00f3i"}
            </Button>

            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isInspection
                  ? "Thanh to\u00e1n ki\u1ec3m tra th\u1ef1c \u0111\u1ecba"
                  : "X\u00e1c nh\u1eadn \u0111\u01a1n h\u00e0ng"}
              </h1>
              <p className="text-gray-600">
                {isInspection
                  ? "X\u00e1c nh\u1eadn th\u00f4ng tin l\u1ecbch ki\u1ec3m tra v\u00e0 thanh to\u00e1n"
                  : "Ki\u1ec3m tra th\u00f4ng tin tr\u01b0\u1edbc khi thanh to\u00e1n"}
              </p>
            </div>

            {/* INSPECTION ORDER DETAILS */}
            {isInspection && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl flex items-center gap-2">
                            <ShieldCheck className="size-6 text-blue-600" />
                            Ki\u1ec3m tra th\u1ef1c \u0111\u1ecba
                          </CardTitle>
                          <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                            X\u00e1c th\u1ef1c
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2 text-base">
                          <Calendar className="size-4" />
                          Lo\u1ea1i:{" "}
                          <strong>
                            {inspectionTypeLabels[
                              inspectionData.inspectionType
                            ] || "Ki\u1ec3m tra ti\u00eau chu\u1ea9n"}
                          </strong>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          199.000\u0111
                        </div>
                        <div className="text-sm text-gray-500">/1 l\u1ea7n</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="size-5 text-amber-500" />
                      D\u1ecbch v\u1ee5 bao g\u1ed3m:
                    </h3>
                    <ul className="space-y-2.5">
                      {[
                        "Ki\u1ec3m tra th\u1ef1c t\u1ebf t\u1ea1i \u0111\u1ecba ch\u1ec9 c\u0103n tr\u1ecd",
                        "X\u00e1c th\u1ef1c v\u1ecb tr\u00ed GPS ch\u00ednh x\u00e1c",
                        "Ch\u1ee5p \u1ea3nh & quay video hi\u1ec7n tr\u01b0\u1eddng",
                        "\u0110\u00e1nh gi\u00e1 \u0111i\u1ec1u ki\u1ec7n ph\u00f2ng, an ninh, PCCC",
                        "C\u1ea5p T\u00edch Xanh n\u1ebfu \u0111\u1ea1t y\u00eau c\u1ea7u",
                        "B\u00e1o c\u00e1o chi ti\u1ebft k\u1ebft qu\u1ea3 ki\u1ec3m tra",
                      ].map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                            <Check
                              className="size-3.5 text-blue-600"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 text-sm mb-1">
                          \u0110\u1ed9i ng\u0169 ki\u1ec3m tra s\u1ebd li\u00ean
                          h\u1ec7 x\u00e1c nh\u1eadn
                        </p>
                        <p className="text-xs text-blue-700">
                          Sau khi thanh to\u00e1n, \u0111\u1ed9i ng\u0169
                          s\u1ebd li\u00ean h\u1ec7 trong v\u00f2ng 24h
                          \u0111\u1ec3 x\u00e1c nh\u1eadn l\u1ecbch h\u1eb9n
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="size-5 text-gray-600" />
                      Th\u00f4ng tin l\u1ecbch ki\u1ec3m tra
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-1.5">
                        <Users className="size-3.5" /> Ch\u1ee7 tr\u1ecd
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">
                            H\u1ecd t\u00ean:
                          </span>
                          <span className="ml-2 font-medium text-gray-900">
                            {inspectionData.landlordName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">S\u0110T:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {inspectionData.landlordPhone}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="text-xs font-bold uppercase text-gray-500 mb-3 flex items-center gap-1.5">
                        <MapPin className="size-3.5" /> C\u0103n tr\u1ecd
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">T\u00ean:</span>
                          <span className="ml-2 font-medium text-gray-900">
                            {inspectionData.propertyName}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">
                            S\u1ed1 ph\u00f2ng:
                          </span>
                          <span className="ml-2 font-medium text-gray-900">
                            {inspectionData.roomCount || "N/A"}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-500">
                            \u0110\u1ecba ch\u1ec9:
                          </span>
                          <span className="ml-2 font-medium text-gray-900">
                            {inspectionData.propertyAddress}
                            {inspectionData.district
                              ? `, ${inspectionData.district}`
                              : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <h4 className="text-xs font-bold uppercase text-blue-700 mb-3 flex items-center gap-1.5">
                        <Clock className="size-3.5" /> L\u1ecbch h\u1eb9n
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-blue-600">Ng\u00e0y:</span>
                          <span className="ml-2 font-semibold text-blue-900">
                            {new Date(
                              inspectionData.scheduledDate,
                            ).toLocaleDateString("vi-VN", {
                              weekday: "long",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-blue-600">Gi\u1edd:</span>
                          <span className="ml-2 font-semibold text-blue-900">
                            {inspectionData.scheduledTime}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-blue-600">Lo\u1ea1i:</span>
                          <span className="ml-2 font-semibold text-blue-900">
                            {inspectionTypeLabels[
                              inspectionData.inspectionType
                            ] || "Ki\u1ec3m tra ti\u00eau chu\u1ea9n"}
                          </span>
                        </div>
                      </div>
                      {inspectionData.notes && (
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <span className="text-blue-600 text-sm">
                            Ghi ch\u00fa:
                          </span>
                          <p className="text-sm font-medium text-blue-900 mt-1 italic">
                            &quot;{inspectionData.notes}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* SUBSCRIPTION ORDER DETAILS */}
            {!isInspection && (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-2xl">
                            {selectedTier.name}
                          </CardTitle>
                          {selectedTier.badge && (
                            <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                              {selectedTier.badge}
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="flex items-center gap-2 text-base">
                          <Calendar className="size-4" />
                          Th\u1eddi h\u1ea1n: <strong>{duration}</strong>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {selectedTier.price.toLocaleString("vi-VN")}\u0111
                        </div>
                        <div className="text-sm text-gray-500">/th\u00e1ng</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Star className="size-5 text-amber-500" />
                      T\u00ednh n\u0103ng bao g\u1ed3m:
                    </h3>
                    <ul className="space-y-2.5">
                      {selectedTier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Check
                              className="size-3.5 text-green-600"
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                      <CheckCircle2 className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900 text-sm mb-1">
                          K\u00edch ho\u1ea1t ngay sau thanh to\u00e1n
                        </p>
                        <p className="text-xs text-blue-700">
                          G\u00f3i d\u1ecbch v\u1ee5 s\u1ebd \u0111\u01b0\u1ee3c
                          \u00e1p d\u1ee5ng t\u1ef1 \u0111\u1ed9ng cho tin
                          \u0111\u0103ng c\u1ee7a b\u1ea1n
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Home className="size-5 text-gray-600" />
                      Th\u00f4ng tin tin \u0111\u0103ng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Ph\u00f2ng tr\u1ecd cao c\u1ea5p g\u1ea7n
                          tr\u01b0\u1eddng
                        </p>
                        <p className="text-xs text-gray-500">
                          123 \u0110\u01b0\u1eddng L\u00e1ng, Ph\u01b0\u1eddng
                          L\u00e1ng Th\u01b0\u1ee3ng, Qu\u1eadn \u0110\u1ed1ng
                          \u0110a, H\u00e0 N\u1ed9i
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">
                          Lo\u1ea1i h\u00ecnh:
                        </span>
                        <span className="ml-2 font-medium text-gray-900">
                          Ph\u00f2ng tr\u1ecd
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Di\u1ec7n t\u00edch:
                        </span>
                        <span className="ml-2 font-medium text-gray-900">
                          25m\u00b2
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Gi\u00e1 thu\u00ea:
                        </span>
                        <span className="ml-2 font-medium text-gray-900">
                          3.000.000\u0111/th\u00e1ng
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">
                          Tr\u1ea1ng th\u00e1i:
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-2 border-green-500 text-green-700"
                        >
                          S\u1eb5n s\u00e0ng
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Terms & Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5 text-gray-600" />
                  \u0110i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                  <p>
                    B\u1eb1ng vi\u1ec7c thanh to\u00e1n, b\u1ea1n \u0111\u1ed3ng
                    \u00fd v\u1edbi c\u00e1c \u0111i\u1ec1u kho\u1ea3n sau:
                  </p>
                  <ul className="list-disc list-inside space-y-1.5 ml-2">
                    {isInspection ? (
                      <>
                        <li>
                          Ph\u00ed ki\u1ec3m tra th\u1ef1c \u0111\u1ecba l\u00e0
                          199.000\u0111/l\u1ea7n, kh\u00f4ng ho\u00e0n l\u1ea1i
                          sau khi \u0111\u1ed9i ng\u0169 \u0111\u00e3 x\u00e1c
                          nh\u1eadn l\u1ecbch
                        </li>
                        <li>
                          \u0110\u1ed9i ng\u0169 ki\u1ec3m tra s\u1ebd li\u00ean
                          h\u1ec7 x\u00e1c nh\u1eadn l\u1ecbch h\u1eb9n trong
                          v\u00f2ng 24h
                        </li>
                        <li>
                          K\u1ebft qu\u1ea3 ki\u1ec3m tra s\u1ebd
                          \u0111\u01b0\u1ee3c g\u1eedi b\u00e1o c\u00e1o chi
                          ti\u1ebft trong 48h sau ki\u1ec3m tra
                        </li>
                        <li>
                          N\u1ebfu h\u1ee7y tr\u01b0\u1edbc khi \u0111\u1ed9i
                          ng\u0169 x\u00e1c nh\u1eadn, b\u1ea1n s\u1ebd
                          \u0111\u01b0\u1ee3c ho\u00e0n ti\u1ec1n 100%
                        </li>
                        <li>
                          MapHome cam k\u1ebft b\u1ea3o m\u1eadt th\u00f4ng tin
                          thanh to\u00e1n c\u1ee7a b\u1ea1n
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          G\u00f3i d\u1ecbch v\u1ee5 s\u1ebd \u0111\u01b0\u1ee3c
                          k\u00edch ho\u1ea1t ngay sau khi thanh to\u00e1n
                          th\u00e0nh c\u00f4ng
                        </li>
                        <li>
                          Th\u1eddi h\u1ea1n s\u1eed d\u1ee5ng b\u1eaft
                          \u0111\u1ea7u t\u00ednh t\u1eeb th\u1eddi
                          \u0111i\u1ec3m k\u00edch ho\u1ea1t
                        </li>
                        <li>
                          B\u1ea1n c\u00f3 th\u1ec3 h\u1ee7y \u0111\u0103ng
                          k\u00fd b\u1ea5t k\u1ef3 l\u00fac n\u00e0o trong
                          ph\u1ea7n C\u00e0i \u0111\u1eb7t
                        </li>
                        <li>
                          Ch\u00ednh s\u00e1ch ho\u00e0n ti\u1ec1n 100% trong
                          v\u00f2ng 7 ng\u00e0y \u0111\u1ea7u ti\u00ean
                        </li>
                        <li>
                          MapHome cam k\u1ebft b\u1ea3o m\u1eadt th\u00f4ng tin
                          thanh to\u00e1n c\u1ee7a b\u1ea1n
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                <Separator />

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) =>
                      setAgreedToTerms(checked as boolean)
                    }
                    className="mt-1"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                  >
                    T\u00f4i \u0111\u00e3 \u0111\u1ecdc v\u00e0 \u0111\u1ed3ng
                    \u00fd v\u1edbi{" "}
                    <a
                      href="/policy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      \u0111i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng
                    </a>{" "}
                    v\u00e0{" "}
                    <a
                      href="/policy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      ch\u00ednh s\u00e1ch b\u1ea3o m\u1eadt
                    </a>{" "}
                    c\u1ee7a MapHome
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Payment Panel */}
          <div className="lg:col-span-2">
            <div className="sticky top-4">
              <Card className="border-2 border-gray-200 shadow-lg">
                <CardHeader className="bg-gradient-to-br from-blue-50 to-purple-50 border-b">
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="size-5" />
                    Chi ti\u1ebft thanh to\u00e1n
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between text-sm">
                      <div>
                        <p className="font-medium text-gray-900">
                          {isInspection
                            ? "Ki\u1ec3m tra th\u1ef1c \u0111\u1ecba"
                            : selectedTier.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          \u00d7 {duration}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {totalAmount.toLocaleString("vi-VN")}\u0111
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <p className="text-gray-600">
                        Ph\u00ed d\u1ecbch v\u1ee5
                      </p>
                      <p className="font-medium text-green-600">
                        {serviceFee === 0
                          ? "Mi\u1ec5n ph\u00ed"
                          : serviceFee.toLocaleString("vi-VN") + "\u0111"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-gray-900">
                      T\u1ed5ng c\u1ed9ng
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalAmount.toLocaleString("vi-VN")}\u0111
                    </p>
                  </div>

                  <Separator />

                  <Button
                    onClick={handlePayment}
                    disabled={!agreedToTerms || isProcessing}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        \u0110ang x\u1eed l\u00fd...
                      </>
                    ) : (
                      <>
                        <Lock className="size-4 mr-2" />
                        Thanh to\u00e1n qua VNPay
                      </>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 py-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                        <span className="text-white font-bold text-xs">VN</span>
                      </div>
                      <span className="font-bold text-blue-900">VNPay</span>
                    </div>
                    <Lock className="size-4 text-blue-600" />
                  </div>

                  <p className="text-xs text-center text-gray-500 leading-relaxed">
                    B\u1ea1n s\u1ebd \u0111\u01b0\u1ee3c chuy\u1ec3n
                    \u0111\u1ebfn c\u1ed5ng thanh to\u00e1n VNPay an to\u00e0n
                    \u0111\u1ec3 ho\u00e0n t\u1ea5t giao d\u1ecbch
                  </p>

                  <Separator />

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-3 text-center">
                      Ph\u01b0\u01a1ng th\u1ee9c thanh to\u00e1n
                      \u0111\u01b0\u1ee3c ch\u1ea5p nh\u1eadn
                    </p>
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <Smartphone className="size-6 text-gray-600 mx-auto mb-1" />
                          <p className="text-[10px] text-gray-600 font-medium">
                            QR Pay
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <CreditCard className="size-6 text-gray-600 mx-auto mb-1" />
                          <p className="text-[10px] text-gray-600 font-medium">
                            ATM
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-700 mb-1">
                            VISA
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-6 h-6 rounded-full bg-pink-600 mx-auto mb-1 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">
                              M
                            </span>
                          </div>
                          <p className="text-[10px] text-gray-600 font-medium">
                            MoMo
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <Shield className="size-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-green-800 leading-relaxed">
                      <strong>B\u1ea3o m\u1eadt 100%.</strong> M\u1ecdi giao
                      d\u1ecbch \u0111\u01b0\u1ee3c m\u00e3 h\u00f3a SSL
                      256-bit. MapHome kh\u00f4ng l\u01b0u tr\u1eef th\u00f4ng
                      tin th\u1ebb c\u1ee7a b\u1ea1n.
                    </p>
                  </div>

                  {!agreedToTerms && (
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <AlertCircle className="size-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">
                        Vui l\u00f2ng \u0111\u1ed3ng \u00fd v\u1edbi
                        \u0111i\u1ec1u kho\u1ea3n s\u1eed d\u1ee5ng \u1edf
                        ph\u1ea7n b\u00ean tr\u00e1i \u0111\u1ec3 ti\u1ebfp
                        t\u1ee5c
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="mt-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="size-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-900 mb-1">
                        \u0110\u1ea3m b\u1ea3o ho\u00e0n ti\u1ec1n 100%
                      </h4>
                      <p className="text-sm text-green-700 leading-relaxed">
                        {isInspection
                          ? "N\u1ebfu h\u1ee7y tr\u01b0\u1edbc khi \u0111\u1ed9i ng\u0169 x\u00e1c nh\u1eadn l\u1ecbch, b\u1ea1n s\u1ebd \u0111\u01b0\u1ee3c ho\u00e0n l\u1ea1i to\u00e0n b\u1ed9 s\u1ed1 ti\u1ec1n."
                          : "N\u1ebfu kh\u00f4ng h\u00e0i l\u00f2ng trong 7 ng\u00e0y \u0111\u1ea7u, b\u1ea1n s\u1ebd \u0111\u01b0\u1ee3c ho\u00e0n l\u1ea1i to\u00e0n b\u1ed9 s\u1ed1 ti\u1ec1n."}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <VNPayRedirectModal
        isOpen={showVNPayModal}
        onCancel={handleCancelPayment}
        onComplete={handleVNPayComplete}
      />
    </div>
  );
}
