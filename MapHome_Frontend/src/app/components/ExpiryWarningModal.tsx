import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { AlertCircle, Clock, X } from "lucide-react";

interface ExpiryWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: () => void;
  daysRemaining: number;
  expiryDate: string;
  planName: string;
  renewalPrice: number;
}

export function ExpiryWarningModal({
  isOpen,
  onClose,
  onRenew,
  daysRemaining,
  expiryDate,
  planName,
  renewalPrice,
}: ExpiryWarningModalProps) {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!isOpen) return;

    const calculateCountdown = () => {
      const now = new Date();
      const expiry = new Date(expiryDate);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({ days, hours, minutes, seconds });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen, expiryDate]);

  const handleRemindLater = () => {
    // Store in session storage to not show again this session
    sessionStorage.setItem("expiryWarningDismissed", "true");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleRemindLater}
      />

      {/* Modal */}
      <Card className="relative w-full max-w-[500px] shadow-2xl border-2 border-amber-200 animate-in fade-in zoom-in duration-300">
        <CardContent className="p-8">
          {/* Close button */}
          <button
            onClick={handleRemindLater}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              {/* House with clock */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <div className="relative">
                  {/* House icon */}
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center transform rotate-45">
                    <div className="transform -rotate-45">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Clock badge */}
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-red-500 border-4 border-white flex items-center justify-center shadow-lg animate-pulse">
                    <Clock className="size-5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            Gói của bạn sắp hết hạn
          </h2>

          {/* Body */}
          <p className="text-center text-gray-700 mb-6 leading-relaxed">
            Gia hạn ngay để tránh tin đăng bị gỡ khỏi bản đồ và mất vị trí tìm
            kiếm
          </p>

          {/* Countdown */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <p className="text-sm font-semibold text-red-800 text-center mb-3">
              Thời gian còn lại
            </p>
            <div className="flex items-center justify-center gap-3">
              {/* Days */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600">
                    {String(countdown.days).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs text-gray-600 mt-1 font-medium">
                  Ngày
                </span>
              </div>

              <span className="text-2xl font-bold text-red-600 mb-5">:</span>

              {/* Hours */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600">
                    {String(countdown.hours).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs text-gray-600 mt-1 font-medium">
                  Giờ
                </span>
              </div>

              <span className="text-2xl font-bold text-red-600 mb-5">:</span>

              {/* Minutes */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600">
                    {String(countdown.minutes).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs text-gray-600 mt-1 font-medium">
                  Phút
                </span>
              </div>

              <span className="text-2xl font-bold text-red-600 mb-5">:</span>

              {/* Seconds */}
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                  <span className="text-2xl font-bold text-red-600">
                    {String(countdown.seconds).padStart(2, "0")}
                  </span>
                </div>
                <span className="text-xs text-gray-600 mt-1 font-medium">
                  Giây
                </span>
              </div>
            </div>
          </div>

          {/* Plan Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-800 mb-1">Gói hiện tại</p>
                <p className="font-bold text-amber-900">{planName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-amber-800 mb-1">Hết hạn</p>
                <p className="font-bold text-amber-900">
                  {new Date(expiryDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          </div>

          {/* Primary CTA */}
          <Button
            size="lg"
            className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold shadow-lg mb-4 h-14 text-base"
            onClick={onRenew}
          >
            Gia hạn ngay — {renewalPrice.toLocaleString("vi-VN")}đ
          </Button>

          {/* Secondary */}
          <button
            onClick={handleRemindLater}
            className="text-sm text-gray-500 hover:text-gray-700 font-medium w-full text-center hover:underline"
          >
            Nhắc tôi sau
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
