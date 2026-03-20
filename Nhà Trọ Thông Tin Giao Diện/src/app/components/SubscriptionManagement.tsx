import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Progress } from "@/app/components/ui/progress";
import {
  Check,
  X,
  Crown,
  Star,
  TrendingUp,
  Eye,
  Phone,
  MapPin,
  Download,
  CreditCard,
  Calendar,
  ArrowRight,
} from "lucide-react";

// Mock current subscription data
const currentSubscription = {
  planName: "Gói Free",
  planId: "free",
  status: "active",
  startDate: new Date().toISOString(),
  expiryDate: new Date().toISOString(),
  daysRemaining: 0,
  totalDays: 0,
};

const currentFeatures: any[] = [];

const usageStats: any[] = [];

const comparisonFeatures = [
  {
    name: "Số lượng tin đăng",
    standard: "5 tin",
    pro: "20 tin",
    highlighted: true,
  },
  { name: "Hiển thị ưu tiên", standard: false, pro: true, highlighted: true },
  {
    name: "Tích xanh nhanh hơn",
    standard: false,
    pro: true,
    highlighted: true,
  },
  { name: "Thống kê nâng cao", standard: false, pro: true },
  { name: "Hỗ trợ 24/7", standard: false, pro: true },
  { name: "API tích hợp", standard: false, pro: true },
];

const transactions: any[] = [];

export function SubscriptionManagement() {
  const navigate = useNavigate();
  const [showComparison, setShowComparison] = useState(false);

  const progressPercent =
    (currentSubscription.daysRemaining / currentSubscription.totalDays) * 100;

  const handleRenew = () => {
    navigate("/pricing");
  };

  const handleUpgrade = () => {
    navigate("/pricing");
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    alert(
      `📥 Đang tải hóa đơn ${invoiceId}...\n\nDemo: File PDF sẽ được tải xuống.`,
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gói đăng ký của bạn
        </h2>
        <p className="text-gray-600">Quản lý gói dịch vụ và theo dõi sử dụng</p>
      </div>

      {/* Current Plan Hero Card */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Plan Info */}
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
                  <Star className="size-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentSubscription.planName}
                    </h3>
                    <Badge className="bg-green-100 text-green-700 border border-green-300 font-semibold">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Đang hoạt động
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Kích hoạt từ{" "}
                    {new Date(currentSubscription.startDate).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-900">
                    Còn {currentSubscription.daysRemaining} ngày
                  </span>
                  <span className="text-gray-600">
                    {currentSubscription.daysRemaining}/
                    {currentSubscription.totalDays} ngày
                  </span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>

              {/* Expiry Date */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="size-4 text-gray-500" />
                <span className="text-gray-600">
                  Ngày hết hạn:{" "}
                  <span className="font-semibold text-gray-900">
                    {new Date(
                      currentSubscription.expiryDate,
                    ).toLocaleDateString("vi-VN")}
                  </span>
                </span>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex flex-col gap-3 lg:min-w-[240px]">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg"
                onClick={handleRenew}
              >
                <Calendar className="size-4 mr-2" />
                Gia hạn ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
                onClick={handleUpgrade}
              >
                <Crown className="size-4 mr-2" />
                Nâng cấp lên Pro
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Unlocked */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="size-5 text-green-600" />
            Tính năng đang sử dụng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {currentFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm font-medium text-green-700 flex items-center gap-2"
              >
                <Check className="size-4" />
                {feature}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {usageStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center ${stat.color}`}
                  >
                    <Icon className="size-6" />
                  </div>
                  <TrendingUp className="size-5 text-green-500" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm font-semibold text-gray-900">
                  {stat.label}
                </p>
                <p className="text-xs text-gray-500">{stat.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Comparison Toggle */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => setShowComparison(!showComparison)}
          className="border-2 border-purple-300 text-purple-700 hover:bg-purple-50 font-semibold"
        >
          {showComparison ? "Ẩn so sánh" : "So sánh với Gói Pro"}
          <ArrowRight
            className={`size-4 ml-2 transition-transform ${showComparison ? "rotate-90" : ""}`}
          />
        </Button>
      </div>

      {/* Comparison Table */}
      {showComparison && (
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-white to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="size-5 text-purple-600" />
              So sánh gói Standard vs Pro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-bold text-gray-900">
                      Tính năng
                    </th>
                    <th className="text-center py-3 px-4 font-bold text-gray-900">
                      Standard (hiện tại)
                    </th>
                    <th className="text-center py-3 px-4 font-bold text-purple-700 bg-purple-50 rounded-t-lg">
                      Pro
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((feature, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-gray-100 ${feature.highlighted ? "bg-yellow-50" : ""}`}
                    >
                      <td className="py-3 px-4 font-medium text-gray-900">
                        {feature.name}
                        {feature.highlighted && (
                          <span className="ml-2 text-xs text-yellow-600 font-semibold">
                            ⭐ Nổi bật
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {typeof feature.standard === "boolean" ? (
                          feature.standard ? (
                            <Check className="size-5 text-green-600 mx-auto" />
                          ) : (
                            <X className="size-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="font-semibold text-gray-900">
                            {feature.standard}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center bg-purple-50">
                        {typeof feature.pro === "boolean" ? (
                          feature.pro ? (
                            <Check className="size-5 text-purple-600 mx-auto" />
                          ) : (
                            <X className="size-5 text-gray-400 mx-auto" />
                          )
                        ) : (
                          <span className="font-bold text-purple-700">
                            {feature.pro}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 text-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold shadow-lg"
                onClick={handleUpgrade}
              >
                <Crown className="size-5 mr-2" />
                Nâng cấp lên Pro ngay
                <ArrowRight className="size-5 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="size-5 text-gray-600" />
            Lịch sử giao dịch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Ngày
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Gói
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Số tiền
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Phương thức
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Trạng thái
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Hóa đơn
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-900">
                      {transaction.date}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-gray-900">
                        {transaction.plan}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="font-bold text-gray-900">
                        {transaction.amount > 0
                          ? `${transaction.amount.toLocaleString("vi-VN")}đ`
                          : "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {transaction.method}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {transaction.status === "success" && (
                        <Badge className="bg-green-100 text-green-700 border border-green-300">
                          Thành công
                        </Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {transaction.invoiceId !== "-" ? (
                        <button
                          onClick={() =>
                            handleDownloadInvoice(transaction.invoiceId)
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1 hover:underline"
                        >
                          <Download className="size-4" />
                          Tải xuống
                        </button>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Star className="size-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-2">
                Cần tư vấn về gói dịch vụ?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Đội ngũ hỗ trợ của chúng tôi sẵn sàng giúp bạn chọn gói phù hợp
                nhất.
              </p>
              <Button
                variant="outline"
                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Phone className="size-4 mr-2" />
                Liên hệ hỗ trợ
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
