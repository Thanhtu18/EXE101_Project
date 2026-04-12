import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import { formatDateVietnamese } from "@/app/utils/dateUtils";
import { X, Calendar, CheckCircle2, AlertCircle, Zap } from "lucide-react";

interface PropertyRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRenew: () => Promise<void>;
  propertyName: string;
  currentExpiryDate: string;
  isLoading?: boolean;
}

export function PropertyRenewalModal({
  isOpen,
  onClose,
  onRenew,
  propertyName,
  currentExpiryDate,
  isLoading = false,
}: PropertyRenewalModalProps) {
  const [isRenewing, setIsRenewing] = useState(false);

  const handleRenew = async () => {
    setIsRenewing(true);
    try {
      await onRenew();
      // Modal will close after successful renewal
    } finally {
      setIsRenewing(false);
    }
  };

  if (!isOpen) return null;

  const currentDate = new Date(currentExpiryDate);
  const newDate = new Date(currentDate);
  newDate.setDate(newDate.getDate() + 30);
  const isExpired = currentDate < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
      >
        <Card
          className={`relative w-full max-w-md shadow-2xl border-2 ${
            isExpired
              ? "border-red-200 bg-gradient-to-br from-red-50 to-orange-50"
              : "border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50"
          }`}
        >
          <CardContent className="p-8">
            {/* Close button */}
            <button
              onClick={onClose}
              disabled={isRenewing}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-20 h-20 rounded-full flex items-center justify-center ${
                  isExpired
                    ? "bg-red-200 text-red-600"
                    : "bg-amber-200 text-amber-600"
                }`}
              >
                {isExpired ? (
                  <AlertCircle className="size-10" />
                ) : (
                  <Calendar className="size-10" />
                )}
              </motion.div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2
                className={`text-2xl font-black mb-2 ${
                  isExpired ? "text-red-700" : "text-amber-700"
                }`}
              >
                {isExpired ? "Tin đã hết hạn" : "Sắp hết hạn"}
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                <span className="font-bold text-gray-900">
                  "{propertyName}"
                </span>
              </p>

              <div
                className={`p-4 rounded-2xl mb-6 border ${
                  isExpired
                    ? "bg-red-100/50 border-red-200 text-red-700"
                    : "bg-amber-100/50 border-amber-200 text-amber-700"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2">
                  {isExpired ? "Đã hết hạn vào" : "Hết hạn vào"}
                </p>
                <p className="text-lg font-black">
                  {formatDateVietnamese(currentDate)}
                </p>
              </div>

              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                {isExpired
                  ? "Tin đăng của bạn không còn hiển thị công khai. Hãy gia hạn ngay để tiếp tục được liên hệ bởi khách thuê!"
                  : "Tin đăng của bạn sắp hết hạn công bố. Hãy gia hạn để tiếp tục được hiển thị cho khách hàng!"}
              </p>
            </div>

            {/* New Expiry Date Preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 border-2 border-emerald-200 rounded-2xl p-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100">
                  <CheckCircle2 className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                    Sau khi gia hạn
                  </p>
                  <p className="text-lg font-black text-emerald-600">
                    {formatDateVietnamese(newDate)}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Renewal Benefits */}
            <div className="space-y-2 mb-8">
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">
                ✓ Lợi ích gia hạn
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-emerald-600 font-bold mt-0.5">+</span>
                  <span>
                    Tin được hiển thị công khai trong 30 ngày tiếp theo
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-emerald-600 font-bold mt-0.5">+</span>
                  <span>Tiếp tục nhận yêu cầu từ khách thuê</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isRenewing}
                className="flex-1 rounded-xl font-black"
              >
                Huỷ
              </Button>
              <Button
                onClick={handleRenew}
                disabled={isRenewing}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-black hover:opacity-90 disabled:opacity-50"
              >
                {isRenewing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="mr-2"
                    >
                      <Zap className="size-4" />
                    </motion.div>
                    Đang gia hạn...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4 mr-2" />
                    Gia hạn ngay
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
