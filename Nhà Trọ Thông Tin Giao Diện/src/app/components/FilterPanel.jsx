import { useState } from "react";
import { Filter, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Slider } from "@/app/components/ui/slider";
import { Checkbox } from "@/app/components/ui/checkbox";
import { Label } from "@/app/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Badge } from "@/app/components/ui/badge";

export const defaultFilters = {
  priceRange: [1000000, 10000000],
  areaRange: [10, 50],
  amenities: {
    wifi: false,
    furniture: false,
    tv: false,
    washingMachine: false,
    kitchen: false,
    refrigerator: false,
    airConditioner: false,
  },
  verificationLevel: "all",
  availability: "all",
  sortBy: "distance",
  radius: 5,
};

export function FilterPanel({ filters, onFiltersChange, activeFiltersCount }) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    area: true,
    amenities: true,
    verification: true,
    availability: true,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleReset = () => {
    onFiltersChange(defaultFilters);
  };

  const formatPrice = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}tr`;
    }
    return `${value / 1000}k`;
  };

  const updateFilter = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateAmenity = (amenity, checked) => {
    onFiltersChange({
      ...filters,
      amenities: { ...filters.amenities, [amenity]: checked },
    });
  };

  const selectedAmenitiesCount = Object.values(filters.amenities).filter(
    Boolean,
  ).length;

  const amenityLabels = {
    wifi: "📶 WiFi",
    furniture: "🛋️ Full nội thất",
    tv: "📺 TV",
    washingMachine: "🧺 Máy giặt",
    kitchen: "🍳 Bếp",
    refrigerator: "❄️ Tủ lạnh",
    airConditioner: "❄️ Máy lạnh",
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <Filter className="size-4 mr-2" />
          Lọc & Sắp xếp
          {activeFiltersCount > 0 && (
            <Badge
              className="ml-2 px-1.5 py-0 h-5 min-w-[20px]"
              variant="destructive"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">Bộ lọc tìm kiếm</SheetTitle>
          <SheetDescription>
            Tùy chỉnh kết quả tìm kiếm theo nhu cầu của bạn
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Reset Button */}
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <X className="size-4 mr-2" />
              Đặt lại bộ lọc
            </Button>
          </div>

          {/* Sort By */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Sắp xếp theo</Label>
            <RadioGroup
              value={filters.sortBy}
              onValueChange={(value) => updateFilter("sortBy", value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="distance" id="sort-distance" />
                <Label
                  htmlFor="sort-distance"
                  className="cursor-pointer font-normal"
                >
                  Khoảng cách gần nhất
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-asc" id="sort-price-asc" />
                <Label
                  htmlFor="sort-price-asc"
                  className="cursor-pointer font-normal"
                >
                  Giá thấp đến cao
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="price-desc" id="sort-price-desc" />
                <Label
                  htmlFor="sort-price-desc"
                  className="cursor-pointer font-normal"
                >
                  Giá cao đến thấp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="area" id="sort-area" />
                <Label
                  htmlFor="sort-area"
                  className="cursor-pointer font-normal"
                >
                  Diện tích lớn nhất
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Radius */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Bán kính tìm kiếm</Label>
            <div className="space-y-2">
              <Slider
                value={[filters.radius]}
                onValueChange={(value) => updateFilter("radius", value[0])}
                min={1}
                max={20}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1km</span>
                <span className="font-semibold text-blue-600">
                  {filters.radius}km
                </span>
                <span>20km</span>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("price")}
              className="flex items-center justify-between w-full"
            >
              <Label className="text-base font-semibold cursor-pointer">
                Khoảng giá
              </Label>
              {expandedSections.price ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
            {expandedSections.price && (
              <div className="space-y-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => updateFilter("priceRange", value)}
                  min={1000000}
                  max={10000000}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{formatPrice(filters.priceRange[0])}</span>
                  <span className="font-semibold text-blue-600">
                    {formatPrice(filters.priceRange[0])} -{" "}
                    {formatPrice(filters.priceRange[1])}
                  </span>
                  <span>{formatPrice(filters.priceRange[1])}</span>
                </div>
              </div>
            )}
          </div>

          {/* Area Range */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("area")}
              className="flex items-center justify-between w-full"
            >
              <Label className="text-base font-semibold cursor-pointer">
                Diện tích (m²)
              </Label>
              {expandedSections.area ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
            {expandedSections.area && (
              <div className="space-y-2">
                <Slider
                  value={filters.areaRange}
                  onValueChange={(value) => updateFilter("areaRange", value)}
                  min={10}
                  max={50}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>10m²</span>
                  <span className="font-semibold text-blue-600">
                    {filters.areaRange[0]}m² - {filters.areaRange[1]}m²
                  </span>
                  <span>50m²</span>
                </div>
              </div>
            )}
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("amenities")}
              className="flex items-center justify-between w-full"
            >
              <Label className="text-base font-semibold cursor-pointer">
                Tiện nghi
                {selectedAmenitiesCount > 0 && (
                  <Badge className="ml-2" variant="secondary">
                    {selectedAmenitiesCount}
                  </Badge>
                )}
              </Label>
              {expandedSections.amenities ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
            {expandedSections.amenities && (
              <div className="space-y-3">
                {Object.entries(filters.amenities).map(([key, value]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={value}
                      onCheckedChange={(checked) => updateAmenity(key, checked)}
                    />
                    <Label htmlFor={key} className="cursor-pointer font-normal">
                      {amenityLabels[key]}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("availability")}
              className="flex items-center justify-between w-full"
            >
              <Label className="text-base font-semibold cursor-pointer">
                Tình trạng
              </Label>
              {expandedSections.availability ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
            {expandedSections.availability && (
              <RadioGroup
                value={filters.availability}
                onValueChange={(value) => updateFilter("availability", value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="availability-all" />
                  <Label
                    htmlFor="availability-all"
                    className="cursor-pointer font-normal"
                  >
                    Tất cả
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="available"
                    id="availability-available"
                  />
                  <Label
                    htmlFor="availability-available"
                    className="cursor-pointer font-normal"
                  >
                    Còn phòng
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="unavailable"
                    id="availability-unavailable"
                  />
                  <Label
                    htmlFor="availability-unavailable"
                    className="cursor-pointer font-normal"
                  >
                    Hết phòng
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>

          {/* Verification Level */}
          <div className="space-y-3">
            <button
              onClick={() => toggleSection("verification")}
              className="flex items-center justify-between w-full"
            >
              <Label className="text-base font-semibold cursor-pointer">
                Mức xác thực
              </Label>
              {expandedSections.verification ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
            {expandedSections.verification && (
              <RadioGroup
                value={filters.verificationLevel}
                onValueChange={(value) =>
                  updateFilter("verificationLevel", value)
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="verification-all" />
                  <Label
                    htmlFor="verification-all"
                    className="cursor-pointer font-normal"
                  >
                    Tất cả
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="phone-verified"
                    id="verification-phone"
                  />
                  <Label
                    htmlFor="verification-phone"
                    className="cursor-pointer font-normal"
                  >
                    🔹 Xác thực SĐT trở lên
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="location-verified"
                    id="verification-location"
                  />
                  <Label
                    htmlFor="verification-location"
                    className="cursor-pointer font-normal"
                  >
                    ✅ Xác thực GPS
                  </Label>
                </div>
              </RadioGroup>
            )}
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6 pt-6 border-t">
          <Button className="w-full" size="lg" onClick={() => setIsOpen(false)}>
            Áp dụng bộ lọc
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
