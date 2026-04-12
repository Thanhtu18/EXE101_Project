import { useState, useEffect } from "react";
import { formatDateVietnamese } from "@/app/utils/dateUtils";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle, XCircle } from "lucide-react";

interface PropertyExpiryBadgeProps {
  expiryDate: string;
  status: "pending" | "approved" | "rejected" | "reported" | "expired";
  size?: "sm" | "lg";
}

export function PropertyExpiryBadge({
  expiryDate,
  status,
  size = "sm",
}: PropertyExpiryBadgeProps) {
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateDaysRemaining = () => {
      if (!expiryDate) return;

      const now = new Date();
      const expiry = new Date(expiryDate);
      const diffTime = expiry.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (status === "expired" || diffDays <= 0) {
        setIsExpired(true);
        setDaysRemaining(0);
      } else {
        setIsExpired(false);
        setDaysRemaining(diffDays);
      }
    };

    calculateDaysRemaining();
    const interval = setInterval(calculateDaysRemaining, 1000 * 60 * 60); // Update hourly

    return () => clearInterval(interval);
  }, [expiryDate]);

  // Only show badge for approved or already expired properties
  if (status !== "approved" && status !== "expired") {
    return null;
  }

  if (daysRemaining === null) return null;

  const isUrgent = daysRemaining <= 3;
  const isWarning = daysRemaining <= 7 && daysRemaining > 3;

  if (size === "sm") {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
          isExpired
            ? "bg-red-100 text-red-700 border border-red-200"
            : isUrgent
              ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse"
              : isWarning
                ? "bg-amber-100 text-amber-700 border border-amber-200"
                : "bg-emerald-100 text-emerald-700 border border-emerald-200"
        }`}
      >
        {isExpired ? (
          <>
            <XCircle className="size-2.5" />
            Đã hết hạn
          </>
        ) : (
          <>
            <Clock className="size-2.5" />
            Còn {daysRemaining} ngày
          </>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${
        isExpired
          ? "bg-red-50 border-red-200 text-red-700"
          : isUrgent
            ? "bg-rose-50 border-rose-200 text-rose-700 animate-pulse"
            : isWarning
              ? "bg-amber-50 border-amber-200 text-amber-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
      }`}
    >
      <div className="p-2 rounded-lg bg-white/60">
        {isExpired ? (
          <XCircle className="size-5" />
        ) : isUrgent ? (
          <AlertCircle className="size-5" />
        ) : (
          <Clock className="size-5" />
        )}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest">
          {isExpired ? "Đã hết hạn" : "Hạn công bố"}
        </p>
        <p className="text-lg font-black">
          {isExpired ? "Cần gia hạn ngay!" : `Còn ${daysRemaining} ngày`}
        </p>
        <p className="text-xs opacity-75 mt-0.5">
          Hết hạn: {formatDateVietnamese(expiryDate)}
        </p>
      </div>
    </motion.div>
  );
}
