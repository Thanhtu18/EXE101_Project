import { useState } from "react";
import { useNavigate } from "react-router";
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
import { VerificationBadge, UnverifiedWarning } from "./VerificationBadge";
import { BookingDialog } from "./BookingDialog";
import { useFavorites } from "@/app/hooks/useFavorites";
import { useCompare } from "@/app/contexts/CompareContext";
import { toast } from "sonner";

const amenityIcons = {
  wifi: { icon: Wifi, label: "WiFi" },
  furniture: { icon: Sofa, label: "Nội thất" },
  tv: { icon: Tv, label: "TV" },
  washingMachine: { icon: WashingMachine, label: "Máy giặt" },
  kitchen: { icon: Utensils, label: "Bếp" },
  refrigerator: { icon: Refrigerator, label: "Tủ lạnh" },
  airConditioner: { icon: Wind, label: "Máy lạnh" },
};

export function PropertyCard({ property, compact = false, onClick }) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCompare, removeFromCompare, isInCompare, compareList } =
    useCompare();
  const navigate = useNavigate();
  const favorite = isFavorite(property.id);
  const inCompare = isInCompare(property.id);

  const activeAmenities = Object.entries(property.amenities)
    .filter(([_, value]) => value)
    .map(([key]) => key);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(property.id);
  };

  const handleCompareClick = (e) => {
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(property.id);
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
              const { icon: Icon, label } = amenityIcons[amenity];
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
    <Card
      className="hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-gray-200"
      onClick={onClick}
    >
      <div className="relative h-44 w-full">
        <ImageWithFallback
          src={property.image}
          alt={property.name}
          className="w-full h-full object-cover"
        />
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
          className="absolute top-2 right-2 bg-white/90 hover:bg-white shadow-md h-8 w-8"
          onClick={handleFavoriteClick}
        >
          <Heart
            className={`size-4 ${favorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
          />
        </Button>
      </div>
      <CardHeader className="pb-2 pt-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <CardTitle className="text-lg leading-tight">
                {property.name}
              </CardTitle>
            </div>
            <VerificationBadge
              level={property.verificationLevel}
              verifiedAt={property.verifiedAt}
              locationAccuracy={property.locationAccuracy}
              size="sm"
            />
            <p className="text-xs text-gray-600 mt-1.5 line-clamp-1">
              {property.address}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 pt-0">
        {/* Verification Warning/Info */}
        {property.verificationLevel === "unverified" && <UnverifiedWarning />}

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-xl font-bold text-blue-600">
              {property.price.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-gray-500">/tháng</p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold">{property.area}m²</p>
            <p className="text-xs text-gray-500">Diện tích</p>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold mb-1.5 text-gray-700">
            Tiện ích:
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {activeAmenities.slice(0, 4).map((amenity) => {
              const { icon: Icon, label } = amenityIcons[amenity];
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
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-xs h-8"
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
                navigate(`/room/${property.id}`);
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
  );
}
