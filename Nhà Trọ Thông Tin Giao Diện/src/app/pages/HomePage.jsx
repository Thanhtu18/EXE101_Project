import { useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Button } from "@/app/components/ui/button";
import {
  MapPin,
  CheckCircle2,
  Search,
  Map,
  Star,
  FileText,
  ArrowRight,
  Clock,
  Eye,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { mockRentalProperties } from "@/app/components/mockData";
import { PropertyCard } from "@/app/components/PropertyCard";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";
import { HeroCarousel } from "@/app/components/HeroCarousel";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import { CompareFloatingBar } from "@/app/components/CompareFloatingBar";
import { Toaster } from "@/app/components/ui/sonner";

/* ================= Animated Counter ================= */

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          let start = 0;
          const duration = 2000;
          const step = target / 60;

          const timer = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, duration / 60);
        }
      },
      { threshold: 0.4 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-bold text-white">
      {count}
      {suffix}
    </div>
  );
}

/* ================= Home Page ================= */

export function HomePage() {
  const navigate = useNavigate();
  const propertySliderRef = useRef(null);

  const verifiedProperties = mockRentalProperties
    .filter(
      (p) =>
        p.verificationLevel === "phone-verified" ||
        p.verificationLevel === "location-verified",
    )
    .slice(0, 8);

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <HeroCarousel />

      <main className="flex-1">
        {/* ===== Statistics ===== */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 py-12">
          <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <AnimatedCounter target={1200} suffix="+" />
              <p className="text-white/80 text-sm mt-2">Phòng trọ</p>
            </div>
            <div>
              <AnimatedCounter target={3500} suffix="+" />
              <p className="text-white/80 text-sm mt-2">Người dùng</p>
            </div>
            <div>
              <AnimatedCounter target={420} suffix="+" />
              <p className="text-white/80 text-sm mt-2">Tin xác thực</p>
            </div>
            <div>
              <AnimatedCounter target={98} suffix="%" />
              <p className="text-white/80 text-sm mt-2">Hài lòng</p>
            </div>
          </div>
        </section>

        {/* ===== Verified Properties ===== */}
        <section className="max-w-7xl mx-auto py-16 px-4">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-4">
              <CheckCircle2 className="size-5 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                Đã xác thực
              </span>
            </div>

            <h2 className="text-3xl font-bold mb-2">Nhà Trọ Uy Tín</h2>
            <p className="text-gray-500">
              Các tin đăng được xác thực qua hệ thống Trust is King
            </p>
          </div>

          <div className="relative group">
            <button
              onClick={() => propertySliderRef.current?.slickPrev()}
              className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft />
            </button>

            <button
              onClick={() => propertySliderRef.current?.slickNext()}
              className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow rounded-full w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100"
            >
              <ChevronRight />
            </button>

            <Slider ref={propertySliderRef} {...sliderSettings}>
              {verifiedProperties.map((property) => (
                <div key={property.id} className="px-2">
                  <PropertyCard
                    property={property}
                    onClick={() => navigate(`/room/${property.id}`)}
                  />
                </div>
              ))}
            </Slider>
          </div>

          <div className="text-center mt-8">
            <Button
              onClick={() => navigate("/map")}
              className="bg-green-600 hover:bg-green-700 text-white px-8"
            >
              Xem tất cả
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </section>

        {/* ===== Blog Section ===== */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center">
              Kinh Nghiệm Thuê Trọ
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition"
                >
                  <h3 className="font-semibold mb-2">Bài viết mẫu {i}</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Nội dung blog demo hiển thị tại đây.
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />5 phút
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      1.200
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-green-600 py-20 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Bạn Có Phòng Cho Thuê?</h2>
          <p className="mb-8 text-white/80">
            Đăng tin miễn phí và tiếp cận hàng nghìn người tìm trọ mỗi ngày.
          </p>
          <Button
            size="lg"
            className="bg-white text-green-700 hover:bg-gray-100"
            onClick={() => navigate("/post-room")}
          >
            <FileText className="mr-2 size-4" />
            Đăng tin ngay
          </Button>
        </section>
      </main>

      <Footer />
      <CompareFloatingBar />
      <Toaster />
    </div>
  );
}
