import { useState, useEffect } from "react";
import { 
  Check, 
  Home, 
  MapPin, 
  Rocket, 
  Shield, 
  Star, 
  Zap,
  PackageSearch,
  ArrowRight,
  Sparkle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12
    }
  }
};

type BillingCycle = "monthly" | "yearly";

interface PricingTier {
  id?: string;
  _id?: string;
  planId: string;
  name: string;
  price: number;
  yearlyPrice: number;
  badge?: string;
  badgeColor?: string;
  icon: string | typeof Home;
  description: string;
  features: Array<{ text: string; included: boolean }>;
  cta: string;
  ctaVariant: "outline" | "secondary" | "default" | "ghost";
  highlighted?: boolean;
}

const iconMap: Record<string, any> = {
  Home,
  MapPin,
  Star,
  Rocket,
  Shield,
  Zap,
};

function getIcon(name: string) {
  return iconMap[name] || Home;
}

function PricingCard({
  tier,
  billingCycle,
}: {
  tier: PricingTier;
  billingCycle: BillingCycle;
}) {
  const navigate = useNavigate();
  const IconComponent = typeof tier.icon === 'string' ? getIcon(tier.icon) : tier.icon;
  const displayPrice = billingCycle === "monthly" ? tier.price : tier.yearlyPrice;
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -10, transition: { duration: 0.3 } }}
      className="flex flex-col h-full group"
    >
      <Card className={`relative h-full flex flex-col transition-all duration-500 overflow-hidden border ${
        tier.highlighted 
          ? "border-blue-500/20 shadow-[0_30px_60px_-15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/10" 
          : "border-gray-100 shadow-xl shadow-gray-200/40 hover:border-blue-400/30"
      } bg-white/70 backdrop-blur-xl`}>
        
        {/* Decorative elements for highlighted card */}
        {tier.highlighted && (
          <>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 rounded-full" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-indigo-500/5 blur-2xl -ml-12 -mb-12 rounded-full" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-600" />
          </>
        )}

        <CardHeader className="pt-10 pb-6 items-center text-center px-6">
          {tier.badge && (
            <div className={`mb-6 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ${tier.badgeColor || 'bg-blue-600 text-white'}`}>
              {tier.badge}
            </div>
          )}
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110 duration-500 ${
            tier.highlighted 
              ? "bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-xl shadow-blue-200" 
              : "bg-blue-50 text-blue-600"
          }`}>
            <IconComponent className="size-7" />
          </div>
          <h3 className="text-xl font-black text-gray-900 mb-2 truncate max-w-full">{tier.name}</h3>
          <p className="text-xs text-gray-400 font-medium px-4 line-clamp-2">{tier.description}</p>
        </CardHeader>

        <CardContent className="flex-1 px-8">
          <div className="flex flex-col items-center mb-10">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tight text-gray-900">
                {new Intl.NumberFormat('vi-VN').format(displayPrice)}
              </span>
              <span className="text-sm font-bold text-gray-400">đ</span>
            </div>
            <span className="text-xs font-bold text-blue-600/60 uppercase tracking-widest mt-1">
              / {billingCycle === "monthly" ? "Tháng" : "Năm"}
            </span>
            {billingCycle === "yearly" && (
              <div className="mt-3 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <p className="text-[10px] text-green-600 font-black italic">Tiết kiệm 20% mỗi năm</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-4">Các quyền lợi đặc quyền:</p>
            {tier.features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3 group/item text-left">
                <div className={`mt-0.5 rounded-full p-0.5 shrink-0 transition-colors ${
                  feature.included 
                    ? "bg-blue-50 text-blue-600 group-hover/item:bg-blue-600 group-hover/item:text-white" 
                    : "bg-gray-50 text-gray-300"
                }`}>
                  <Check className="size-3" strokeWidth={3} />
                </div>
                <span className={`text-xs font-medium leading-relaxed ${
                  feature.included ? "text-gray-700" : "text-gray-300 line-through decoration-gray-200"
                }`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-8 pb-10 pt-4">
          <Button
            className={`w-full py-6 rounded-2xl text-sm font-black transition-all duration-300 transform active:scale-95 ${
              tier.highlighted
                ? "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-2xl shadow-blue-400/40 border-none"
                : "bg-gray-900 border-none text-white hover:bg-black shadow-xl"
            }`}
            onClick={() => {
              navigate("/checkout", {
                state: { selectedTier: tier.planId, billingCycle },
              });
            }}
          >
            {tier.cta} <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
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
          const data = await res.json();
          setPricingTiers(data.filter((t: any) => t.isActive));
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
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Enhanced Hero Section with Aura */}
        <section className="relative pt-32 pb-48 overflow-hidden bg-gray-950">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
            <div className="absolute -top-[40%] -left-[10%] w-[80%] h-[80%] bg-blue-600/30 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[60%] h-[60%] bg-indigo-600/30 rounded-full blur-[100px] animate-pulse delay-700" />
            <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] bg-purple-600/20 rounded-full blur-[110px] animate-pulse delay-1000" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
            >
              <Sparkle className="size-3 fill-blue-400" /> MapHome Premium Plans
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-[1.1]"
            >
              Nâng tầm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-indigo-500">tin đăng</span><br /> 
              chốt khách <span className="italic">nhanh hơn</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-400 font-medium max-w-2xl mx-auto mb-16 leading-relaxed"
            >
              Chọn giải pháp hiển thị thông minh để tiếp cận đúng đối tượng khách hàng mục tiêu của bạn. 
              Hiệu quả gấp 10 lần so với phương pháp truyền thống.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10 shadow-2xl inline-flex gap-1 relative z-20">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`relative px-8 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
                    billingCycle === "monthly" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {billingCycle === "monthly" && (
                    <motion.div layoutId="cyclebg" className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20" />
                  )}
                  <span className="relative z-10">Theo tháng</span>
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`relative px-8 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
                    billingCycle === "yearly" ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {billingCycle === "yearly" && (
                    <motion.div layoutId="cyclebg" className="absolute inset-0 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20" />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    Theo năm
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-[8px] text-white">SAVE 20%</span>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-[1400px] mx-auto px-6 -mt-32 relative z-30">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={loading ? "hidden" : "visible"}
            className="flex flex-wrap justify-center gap-8"
          >
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="w-full py-40 flex flex-col items-center justify-center gap-8 text-gray-400">
                  <div className="size-16 border-[6px] border-white/10 border-t-blue-500 rounded-full animate-spin" />
                  <p className="font-black text-sm uppercase tracking-widest animate-pulse">Đang kiến tạo bảng giá...</p>
                </div>
              ) : pricingTiers.length === 0 ? (
                <div className="w-full py-32 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6 shadow-xl">
                    <PackageSearch className="size-10 text-gray-300" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">Chưa tìm thấy gói dịch vụ</h3>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="mt-8 px-10 h-14 rounded-2xl border-2 font-black"
                  >
                    Thử lại ngay
                  </Button>
                </div>
              ) : (
                pricingTiers.map((tier) => (
                  <div key={tier.planId || tier._id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.35rem)] xl:w-[calc(25%-1.5rem)] min-w-[300px] max-w-[380px]">
                    <PricingCard
                      tier={tier}
                      billingCycle={billingCycle}
                    />
                  </div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
