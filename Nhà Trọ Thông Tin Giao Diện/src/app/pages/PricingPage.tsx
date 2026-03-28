import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import {
  Home,
  Check,
  X,
  MapPin,
  Shield,
  Clock,
  Eye,
  TrendingUp,
  Video,
  BarChart3,
  Rocket,
  Headphones,
  CreditCard,
  XCircle,
  HelpCircle,
  ChevronDown,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

type BillingCycle = "monthly" | "yearly";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice: number;
  badge?: string;
  badgeColor?: string;
  icon: typeof Home;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  cta: string;
  ctaVariant: "outline" | "secondary" | "default" | "ghost";
  highlighted?: boolean;
}

// Icon mapping utility
const iconMap: Record<string, any> = {
  Home,
  MapPin,
  Star,
  Rocket,
  Shield,
  Zap,
};

const getIcon = (iconName: string) => iconMap[iconName] || Home;

const faqs = [
  {
    q: "Tôi có thể thay đổi gói dịch vụ sau khi đã đăng ký không?",
    a: "Có, bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào. Khi nâng cấp, bạn chỉ cần thanh toán phần chênh lệch theo thời gian còn lại. Khi hạ cấp, số tiền thừa sẽ được hoàn lại vào ví MapHome của bạn.",
  },
  {
    q: "Tôi có thể hủy đăng ký bất kỳ lúc nào không?",
    a: "Hoàn toàn có thể! Bạn có thể hủy gói đăng ký bất kỳ lúc nào trong phần Cài đặt tài khoản. Gói của bạn sẽ tiếp tục hoạt động cho đến hết kỳ thanh toán hiện tại, sau đó sẽ tự động chuyển về gói Miễn phí.",
  },
  {
    q: "Có chính sách hoàn tiền không?",
    a: "Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ. Sau 7 ngày, bạn có thể hủy đăng ký bất kỳ lúc nào nhưng sẽ không được hoàn lại tiền đã thanh toán.",
  },
];

function PricingCard({
  tier,
  billingCycle,
}: {
  tier: PricingTier;
  billingCycle: BillingCycle;
}) {
  const navigate = useNavigate();
  const Icon = typeof tier.icon === 'string' ? getIcon(tier.icon) : tier.icon;
  const displayPrice =
    billingCycle === "monthly" ? tier.price : tier.yearlyPrice;
  const monthlyEquivalent =
    billingCycle === "yearly" ? tier.yearlyPrice / 12 : tier.price;

  const cardClasses = tier.highlighted
    ? "relative border-none shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] scale-105 bg-white overflow-hidden"
    : "border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 bg-white overflow-hidden";

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className={`${cardClasses} h-full flex flex-col`}>
      {/* Glow effect for highlighted */}
      {tier.highlighted && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5 pointer-events-none" />
      )}

      {/* Popular badge */}
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <Badge
            className={`${tier.badgeColor} px-6 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-xl border-none`}
          >
            {tier.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6 pt-8">
        <div className="mx-auto mb-6">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.1 }}
            className={`w-20 h-20 rounded-3xl flex items-center justify-center ${
              tier.highlighted
                ? "bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 shadow-[0_10px_30px_-5px_rgba(59,130,246,0.5)]"
                : "bg-gray-100"
            }`}
          >
            <Icon
              className={`size-10 ${tier.highlighted ? "text-white" : "text-gray-500"}`}
            />
          </motion.div>
        </div>

        <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
        <CardDescription className="text-sm">
          {tier.description}
        </CardDescription>

        {/* Price */}
        <div className="mt-6">
          {tier.price === 0 ? (
            <div className="text-4xl font-bold text-gray-900">Miễn phí</div>
          ) : (
            <div>
              <div className="text-4xl font-bold text-gray-900">
                {monthlyEquivalent.toLocaleString("vi-VN")}đ
                <span className="text-base font-normal text-gray-500">
                  /tháng
                </span>
              </div>
              {billingCycle === "yearly" && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  ⚡ Tiết kiệm{" "}
                  {(tier.price * 12 - tier.yearlyPrice).toLocaleString("vi-VN")}
                  đ/năm
                </div>
              )}
              {billingCycle === "monthly" && tier.yearlyPrice > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Hoặc {tier.yearlyPrice.toLocaleString("vi-VN")}đ/năm
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <Separator className="mb-6" />

        {/* Features list */}
        <ul className="space-y-3 mb-6">
          {tier.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              {feature.included ? (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="size-3.5 text-green-600" strokeWidth={3} />
                </div>
              ) : (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center mt-0.5">
                  <X className="size-3.5 text-gray-400" strokeWidth={2} />
                </div>
              )}
              <span
                className={`text-sm ${feature.included ? "text-gray-900" : "text-gray-400"}`}
              >
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="mt-auto pt-6">
        <Button
          className={`w-full h-12 rounded-xl text-md font-bold transition-all ${
            tier.highlighted
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25"
              : tier.id === "pro"
                ? "bg-gray-900 hover:bg-black text-white"
                : "border-2"
          }`}
          variant={tier.ctaVariant}
          size="lg"
          onClick={() => {
            navigate("/checkout", {
              state: { selectedTier: tier.id, billingCycle },
            });
          }}
        >
          {tier.cta}
        </Button>
      </CardFooter>
    </Card>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden bg-white">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <HelpCircle className="size-4 text-blue-600" />
          </div>
          <span className="font-semibold text-gray-900">{question}</span>
        </div>
        <ChevronDown
          className={`size-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0">
          <div className="pl-11 text-sm text-gray-600 leading-relaxed">
            {answer}
          </div>
        </div>
      )}
    </div>
  );
}

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/subscriptions/plans`);
        if (res.ok) {
          setPricingTiers(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [API_BASE]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto px-4 text-center relative z-10"
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold mb-8 border border-white/30"
            >
              <Sparkles className="size-4 text-yellow-300" />
              MAPHOME PRICING
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl md:text-6xl font-black mb-6 tracking-tight"
            >
              Nâng tầm tin đăng, <br/><span className="text-yellow-300">chốt khách</span> nhanh hơn
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-blue-100 max-w-2xl mx-auto font-medium"
            >
              Chọn giải pháp hiển thị thông minh để tiếp cận đúng đối tượng khách hàng mục tiêu của bạn.
            </motion.p>
          </motion.div>
        </div>

        {/* Billing Toggle */}
        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 inline-flex items-center gap-1 mx-auto left-1/2 -translate-x-1/2 relative"
          >
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all relative z-10 ${
                billingCycle === "monthly" ? "text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div 
                  layoutId="billing-bg"
                  className="absolute inset-0 bg-blue-600 rounded-2xl -z-10 shadow-lg shadow-blue-500/30"
                />
              )}
              Theo tháng
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-8 py-4 rounded-2xl font-bold text-sm transition-all relative z-10 flex items-center gap-2 ${
                billingCycle === "yearly" ? "text-white" : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {billingCycle === "yearly" && (
                <motion.div 
                  layoutId="billing-bg"
                  className="absolute inset-0 bg-blue-600 rounded-2xl -z-10 shadow-lg shadow-blue-500/30"
                />
              )}
              Theo năm
              <Badge className="bg-green-500 text-white text-[10px] px-1.5 py-0 border-none">
                -20%
              </Badge>
            </button>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 py-20">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch"
          >
            {loading ? (
              <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                <div className="size-10 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin" />
                <p className="font-bold text-sm">Đang tải bảng giá...</p>
              </div>
            ) : (
              pricingTiers.map((tier) => (
                <PricingCard
                  key={tier.id}
                  tier={tier}
                  billingCycle={billingCycle}
                />
              ))
            )}
          </motion.div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-50 py-12 border-y">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="size-7 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Thanh toán an toàn
                  </h3>
                  <p className="text-sm text-gray-600">
                    Tích hợp VNPay, Momo, ZaloPay
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <XCircle className="size-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Hủy bất kỳ lúc nào
                  </h3>
                  <p className="text-sm text-gray-600">
                    Không ràng buộc dài hạn
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Headphones className="size-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Hỗ trợ 24/7
                  </h3>
                  <p className="text-sm text-gray-600">
                    Luôn sẵn sàng hỗ trợ bạn
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Câu hỏi thường gặp
            </h2>
            <p className="text-gray-600">
              Những câu hỏi phổ biến về gói dịch vụ của chúng tôi
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Bắt đầu ngay hôm nay!</h2>
            <p className="text-xl text-blue-100 mb-8">
              Hàng ngàn người thuê đang tìm kiếm phòng trọ của bạn trên MapHome
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
                onClick={() => {
                  const standardCard = document.getElementById("standard-card");
                  standardCard?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                }}
              >
                <Zap className="size-5 mr-2" />
                Xem gói phổ biến nhất
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8"
                onClick={() =>
                  (window.location.href = "mailto:support@maphome.vn")
                }
              >
                <Headphones className="size-5 mr-2" />
                Liên hệ tư vấn
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
