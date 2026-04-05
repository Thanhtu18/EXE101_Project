import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Zap } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface ExpiringSoon {
  id: string;
  name: string;
  daysRemaining: number;
}

interface PropertyExpiryBannerProps {
  expiringSoon: ExpiringSoon[];
  onRenewClick: (propertyId: string) => void;
  onDismiss: () => void;
}

export function PropertyExpiryBanner({
  expiringSoon,
  onRenewClick,
  onDismiss,
}: PropertyExpiryBannerProps) {
  if (expiringSoon.length === 0) return null;

  const isCritical = expiringSoon.some((p) => p.daysRemaining <= 3);
  const isWarning = expiringSoon.some(
    (p) => p.daysRemaining <= 7 && p.daysRemaining > 3,
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`sticky top-0 z-40 border-b-2 shadow-lg ${
          isCritical
            ? "bg-gradient-to-r from-red-100 to-orange-100 border-red-300"
            : isWarning
              ? "bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-300"
              : "bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-300"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  isCritical
                    ? "bg-red-200 text-red-700"
                    : isWarning
                      ? "bg-amber-200 text-amber-700"
                      : "bg-blue-200 text-blue-700"
                }`}
              >
                <AlertCircle className="size-6" />
              </div>
              <div className="flex-1 pt-0.5">
                <h3
                  className={`font-black text-lg ${
                    isCritical
                      ? "text-red-900"
                      : isWarning
                        ? "text-amber-900"
                        : "text-blue-900"
                  }`}
                >
                  {isCritical
                    ? "⚠️ Tin đăng hết hạn sắp xảy ra!"
                    : isWarning
                      ? "📢 Một số tin sắp hết hạn"
                      : "ℹ️ Nhận lời nhắc về hạn công bố"}
                </h3>
                <p
                  className={`text-sm font-bold mt-1 ${
                    isCritical
                      ? "text-red-800"
                      : isWarning
                        ? "text-amber-800"
                        : "text-blue-800"
                  }`}
                >
                  {expiringSoon.length} tin{" "}
                  {isCritical
                    ? "sắp hết hạn trong 3 ngày"
                    : isWarning
                      ? "sắp hết hạn trong 7 ngày"
                      : "sắp hết hạn"}
                  :
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expiringSoon.slice(0, 3).map((prop) => (
                    <span
                      key={prop.id}
                      className={`px-3 py-1 rounded-full text-xs font-bold truncate max-w-xs ${
                        isCritical
                          ? "bg-red-200 text-red-700"
                          : isWarning
                            ? "bg-amber-200 text-amber-700"
                            : "bg-blue-200 text-blue-700"
                      }`}
                    >
                      {prop.name}
                      {prop.daysRemaining <= 1 && " (ngày mai)"}
                    </span>
                  ))}
                  {expiringSoon.length > 3 && (
                    <span className="px-3 py-1 text-xs font-bold text-gray-600">
                      +{expiringSoon.length - 3} khác
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                onClick={() => onRenewClick(expiringSoon[0].id)}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-black rounded-lg hover:opacity-90 text-sm px-4 py-2 flex items-center gap-2"
              >
                <Zap className="size-4" />
                Gia hạn
              </Button>
              <button
                onClick={onDismiss}
                className={`p-2 rounded-lg transition-colors ${
                  isCritical
                    ? "hover:bg-red-200 text-red-700"
                    : isWarning
                      ? "hover:bg-amber-200 text-amber-700"
                      : "hover:bg-blue-200 text-blue-700"
                }`}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
