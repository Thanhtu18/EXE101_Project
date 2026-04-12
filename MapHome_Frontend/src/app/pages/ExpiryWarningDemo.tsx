import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { ExpiryWarningModal } from "@/app/components/ExpiryWarningModal";
import { formatDateVietnamese } from "@/app/utils/dateUtils";
import {
  AlertCircle,
  X,
  MapPin,
  DollarSign,
  Maximize,
  Eye,
  Star,
  Clock,
} from "lucide-react";

/**
 * Demo page showing all 3 expiry warning states:
 * 1. Top sticky banner
 * 2. Listing card with warning
 * 3. Modal popup with countdown
 */
export function ExpiryWarningDemo() {
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(true);

  const expiryDate = "2025-01-17";
  const daysRemaining = 3;
  const planName = "Gói Standard";
  const renewalPrice = 100000;

  const handleRenew = () => {
    setShowModal(false);
    navigate("/pricing");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. TOP BANNER - Sticky warning */}
      {showBanner && (
        <div className="sticky top-0 z-40 bg-gradient-to-r from-amber-100 to-orange-100 border-b-2 border-amber-300 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Left: Warning icon + text */}
              <div className="flex items-center gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-amber-200 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="size-6 text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold text-amber-900 text-base">
                    Gói Standard của bạn sẽ hết hạn sau {daysRemaining} ngày (
                    {formatDateVietnamese(expiryDate)})
                  </p>
                  <p className="text-sm text-amber-800">
                    Gia hạn ngay để tiếp tục sử dụng dịch vụ và tránh tin đăng
                    bị gỡ
                  </p>
                </div>
              </div>

              {/* Right: CTA button + Close */}
              <div className="flex items-center gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-700 to-orange-700 hover:from-amber-800 hover:to-orange-800 text-white font-bold shadow-lg"
                  onClick={() => navigate("/pricing")}
                >
                  Gia hạn ngay
                </Button>
                <button
                  onClick={() => setShowBanner(false)}
                  className="w-8 h-8 rounded-full hover:bg-amber-200 flex items-center justify-center text-amber-700 hover:text-amber-900 transition-colors"
                  aria-label="Đóng"
                >
                  <X className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Expiry Warning States Demo
          </h1>
          <p className="text-gray-600">
            Hiển thị tất cả 3 trạng thái cảnh báo hết hạn: Banner, Listing Card,
            và Modal
          </p>
        </div>

        {/* Control Buttons */}
        <div className="mb-8 flex gap-4">
          <Button
            variant="outline"
            onClick={() => setShowBanner(!showBanner)}
            className="border-2"
          >
            {showBanner ? "Ẩn" : "Hiện"} Top Banner
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowModal(!showModal)}
            className="border-2"
          >
            {showModal ? "Ẩn" : "Hiện"} Modal
          </Button>
        </div>

        {/* 2. LISTING CARD WITH WARNING STATE */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Tin đăng của tôi
          </h2>

          {/* Warning Card - First listing with expiry warning */}
          <div className="bg-white rounded-lg shadow-lg border-4 border-orange-400 p-6 mb-4 relative overflow-hidden">
            {/* Warning stripe */}
            <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 text-xs font-bold shadow-lg transform rotate-0">
              ⚠️ SẮP HẾT HẠN
            </div>

            {/* Warning Badge at top */}
            <div className="mb-4 inline-block">
              <div className="px-4 py-2 bg-orange-100 border-2 border-orange-400 rounded-full flex items-center gap-2">
                <Clock className="size-4 text-orange-700 animate-pulse" />
                <span className="font-bold text-orange-800 text-sm">
                  Sắp hết hạn — còn {daysRemaining} ngày
                </span>
              </div>
            </div>

            {/* Listing Info */}
            <div className="mb-4">
              <h3 className="font-bold text-xl text-gray-900 mb-3">
                Phòng trọ giá rẻ gần ĐH Bách Khoa
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  Hai Bà Trưng, Hà Nội
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="size-4" />
                  <span className="font-semibold text-green-600">
                    2.5 triệu/tháng
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Maximize className="size-4" />
                  20m²
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="size-4" />
                  245 lượt xem
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-4 text-yellow-500" />
                  12 yêu thích
                </span>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-orange-900">
                ⚠️ Gói {planName} của bạn sẽ hết hạn vào{" "}
                <span className="font-bold">
                  {formatDateVietnamese(expiryDate)}
                </span>
              </p>
              <p className="text-xs text-orange-800 mt-1">
                Tin đăng này sẽ tự động bị ẩn khỏi bản đồ sau khi gói hết hạn
              </p>
            </div>

            {/* Action Button */}
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-lg"
              onClick={() => navigate("/pricing")}
            >
              <Clock className="size-5 mr-2" />
              Gia hạn để tiếp tục hiển thị
            </Button>
          </div>

          {/* Normal Card - Second listing (no warning) */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="mb-4">
              <h3 className="font-bold text-lg text-gray-900 mb-3">
                Căn hộ mini đầy đủ tiện nghi
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="size-4" />
                  Đống Đa, Hà Nội
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="size-4" />
                  <span className="font-semibold text-green-600">
                    4.0 triệu/tháng
                  </span>
                </span>
                <span className="flex items-center gap-1">
                  <Maximize className="size-4" />
                  35m²
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Eye className="size-4" />
                  182 lượt xem
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-4 text-yellow-500" />8 yêu thích
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Xem
              </Button>
              <Button variant="outline" className="flex-1">
                Sửa
              </Button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-blue-900 mb-3">📋 Hướng dẫn Demo</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>1. Top Banner:</strong> Sticky warning ở đầu trang, có thể
              dismiss bằng nút X
            </p>
            <p>
              <strong>2. Listing Card:</strong> Card đầu tiên có border cam,
              badge "Sắp hết hạn", và CTA button
            </p>
            <p>
              <strong>3. Modal Popup:</strong> Hiển thị khi load trang, có
              countdown timer real-time
            </p>
          </div>
        </div>
      </div>

      {/* 3. MODAL POPUP - Shown on first visit */}
      <ExpiryWarningModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onRenew={handleRenew}
        daysRemaining={daysRemaining}
        expiryDate={expiryDate}
        planName={planName}
        renewalPrice={renewalPrice}
      />
    </div>
  );
}
