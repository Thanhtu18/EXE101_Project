import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { RentalProperty } from "./types";
import {
  Wifi,
  Tv,
  WashingMachine,
  Utensils,
  Refrigerator,
  Wind,
  Sofa,
  Phone,
  User,
  Calendar,
  Heart,
  GitCompare,
  MapPin,
  Car,
  Droplets,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import {
  VerificationBadge,
  UnverifiedWarning,
  LocationVerificationInfo,
} from "./VerificationBadge";
import { BookingDialog } from "./BookingDialog";
import { useFavorites } from "@/app/hooks/useFavorites";
import { useCompare } from "@/app/contexts/CompareContext";
import { toast } from "sonner";
import { GreenBadgeMini } from "./GreenBadgeDisplay";

interface PropertyCardProps {
  property: RentalProperty;
  compact?: boolean;
  onClick?: () => void;
}

const amenityIcons = {
  wifi: { icon: Wifi, label: "WiFi" },
  furniture: { icon: Sofa, label: "Nội thất" },
  tv: { icon: Tv, label: "TV" },
  washingMachine: { icon: WashingMachine, label: "Máy giặt" },
  kitchen: { icon: Utensils, label: "Bếp" },
  refrigerator: { icon: Refrigerator, label: "Tủ lạnh" },
  airConditioner: { icon: Wind, label: "Máy lạnh" },
  parking: { icon: Car, label: "Chỗ để xe" },
  water: { icon: Droplets, label: "Nước nóng" },
  ac: { icon: Wind, label: "Máy lạnh" },
};

export function PropertyCard({
  property,
  compact = false,
  onClick,
}: PropertyCardProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCompare, removeFromCompare, isInCompare, compareList } =
    useCompare();
  const navigate = useNavigate();
  const propertyId = property._id || property.id;
  const favorite = isFavorite(propertyId);
  const inCompare = isInCompare(propertyId);

  const activeAmenities = Object.entries(property.amenities)
    .filter(([_, value]) => value)
    .map(([key]) => key as keyof typeof amenityIcons);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(propertyId);
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(propertyId);
      toast.success("Đã xóa khỏi danh sách so sánh");
    } else {
      if (compareList.length >= 4) {
        toast.error("Chỉ có thể so sánh tối đa 4 phòng cùng lúc");
        return;
      }
      addToCompare(property);
    }
  };

  if (compact) {
    return (
      <div className="w-64">
        <div className="relative">
          <ImageWithFallback
            src={property.image}
            alt={property.name}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          {property.greenBadge && property.greenBadge.level !== "none" && (
            <GreenBadgeMini level={property.greenBadge.level} />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={`size-4 ${favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
            />
          </Button>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-base mb-1">{property.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{property.address}</p>
          <p className="text-lg font-bold text-blue-600 mb-2">
            {property.price.toLocaleString("vi-VN")}đ/tháng
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {activeAmenities.slice(0, 4).map((amenity) => {
              const amenityInfo = (amenityIcons as any)[amenity];
              if (!amenityInfo) return null;
              const { icon: Icon, label } = amenityInfo;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  <Icon className="size-3" />
                  <span>{label}</span>
                </div>
              );
            })}
            {activeAmenities.length > 4 && (
              <span className="text-xs text-gray-500">
                +{activeAmenities.length - 4} tiện ích
              </span>
            )}
          </div>
          <div className="border-t pt-2 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <User className="size-3 text-gray-500" />
              <span className="font-medium">{property.ownerName}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${property.phone.replace(/\s/g, "")}`;
              }}
            >
              <Phone className="size-3 mr-1" />
              {property.phone}
            </Button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <motion.div
      whileHover={{ y: -12, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="will-change-transform"
    >
      <Card
        className="cursor-pointer overflow-hidden border-emerald-50 shadow-xl shadow-slate-200/50 hover:shadow-emerald-900/10 transition-shadow duration-500 bg-white rounded-[32px]"
        onClick={onClick}
      >

      <div className="relative h-44 w-full">
        <ImageWithFallback
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover"
        />
        {property.greenBadge && property.greenBadge.level !== "none" && (
          <GreenBadgeMini level={property.greenBadge.level} />
        )}
        <Badge
          variant={property.available ? "default" : "secondary"}
          className="absolute top-2 left-2 shadow-sm"
        >
          {property.available ? "Còn phòng" : "Hết phòng"}
        </Badge>
        {property.pinInfo && (
          <Badge className="absolute bottom-2 left-2 shadow-sm bg-orange-500 hover:bg-orange-600 text-white text-[10px] px-1.5 py-0.5">
            📌 Chủ trọ đã ghim
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-md hover:bg-white shadow-xl h-10 w-10 rounded-2xl will-change-transform"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`size-5 ${favorite ? "fill-red-500 text-red-500" : "text-emerald-950/40"}`}
          />
        </Button>
      </div>

      <CardHeader className="pb-2 pt-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl font-black text-emerald-950 tracking-tight leading-tight transition-colors line-clamp-1">
                {property.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <VerificationBadge
                level={property.verificationLevel}
                verifiedAt={property.verifiedAt}
                locationAccuracy={property.locationAccuracy}
                size="sm"
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-emerald-950/60 transition-all">
              <MapPin className="size-3.5 shrink-0" />
              <p className="text-xs font-medium line-clamp-1">
                {property.address}
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2.5 pt-0">
        {/* Verification Warning/Info */}
        {property.verificationLevel === "none" && <UnverifiedWarning />}

        <div className="flex items-center justify-between py-3 border-y border-emerald-50/50 my-2">
          <div>
            <p className="text-2xl font-black text-emerald-600 tracking-tighter">
              {property.price.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-widest">/ tháng</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-black text-emerald-950">{property.area}m²</p>
            <p className="text-[10px] font-bold text-emerald-950/40 uppercase tracking-widest">Diện tích</p>
          </div>
        </div>


        <div>
          <p className="text-xs font-semibold mb-1.5 text-gray-700">
            Tiện ích:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {activeAmenities.slice(0, 4).map((amenity) => {
              const amenityInfo = (amenityIcons as any)[amenity];
              if (!amenityInfo) return null;
              const { icon: Icon, label } = amenityInfo;
              return (
                <div
                  key={amenity}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <Icon className="size-3.5 text-blue-600" />
                  <span>{label}</span>
                </div>
              );
            })}
          </div>
          {activeAmenities.length > 4 && (
            <p className="text-xs text-gray-500 mt-1">
              +{activeAmenities.length - 4} tiện ích khác
            </p>
          )}
        </div>

        <div className="pt-2 border-t space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <User className="size-3.5 text-gray-500" />
            <span className="font-medium">{property.ownerName}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `tel:${property.phone.replace(/\s/g, "")}`;
              }}
            >
              <Phone className="size-3.5 mr-1.5" />
              Gọi
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs h-9 font-black shadow-lg rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                setIsBookingOpen(true);
              }}
            >
              <Calendar className="size-3.5 mr-1.5" />
              Đặt lịch
            </Button>

          </div>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Button
              variant="outline"
              size="sm"
              className={`text-xs h-8 ${
                inCompare
                  ? "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={handleCompareClick}
            >
              <GitCompare className="size-3.5 mr-1.5" />
              {inCompare ? "Đã chọn" : "So sánh"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 border-green-200 text-green-700 hover:bg-green-50"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/room/${propertyId}`);
              }}
            >
              Xem chi tiết →
            </Button>
          </div>
        </div>
      </CardContent>

      <BookingDialog
        open={isBookingOpen}
        onOpenChange={setIsBookingOpen}
        property={property}
      />
      </Card>
    </motion.div>
  );
}
