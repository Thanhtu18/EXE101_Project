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
import api from "@/app/utils/api";
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
  
  // Multicolor Luminous 3.0: Theme Mapping
  const getTheme = (name: string) => {
    if (name.includes("Cơ Bản")) return { base: "slate", from: "slate-400", via: "slate-300", to: "slate-200", icon: "text-slate-600", accent: "bg-slate-500", glow: "shadow-slate-200/50" };
    if (name.includes("Basic")) return { base: "blue", from: "blue-400", via: "cyan-400", to: "blue-300", icon: "text-blue-600", accent: "bg-blue-500", glow: "shadow-blue-200/50" };
    if (name.includes("Standard")) return { base: "violet", from: "violet-400", via: "rose-400", to: "indigo-400", icon: "text-violet-600", accent: "bg-violet-500", glow: "shadow-violet-200/50" };
    if (name.includes("Pro")) return { base: "rose", from: "rose-400", via: "amber-400", to: "rose-300", icon: "text-rose-600", accent: "bg-rose-500", glow: "shadow-rose-200/50" };
    return { base: "emerald", from: "emerald-400", via: "cyan-400", to: "teal-400", icon: "text-emerald-600", accent: "bg-emerald-500", glow: "shadow-emerald-200/50" };
  };

  const theme = getTheme(tier.name);
  
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{ y: -15, scale: 1.02 }}
      className="flex flex-col h-full group perspective-1000"
    >
      <Card className={`relative h-full flex flex-col transition-all duration-700 overflow-hidden border-none shadow-2xl ${
        tier.highlighted 
          ? `${theme.glow} ring-2 ring-${theme.base}-500/20` 
          : "shadow-slate-200/50 ring-1 ring-slate-100"
      } bg-white/80 backdrop-blur-3xl rounded-[3rem]`}>
        
        {/* Luminous 3.0: Multicolor Mesh Header Aura */}
        <div className={`absolute top-0 left-0 w-full h-1/3 opacity-30 pointer-events-none bg-gradient-to-br from-${theme.from} via-${theme.via} to-${theme.to} blur-[80px] -translate-y-1/2`} />

        {/* Floating Glass Badge */}
        {tier.badge && (
          <div className="absolute top-6 right-6 z-20">
             <div className="px-4 py-2 rounded-2xl bg-white/60 backdrop-blur-md border border-white shadow-xl flex items-center gap-2 group-hover:scale-110 transition-transform">
                <div className={`size-1.5 rounded-full animate-pulse ${theme.accent}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest text-slate-800`}>{tier.badge}</span>
             </div>
          </div>
        )}

        <CardHeader className="pt-14 pb-8 items-center text-center px-8 relative z-10">
          {/* Embedded Theme Icon Surface */}
          <div className="relative mb-8">
            <div className={`absolute inset-0 bg-${theme.base}-500/20 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="w-20 h-20 rounded-[2.5rem] bg-white shadow-[0_15px_35px_-10px_rgba(0,0,0,0.1),inset_0_-4px_8px_rgba(0,0,0,0.05)] border border-slate-50 flex items-center justify-center relative z-10 group-hover:rotate-6 transition-transform duration-500">
              <IconComponent className={`size-10 ${theme.icon} drop-shadow-sm`} />
            </div>
          </div>
          
          <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">{tier.name}</h3>
          <p className="text-sm text-slate-500 font-bold leading-relaxed max-w-[200px]">{tier.description}</p>
        </CardHeader>

        <CardContent className="flex-1 px-10 relative z-10">
          <div className="flex flex-col items-center mb-12">
            <div className="relative">
              <span className="text-6xl font-black tracking-tighter text-slate-950 block">
                {new Intl.NumberFormat('vi-VN').format(displayPrice)}
              </span>
              <span className="absolute -top-1 -right-6 text-xl font-bold text-slate-400">đ</span>
            </div>
            <span className={`text-[10px] font-black text-${theme.base}-600/60 uppercase tracking-[0.3em] mt-3`}>
              Per {billingCycle === "monthly" ? "Month" : "Year"}
            </span>
            
            {billingCycle === "yearly" && (
              <Badge className={`mt-4 bg-${theme.base}-500/10 text-${theme.base}-600 border-none px-4 py-1.5 rounded-full text-[10px] font-black italic`}>
                Save 20% Annually
              </Badge>
            )}
          </div>

          <div className="space-y-5">
            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-4 ml-1">Included Benefits</p>
            {tier.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 group/item">
                <div className={`p-1.5 rounded-xl transition-all duration-300 ${
                  feature.included 
                    ? `bg-gradient-to-br from-${theme.base}-600 to-${theme.base}-400 text-white shadow-lg shadow-${theme.base}-100` 
                    : "bg-slate-100 text-slate-300"
                }`}>
                  <Check className="size-3.5" strokeWidth={4} />
                </div>
                <span className={`text-[13px] font-bold transition-colors ${
                  feature.included ? `text-slate-700 group-hover/item:text-${theme.base}-950` : "text-slate-300 line-through"
                }`}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>

        <CardFooter className="px-10 pb-12 pt-6 relative z-10">
          <Button
            className={`w-full h-16 rounded-[2rem] text-lg font-black transition-all duration-500 relative overflow-hidden group/btn ${
              tier.highlighted
                ? `bg-gradient-to-r from-${theme.from.split("-")[0]}-600 via-${theme.via.split("-")[0]}-600 to-${theme.to.split("-")[0]}-700 text-white shadow-2xl shadow-${theme.base}-500/40 border-none`
                : "bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200"
            }`}
            onClick={() => {
              navigate("/checkout", {
                state: { selectedTier: tier.planId, billingCycle },
              });
            }}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
               {tier.cta} <ArrowRight className="size-5 group-hover/btn:translate-x-1.5 transition-transform" />
            </span>
            {tier.highlighted && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />}
          </Button>
          
          {tier.highlighted && (
             <div className={`absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] h-20 bg-${theme.base}-500/10 blur-[60px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity`} />
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}


export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/subscriptions/plans");
        if (res.status === 200) {
          const data = res.data;
          setPricingTiers(data.filter((t: any) => t.isActive));
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Mesh Gradient Aura Background */}
        <section className="relative pt-32 pb-48 overflow-hidden bg-white">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[30%] -left-[10%] w-[80%] h-[80%] bg-blue-100/40 rounded-full blur-[140px]" />
            <div className="absolute top-[10%] -right-[10%] w-[60%] h-[60%] bg-indigo-100/30 rounded-full blur-[110px]" />
            <div className="absolute -bottom-[20%] left-[20%] w-[70%] h-[70%] bg-emerald-50/40 rounded-full blur-[130px] animate-pulse" />
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
              className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[1.05]"
            >
              Nâng tầm <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500">tin đăng</span><br /> 
              chốt khách <span className="italic relative">nhanh hơn</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-400 font-bold max-w-2xl mx-auto mb-16 leading-relaxed"
            >
              Chọn giải pháp hiển thị thông minh để tiếp cận đúng đối tượng khách hàng mục tiêu của bạn. 
              Hiệu quả gấp 10 lần so với phương pháp truyền thống.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center"
            >
              <div className="bg-white/40 backdrop-blur-3xl p-2 rounded-[2.5rem] border border-white shadow-2xl shadow-slate-200/50 inline-flex gap-2 relative z-20">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`relative px-8 py-3.5 rounded-xl text-sm font-black transition-all duration-300 ${
                    billingCycle === "monthly" ? "text-white" : "text-slate-500 hover:text-slate-900"
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
                    billingCycle === "yearly" ? "text-white" : "text-slate-500 hover:text-slate-900"
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
