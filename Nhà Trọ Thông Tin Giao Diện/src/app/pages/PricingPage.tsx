import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import {
  Home, Check, X, MapPin, Shield, Clock, Eye, TrendingUp, Video,
  BarChart3, Rocket, Headphones, CreditCard, XCircle, HelpCircle,
  ChevronDown, Sparkles, Star, Zap
} from 'lucide-react';

type BillingCycle = 'monthly' | 'yearly';

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
  ctaVariant: 'outline' | 'secondary' | 'default' | 'ghost';
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Gói Cơ Bản',
    price: 0,
    yearlyPrice: 0,
    badge: 'Dùng thử',
    badgeColor: 'bg-gray-100 text-gray-700',
    icon: Home,
    description: 'Bắt đầu miễn phí, khám phá nền tảng',
    features: [
      { text: 'Hiển thị trên bản đồ', included: true },
      { text: 'Đăng tối đa 1 tin', included: true },
      { text: 'Hết hạn sau 7 ngày', included: true },
      { text: 'GPS xác thực', included: false },
      { text: 'Huy hiệu xanh tin cậy', included: false },
      { text: 'Video 360° phòng trọ', included: false },
      { text: 'Thống kê lượt xem', included: false },
    ],
    cta: 'Bắt đầu miễn phí',
    ctaVariant: 'outline',
  },
  {
    id: 'basic',
    name: 'Gói Basic',
    price: 50000,
    yearlyPrice: 480000, // 50k * 12 * 0.8 = 480k (save 20%)
    icon: MapPin,
    description: 'Tin cậy hơn với GPS xác thực',
    features: [
      { text: 'GPS xác thực độ chính xác 50m', included: true },
      { text: 'Huy hiệu xanh tin cậy', included: true },
      { text: 'Highlight nhẹ trên bản đồ', included: true },
      { text: 'Yêu cầu quản trị viên kiểm tra', included: true },
      { text: 'Tin đăng hiển thị 30 ngày', included: true },
      { text: 'Video 360° phòng trọ', included: false },
      { text: 'Thống kê lượt xem', included: false },
    ],
    cta: 'Chọn Basic',
    ctaVariant: 'secondary',
  },
  {
    id: 'standard',
    name: 'Gói Standard',
    price: 100000,
    yearlyPrice: 960000, // 100k * 12 * 0.8
    badge: 'Phổ biến nhất',
    badgeColor: 'bg-gradient-to-r from-amber-400 to-orange-500 text-white',
    icon: Star,
    description: 'Lựa chọn tốt nhất cho chủ trọ nghiêm túc',
    features: [
      { text: 'Tất cả tính năng Basic +', included: true },
      { text: 'Video 360° phòng trọ', included: true },
      { text: 'Thống kê lượt xem chi tiết', included: true },
      { text: 'Ưu tiên top tìm kiếm', included: true },
      { text: 'Tin đăng vĩnh viễn', included: true },
      { text: 'Badge "Tin nổi bật"', included: true },
      { text: 'Hỗ trợ ưu tiên', included: true },
    ],
    cta: 'Chọn Standard',
    ctaVariant: 'default',
    highlighted: true,
  },
  {
    id: 'pro',
    name: 'Gói Pro',
    price: 200000,
    yearlyPrice: 1920000, // 200k * 12 * 0.8
    badge: 'Chuyên nghiệp',
    badgeColor: 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
    icon: Rocket,
    description: 'Tối đa hiệu quả cho chủ nhà chuyên nghiệp',
    features: [
      { text: 'Tất cả tính năng Standard +', included: true },
      { text: 'Boost vị trí 7 ngày/tháng', included: true },
      { text: 'Hỗ trợ đăng tin Concierge', included: true },
      { text: 'Ưu tiên hiển thị cao nhất', included: true },
      { text: 'Tin đăng vĩnh viễn', included: true },
      { text: 'Phân tích nâng cao', included: true },
      { text: 'Hỗ trợ VIP 24/7', included: true },
    ],
    cta: 'Chọn Pro',
    ctaVariant: 'default',
  },
];

const faqs = [
  {
    q: 'Tôi có thể thay đổi gói dịch vụ sau khi đã đăng ký không?',
    a: 'Có, bạn có thể nâng cấp hoặc hạ cấp gói bất kỳ lúc nào. Khi nâng cấp, bạn chỉ cần thanh toán phần chênh lệch theo thời gian còn lại. Khi hạ cấp, số tiền thừa sẽ được hoàn lại vào ví MapHome của bạn.',
  },
  {
    q: 'Tôi có thể hủy đăng ký bất kỳ lúc nào không?',
    a: 'Hoàn toàn có thể! Bạn có thể hủy gói đăng ký bất kỳ lúc nào trong phần Cài đặt tài khoản. Gói của bạn sẽ tiếp tục hoạt động cho đến hết kỳ thanh toán hiện tại, sau đó sẽ tự động chuyển về gói Miễn phí.',
  },
  {
    q: 'Có chính sách hoàn tiền không?',
    a: 'Có, chúng tôi có chính sách hoàn tiền 100% trong vòng 7 ngày đầu tiên nếu bạn không hài lòng với dịch vụ. Sau 7 ngày, bạn có thể hủy đăng ký bất kỳ lúc nào nhưng sẽ không được hoàn lại tiền đã thanh toán.',
  },
];

function PricingCard({ tier, billingCycle }: { tier: PricingTier; billingCycle: BillingCycle }) {
  const navigate = useNavigate();
  const Icon = tier.icon;
  const displayPrice = billingCycle === 'monthly' ? tier.price : tier.yearlyPrice;
  const monthlyEquivalent = billingCycle === 'yearly' ? tier.yearlyPrice / 12 : tier.price;

  const cardClasses = tier.highlighted
    ? 'relative border-2 border-blue-500 shadow-2xl scale-105 bg-gradient-to-b from-blue-50/50 to-white'
    : 'border shadow-md hover:shadow-lg transition-shadow bg-white';

  return (
    <Card className={cardClasses}>
      {/* Popular badge */}
      {tier.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <Badge className={`${tier.badgeColor} px-4 py-1 text-xs font-semibold shadow-lg`}>
            {tier.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6 pt-8">
        {/* Icon */}
        <div className="mx-auto mb-4">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
            tier.highlighted
              ? 'bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg'
              : 'bg-gradient-to-br from-gray-100 to-gray-200'
          }`}>
            <Icon className={`size-8 ${tier.highlighted ? 'text-white' : 'text-gray-600'}`} />
          </div>
        </div>

        <CardTitle className="text-2xl mb-2">{tier.name}</CardTitle>
        <CardDescription className="text-sm">{tier.description}</CardDescription>

        {/* Price */}
        <div className="mt-6">
          {tier.price === 0 ? (
            <div className="text-4xl font-bold text-gray-900">Miễn phí</div>
          ) : (
            <div>
              <div className="text-4xl font-bold text-gray-900">
                {monthlyEquivalent.toLocaleString('vi-VN')}đ
                <span className="text-base font-normal text-gray-500">/tháng</span>
              </div>
              {billingCycle === 'yearly' && (
                <div className="mt-2 text-sm text-green-600 font-semibold">
                  ⚡ Tiết kiệm {(tier.price * 12 - tier.yearlyPrice).toLocaleString('vi-VN')}đ/năm
                </div>
              )}
              {billingCycle === 'monthly' && tier.yearlyPrice > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Hoặc {tier.yearlyPrice.toLocaleString('vi-VN')}đ/năm
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
              <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                {feature.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className={`w-full ${
            tier.highlighted
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg'
              : tier.id === 'pro'
              ? 'bg-gray-900 hover:bg-gray-800 text-white'
              : ''
          }`}
          variant={tier.ctaVariant}
          size="lg"
          onClick={() => {
            // Navigate to checkout page with selected tier
            navigate('/checkout', { state: { selectedTier: tier.id, billingCycle } });
          }}
        >
          {tier.cta}
        </Button>
      </CardFooter>
    </Card>
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
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 pt-0">
          <div className="pl-11 text-sm text-gray-600 leading-relaxed">{answer}</div>
        </div>
      )}
    </div>
  );
}

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="size-4" />
              Pricing Plans
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Chọn gói đăng tin phù hợp với bạn
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Tiếp cận hàng ngàn người thuê trong khu vực của bạn
            </p>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-2 inline-flex items-center gap-2 mx-auto">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo tháng
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Theo năm
              <Badge className="bg-green-500 text-white text-xs">Tiết kiệm 20%</Badge>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {pricingTiers.map((tier) => (
              <PricingCard key={tier.id} tier={tier} billingCycle={billingCycle} />
            ))}
          </div>
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
                  <h3 className="font-semibold text-gray-900 mb-1">Thanh toán an toàn</h3>
                  <p className="text-sm text-gray-600">Tích hợp VNPay, Momo, ZaloPay</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                  <XCircle className="size-7 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hủy bất kỳ lúc nào</h3>
                  <p className="text-sm text-gray-600">Không ràng buộc dài hạn</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                  <Headphones className="size-7 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hỗ trợ 24/7</h3>
                  <p className="text-sm text-gray-600">Luôn sẵn sàng hỗ trợ bạn</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Câu hỏi thường gặp</h2>
            <p className="text-gray-600">Những câu hỏi phổ biến về gói dịch vụ của chúng tôi</p>
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
                  const standardCard = document.getElementById('standard-card');
                  standardCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
              >
                <Zap className="size-5 mr-2" />
                Xem gói phổ biến nhất
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold px-8"
                onClick={() => window.location.href = 'mailto:support@maphome.vn'}
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