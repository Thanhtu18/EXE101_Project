import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

/* ================= Verification Badge ================= */

export function VerificationBadge({
  level = "unverified",
  verifiedAt,
  locationAccuracy,
  size = "md",
  showText = true,
}) {
  const configMap = {
    "location-verified": {
      icon: ShieldCheck,
      text: "Đã xác thực vị trí",
      shortText: "Xác thực GPS",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-600",
      description: "Đã xác thực qua GPS tại địa điểm",
    },
    "phone-verified": {
      icon: Shield,
      text: "Đã xác thực SĐT",
      shortText: "Xác thực SĐT",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-600",
      description: "Đã xác thực số điện thoại qua OTP",
    },
    unverified: {
      icon: ShieldAlert,
      text: "Chưa xác thực",
      shortText: "Chưa xác thực",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-400",
      description: "Thông tin chưa được kiểm chứng",
    },
  };

  const config = configMap[level] || configMap.unverified;
  const Icon = config.icon;

  const sizeMap = {
    sm: {
      icon: "size-3",
      text: "text-xs",
      padding: "px-1.5 py-0.5",
    },
    md: {
      icon: "size-4",
      text: "text-sm",
      padding: "px-2 py-1",
    },
    lg: {
      icon: "size-5",
      text: "text-base",
      padding: "px-3 py-1.5",
    },
  };

  const sizeClasses = sizeMap[size] || sizeMap.md;

  const formattedDate = verifiedAt
    ? new Date(verifiedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full border ${config.bgColor} ${config.borderColor} ${sizeClasses.padding}`}
        title={config.description}
      >
        <Icon className={`${sizeClasses.icon} ${config.color}`} />

        {showText && (
          <span
            className={`${sizeClasses.text} ${config.color} font-medium`}
          >
            {size === "sm" ? config.shortText : config.text}
          </span>
        )}
      </div>

      {/* Location accuracy */}
      {level === "location-verified" &&
        locationAccuracy &&
        size !== "sm" && (
          <div className="text-xs text-gray-500 ml-1">
            Độ chính xác: ±{locationAccuracy}m
          </div>
        )}

      {/* Verified date */}
      {formattedDate && size === "lg" && (
        <div className="text-xs text-gray-500 ml-1">
          Xác thực ngày: {formattedDate}
        </div>
      )}
    </div>
  );
}

/* ================= Warning For Unverified ================= */

export function UnverifiedWarning() {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
      <ShieldAlert className="size-5 text-yellow-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-yellow-900 mb-1">
          ⚠️ Tin chưa được xác thực
        </h4>
        <p className="text-sm text-yellow-800">
          Thông tin này chưa được kiểm chứng. Vui lòng thận trọng và kiểm tra kỹ
          trước khi liên hệ. Ưu tiên các tin đã xác thực GPS để đảm bảo phòng
          trọ thật sự tồn tại tại địa chỉ công bố.
        </p>
      </div>
    </div>
  );
}

/* ================= Location Verification Info ================= */

export function LocationVerificationInfo({ locationAccuracy }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
      <ShieldCheck className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <h4 className="font-semibold text-green-900 mb-1">
          ✓ Đã xác thực vị trí GPS
        </h4>
        <p className="text-sm text-green-800">
          Chủ nhà đã chụp ảnh và xác thực vị trí trực tiếp tại phòng trọ với độ
          chính xác <strong>±{locationAccuracy}m</strong>. Đây là tin đăng đáng
          tin cậy đã được hệ thống kiểm chứng.
        </p>
      </div>
    </div>
  );
}