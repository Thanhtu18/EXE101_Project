import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Search, FileText, PhoneCall, Star, Quote, Users, Building2, Map,
  TrendingUp, ArrowRight, Clock, Eye, Heart, CheckCircle2, Shield,
  ChevronLeft, ChevronRight, MapPin, Home
} from 'lucide-react';
import { useProperties } from '@/app/contexts/PropertiesContext';
import { PropertyCard } from '@/app/components/PropertyCard';
import { Footer } from '@/app/components/Footer';
import { Navbar } from '@/app/components/Navbar';
import { HeroCarousel } from '@/app/components/HeroCarousel';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { CompareFloatingBar } from '@/app/components/CompareFloatingBar';
import { Toaster } from '@/app/components/ui/sonner';

// ─── Statistics Counter Animation ─────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
      {count.toLocaleString('vi-VN')}{suffix}
    </div>
  );
}

// ─── District Data ────────────────────────────────────────────
const districts = [
  {
    name: 'Hoàn Kiếm',
    count: 120,
    image: 'https://images.unsplash.com/photo-1758104372177-6a234763a29b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMG9sZCUyMHF1YXJ0ZXIlMjBzdHJlZXR8ZW58MXx8fHwxNzcxOTE1Mjk4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Cầu Giấy',
    count: 245,
    image: 'https://images.unsplash.com/photo-1655793497773-67a550f0b07c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMENhdSUyMEdpYXklMjBkaXN0cmljdCUyMHVyYmFufGVufDF8fHx8MTc3MTkxNTI5OHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Đống Đa',
    count: 310,
    image: 'https://images.unsplash.com/photo-1764691596743-bc4641b56ef2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMHRlbXBsZSUyMGxha2UlMjBzY2VuaWN8ZW58MXx8fHwxNzcxOTE1MzA4fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Thanh Xuân',
    count: 280,
    image: 'https://images.unsplash.com/photo-1664853486186-66022ec86b83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUaGFuaCUyMFh1YW4lMjBIYW5vaSUyMFZpZXRuYW0lMjBhcGFydG1lbnR8ZW58MXx8fHwxNzcxOTE1MzA2fDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Ba Đình',
    count: 175,
    image: 'https://images.unsplash.com/photo-1701398690557-5f51adfbbc1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMEJhJTIwRGluaCUyMGhpc3RvcmljYWx8ZW58MXx8fHwxNzcxOTE1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Hai Bà Trưng',
    count: 195,
    image: 'https://images.unsplash.com/photo-1576207225512-bcf05c334283?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxIYW5vaSUyMEhhaSUyMEJhJTIwVHJ1bmclMjBjaXR5fGVufDF8fHx8MTc3MTkxNTMwMHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

// ─── Testimonials Data ────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    name: 'Nguyễn Minh Anh',
    role: 'Sinh viên ĐH Bách Khoa',
    avatar: 'MA',
    rating: 5,
    text: 'Mình tìm được phòng trọ ưng ý chỉ sau 2 ngày sử dụng MapHome. Tính năng bản đồ giúp mình xem được trọ gần trường lắm, đi bộ chỉ 10 phút!',
  },
  {
    id: 2,
    name: 'Trần Văn Đức',
    role: 'Nhân viên văn phòng',
    avatar: 'VĐ',
    rating: 5,
    text: 'Hệ thống xác thực Trust is King giúp mình yên tâm hơn khi tìm trọ. Không lo bị lừa đảo hay tin ảo nữa. Chủ trọ cũng rất nhiệt tình!',
  },
  {
    id: 3,
    name: 'Lê Thị Hương',
    role: 'Chủ trọ Đống Đa',
    avatar: 'TH',
    rating: 5,
    text: 'Mình đăng tin trên MapHome được rất nhiều khách hỏi. Giao diện đơn giản, dễ sử dụng. Phòng mình cho thuê luôn kín khách nhờ MapHome!',
  },
  {
    id: 4,
    name: 'Phạm Quốc Bảo',
    role: 'Sinh viên ĐH Quốc Gia',
    avatar: 'QB',
    rating: 4,
    text: 'Tính năng tìm trọ gần trường rất tiện. Mình so sánh được nhiều phòng cùng lúc và chọn phòng phù hợp túi tiền nhất. Cảm ơn MapHome!',
  },
  {
    id: 5,
    name: 'Hoàng Thu Trang',
    role: 'Freelancer',
    avatar: 'TT',
    rating: 5,
    text: 'Đặt lịch xem phòng online tiện lắm, không phải gọi điện qua lại. Phòng đúng như mô tả vì đã được xác thực GPS. Highly recommend!',
  },
];

// ─── Blog Data ────────────────────────────────────────────────
const blogPosts = [
  {
    id: 1,
    title: '10 mẹo tìm nhà trọ giá rẻ cho sinh viên Hà Nội',
    excerpt: 'Hướng dẫn chi tiết cách tìm phòng trọ phù hợp với ngân sách sinh viên, từ việc chọn khu vực đến thương lượng giá thuê.',
    image: 'https://images.unsplash.com/photo-1642098089566-09d0e6248eb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHN0dWRlbnQlMjBtb3ZpbmclMjBhcGFydG1lbnR8ZW58MXx8fHwxNzcxOTE1MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Kinh nghiệm',
    date: '20/02/2026',
    readTime: '5 phút',
    views: 1234,
  },
  {
    id: 2,
    title: 'Cách trang trí phòng trọ đẹp với chi phí dưới 500k',
    excerpt: 'Biến phòng trọ nhỏ trở nên ấm cúng và xinh xắn với những mẹo decor đơn giản, tiết kiệm nhưng hiệu quả.',
    image: 'https://images.unsplash.com/photo-1677100091551-748c921e6609?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcGFydG1lbnQlMjBpbnRlcmlvciUyMGRlY29yYXRpb24lMjB0aXBzfGVufDF8fHx8MTc3MTkxNTMwMnww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Mẹo hay',
    date: '18/02/2026',
    readTime: '4 phút',
    views: 892,
  },
  {
    id: 3,
    title: 'Quyền lợi và nghĩa vụ khi thuê nhà trọ',
    excerpt: 'Tìm hiểu các quy định pháp luật quan trọng để bảo vệ quyền lợi người thuê và tránh rủi ro khi ký hợp đồng.',
    image: 'https://images.unsplash.com/photo-1764959136028-104ebd1d3f20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWV0bmFtJTIwaG91c2luZyUyMHRpcHMlMjBibG9nfGVufDF8fHx8MTc3MTkxNTMwMXww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'Pháp luật',
    date: '15/02/2026',
    readTime: '6 phút',
    views: 2103,
  },
];

// ─── Main Component ──────────────────────────────────────────
export function HomePage() {
  const navigate = useNavigate();
  const propertySliderRef = useRef<Slider>(null);
  const testimonialSliderRef = useRef<Slider>(null);

  const { properties } = useProperties();
  const verifiedProperties = properties.filter(
    p => p.verificationLevel === 'phone-verified' || p.verificationLevel === 'location-verified'
  ).slice(0, 8);

  const propertySliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const testimonialSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen w-screen bg-white flex flex-col">
      <Navbar />
      <HeroCarousel />

      <main className="flex-1">

        {/* ━━━ Statistics Section ━━━ */}
        <section className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            {[
              { icon: Building2, target: 1500, suffix: '+', label: 'Phòng trọ' },
              { icon: Users, target: 8200, suffix: '+', label: 'Người dùng' },
              { icon: Map, target: 12, suffix: '', label: 'Quận / Huyện' },
              { icon: CheckCircle2, target: 95, suffix: '%', label: 'Hài lòng' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <stat.icon className="size-7 md:size-8 text-green-200 mx-auto" />
                <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                <p className="text-green-100 text-sm md:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━ Features ━━━ */}
        <section className="max-w-6xl mx-auto py-12 md:py-20 px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Tại Sao Chọn MapHome?
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-500 max-w-2xl mx-auto">
              Nền tảng tìm trọ hiện đại với công nghệ tiên tiến, giúp bạn tìm được ngôi nhà thứ hai dễ dàng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
            {[
              {
                icon: MapPin,
                gradient: 'from-green-500 to-emerald-600',
                title: 'Bản đồ tương tác',
                desc: 'Xem vị trí chính xác và khám phá các tiện ích xung quanh như bệnh viện, trường học, siêu thị',
              },
              {
                icon: Home,
                gradient: 'from-blue-500 to-indigo-600',
                title: 'Thông tin đầy đủ',
                desc: 'Chi tiết về giá cả, diện tích, tiện nghi, hình ảnh thực tế và thông tin liên hệ chủ trọ',
              },
              {
                icon: Shield,
                gradient: 'from-purple-500 to-pink-600',
                title: 'Trust is King',
                desc: 'Hệ thống xác thực 3 cấp độ: Chưa xác thực, xác thực SĐT, và xác thực vị trí GPS',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100"
              >
                <div className={`bg-gradient-to-br ${f.gradient} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <f.icon className="size-7 md:size-8 text-white" />
                </div>
                <h3 className="font-bold text-lg md:text-xl mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ━━━ How It Works ━━━ */}
        <section className="bg-gray-50 py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Tìm trọ chỉ với 4 bước
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-500">
                Quy trình đơn giản, nhanh chóng, hiệu quả
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { step: 1, icon: Search, title: 'Tìm kiếm', desc: 'Nhập khu vực, mức giá hoặc tìm gần chỗ làm/trường học', color: 'bg-blue-500' },
                { step: 2, icon: Map, title: 'Xem bản đồ', desc: 'Khám phá vị trí thực tế trên bản đồ, xem tiện ích xung quanh', color: 'bg-green-500' },
                { step: 3, icon: FileText, title: 'So sánh', desc: 'Đánh giá giá cả, diện tích, tiện nghi và mức độ xác thực', color: 'bg-purple-500' },
                { step: 4, icon: PhoneCall, title: 'Liên hệ', desc: 'Gọi trực tiếp hoặc đặt lịch xem phòng online nhanh chóng', color: 'bg-orange-500' },
              ].map((s, i) => (
                <div key={s.step} className="relative text-center">
                  {/* Connector line */}
                  {i < 3 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gray-200 z-0" />
                  )}
                  <div className="relative z-10">
                    <div className={`${s.color} w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <s.icon className="size-7 md:size-9 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 left-1/2 ml-5 md:ml-7 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-gray-700 border border-gray-200">
                      {s.step}
                    </div>
                    <h3 className="font-bold text-base md:text-lg mb-1.5">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed max-w-[220px] mx-auto">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Verified Properties Carousel ━━━ */}
        <section className="max-w-7xl mx-auto py-12 md:py-20 px-4">
          <div className="text-center mb-6 md:mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-3">
              <CheckCircle2 className="size-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">Đã xác thực</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              Nhà Trọ Uy Tín
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-500">
              Các tin đăng được xác thực qua hệ thống Trust is King
            </p>
          </div>

          <div className="relative group">
            <button
              onClick={() => propertySliderRef.current?.slickPrev()}
              className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
            >
              <ChevronLeft className="size-5 text-gray-700" />
            </button>
            <button
              onClick={() => propertySliderRef.current?.slickNext()}
              className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
            >
              <ChevronRight className="size-5 text-gray-700" />
            </button>

            <div className="property-carousel-wrapper">
              <Slider ref={propertySliderRef} {...propertySliderSettings}>
                {verifiedProperties.map(property => (
                  <div key={property.id} className="px-2 pb-4">
                    <PropertyCard
                      property={property}
                      onClick={() => navigate(`/room/${property.id}`)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>

          <div className="text-center mt-6 md:mt-8">
            <Button
              onClick={() => navigate('/map')}
              size="lg"
              className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
            >
              Xem tất cả trên bản đồ
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </section>

        {/* ━━━ Browse by District ━━━ */}
        <section className="bg-gray-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Khám Phá Theo Quận
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-500">
                Các khu vực có nhiều nhà trọ nhất tại Hà Nội
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {districts.map((d) => (
                <button
                  key={d.name}
                  onClick={() => navigate('/map')}
                  className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer"
                >
                  <ImageWithFallback
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5">
                    <h3 className="text-white font-bold text-base md:text-xl">{d.name}</h3>
                    <p className="text-white/80 text-xs md:text-sm">{d.count} phòng trọ</p>
                  </div>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-semibold text-green-700 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="size-3 inline mr-1" />
                    Hot
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ━━━ Testimonials ━━━ */}
        <section className="py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Người Dùng Nói Gì?
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-gray-500">
                Hàng nghìn người đã tìm được nhà trọ ưng ý qua MapHome
              </p>
            </div>

            <div className="relative group">
              <button
                onClick={() => testimonialSliderRef.current?.slickPrev()}
                className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
              >
                <ChevronLeft className="size-5 text-gray-700" />
              </button>
              <button
                onClick={() => testimonialSliderRef.current?.slickNext()}
                className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-all opacity-0 group-hover:opacity-100 border border-gray-200"
              >
                <ChevronRight className="size-5 text-gray-700" />
              </button>

              <div className="testimonial-carousel-wrapper">
                <Slider ref={testimonialSliderRef} {...testimonialSliderSettings}>
                  {testimonials.map((t) => (
                    <div key={t.id} className="px-2 pb-4">
                      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow h-full">
                        <Quote className="size-8 text-green-200 mb-3" />
                        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
                          {t.text}
                        </p>
                        <div className="flex items-center gap-1 mb-4">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`size-4 ${i < t.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                            {t.avatar}
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-900">{t.name}</p>
                            <p className="text-xs text-gray-500">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ Blog / Tips ━━━ */}
        <section className="bg-gray-50 py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-end justify-between mb-8 md:mb-12">
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Kinh Nghiệm Thuê Trọ
                </h2>
                <p className="text-sm md:text-base text-gray-500">
                  Mẹo hay và kiến thức hữu ích cho người thuê trọ
                </p>
              </div>
              <Button
                variant="ghost"
                className="hidden md:flex items-center text-green-700 hover:text-green-800"
                onClick={() => navigate('/blog')}
              >
                Xem tất cả
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {blogPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group border border-gray-100"
                  onClick={() => navigate('/blog')}
                >
                  <div className="relative h-44 overflow-hidden">
                    <ImageWithFallback
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full text-green-700">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-base mb-2 line-clamp-2 group-hover:text-green-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="size-3.5" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="size-3.5" />
                          {post.views.toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-6 md:hidden">
              <Button
                variant="outline"
                onClick={() => navigate('/blog')}
              >
                Xem tất cả bài viết
                <ArrowRight className="size-4 ml-1" />
              </Button>
            </div>
          </div>
        </section>

        {/* ━━━ CTA for Landlords ━━━ */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1649663724528-3bd2ce98b6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW50YWwlMjBwcm9wZXJ0eSUyMGxhbmRsb3JkJTIwbWVldGluZ3xlbnwxfHx8fDE3NzE5MTUzMDF8MA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Landlord CTA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/70" />
          </div>
          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full mb-5">
              <Heart className="size-4 text-red-400" />
              <span className="text-sm text-white/90">Dành cho chủ trọ</span>
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
              Bạn Có Phòng Cho Thuê?
            </h2>
            <p className="text-white/80 text-sm md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Đăng tin miễn phí, tiếp cận hàng nghìn người tìm trọ mỗi ngày.
              Hệ thống xác thực giúp tin đăng của bạn được ưu tiên hiển thị.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 shadow-xl"
                onClick={() => navigate('/post-room')}
              >
                <FileText className="size-4 mr-2" />
                Đăng tin ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10 px-8"
                onClick={() => navigate('/contact')}
              >
                Tìm hiểu thêm
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <CompareFloatingBar />
      <Toaster />
    </div>
  );
}