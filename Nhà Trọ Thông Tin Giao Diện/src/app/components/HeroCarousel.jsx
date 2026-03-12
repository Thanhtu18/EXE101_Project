import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
  {
    id: 1,
    title: "Tìm Phòng Trọ Hoàn Hảo",
    subtitle: "Hàng ngàn phòng trọ chất lượng đang chờ bạn khám phá",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1920&h=800&fit=crop&q=80",
  },
  {
    id: 2,
    title: "Xác Thực 3 Cấp Độ",
    subtitle: "Trust is King - An toàn tuyệt đối cho mọi giao dịch",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920&h=800&fit=crop&q=80",
  },
  {
    id: 3,
    title: "Tìm Kiếm Thông Minh",
    subtitle: "Bản đồ tương tác với các tiện ích xung quanh",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=800&fit=crop&q=80",
  },
  {
    id: 4,
    title: "Giá Cả Hợp Lý",
    subtitle: "Tìm được nhà trọ phù hợp với túi tiền của bạn",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=800&fit=crop&q=80",
  },
];

function NextArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all"
      aria-label="Next slide"
    >
      <ChevronRight className="size-6" />
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white rounded-full p-2 transition-all"
      aria-label="Previous slide"
    >
      <ChevronLeft className="size-6" />
    </button>
  );
}

export function HeroCarousel() {
  const navigate = useNavigate();

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: (dots) => (
      <div className="bottom-6">
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <button className="w-3 h-3 rounded-full bg-white/50 hover:bg-white transition-colors" />
    ),
  };

  return (
    <div className="hero-carousel-wrapper relative -mt-4 md:-mt-0">
      <Slider {...settings}>
        {heroSlides.map((slide) => (
          <div key={slide.id} className="relative">
            <div
              className="relative h-[500px] md:h-[600px] lg:h-[700px] bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: "center center",
              }}
            >
              {/* Image Overlay for better text readability */}
              <div className="absolute inset-0 bg-black/30" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 text-white">
              <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold drop-shadow-2xl leading-tight">
                  {slide.title}
                </h1>
                <p className="text-base md:text-xl lg:text-2xl drop-shadow-lg text-white/95 max-w-2xl mx-auto">
                  {slide.subtitle}
                </p>
                <div className="pt-4 md:pt-6">
                  <Button
                    size="lg"
                    onClick={() => navigate("/map")}
                    className="text-base md:text-lg px-8 md:px-12 py-5 md:py-7 h-auto bg-white text-gray-900 hover:bg-gray-100 shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <MapPin className="size-5 md:size-6 mr-2" />
                    Khám phá ngay
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}
