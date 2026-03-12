import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { RentalMapView } from "@/app/components/RentalMapView";
import { PropertyList } from "@/app/components/PropertyList";
import { PropertyCard } from "@/app/components/PropertyCard";
import { mockRentalProperties } from "@/app/components/mockData";
import { RentalProperty } from "@/app/components/types";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search, MapIcon, List, X, Home, ArrowLeft, Heart } from "lucide-react";
import { FilterPanel, defaultFilters } from "@/app/components/FilterPanel";
import { SearchByWorkplace } from "@/app/components/SearchByWorkplace";
import {
  addDistanceToProperties,
  formatDistance,
  findOptimalLocation,
} from "@/app/utils/distanceCalculator";
import { useFavorites } from "@/app/hooks/useFavorites";
import { CompareFloatingBar } from "@/app/components/CompareFloatingBar";
import { Toaster } from "@/app/components/ui/sonner";

export function MapPage() {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("map");
  const [filters, setFilters] = useState(defaultFilters);
  const [searchLocations, setSearchLocations] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, favoritesCount } = useFavorites();

  // User location (simulated - near Nhà thờ Đức Bà, TP.HCM)
  const userLocation = [10.7769, 106.7009];

  // Calculate optimal center point for multi-location search
  const searchCenter = useMemo(() => {
    if (searchLocations.length === 0) return userLocation;
    if (searchLocations.length === 1) return searchLocations[0].coordinates;
    return findOptimalLocation(searchLocations.map((l) => l.coordinates));
  }, [searchLocations, userLocation]);

  // Add distances to all properties
  const propertiesWithDistance = useMemo(() => {
    return addDistanceToProperties(mockRentalProperties, searchCenter);
  }, [searchCenter]);

  // Apply all filters
  const filteredProperties = useMemo(() => {
    let result = propertiesWithDistance;

    // Text search
    if (searchTerm) {
      result = result.filter(
        (property) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((property) => isFavorite(property.id));
    }

    // Radius filter
    result = result.filter((property) => property.distance <= filters.radius);

    // Price range filter
    result = result.filter(
      (property) =>
        property.price >= filters.priceRange[0] &&
        property.price <= filters.priceRange[1],
    );

    // Area range filter
    result = result.filter(
      (property) =>
        property.area >= filters.areaRange[0] &&
        property.area <= filters.areaRange[1],
    );

    // Amenities filter
    const selectedAmenities = Object.entries(filters.amenities)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    if (selectedAmenities.length > 0) {
      result = result.filter((property) =>
        selectedAmenities.every((amenity) => property.amenities[amenity]),
      );
    }

    // Availability filter
    if (filters.availability !== "all") {
      result = result.filter((property) =>
        filters.availability === "available"
          ? property.available
          : !property.available,
      );
    }

    // Verification level filter
    if (filters.verificationLevel !== "all") {
      if (filters.verificationLevel === "location-verified") {
        result = result.filter(
          (property) => property.verificationLevel === "location-verified",
        );
      } else if (filters.verificationLevel === "phone-verified") {
        result = result.filter(
          (property) =>
            property.verificationLevel === "phone-verified" ||
            property.verificationLevel === "location-verified",
        );
      }
    }

    // Sorting
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "distance":
        result.sort((a, b) => a.distance - b.distance);
        break;
      case "area":
        result.sort((a, b) => b.area - a.area);
        break;
    }

    return result;
  }, [propertiesWithDistance, searchTerm, filters, showFavoritesOnly]);

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (
      filters.priceRange[0] !== defaultFilters.priceRange[0] ||
      filters.priceRange[1] !== defaultFilters.priceRange[1]
    )
      count++;
    if (
      filters.areaRange[0] !== defaultFilters.areaRange[0] ||
      filters.areaRange[1] !== defaultFilters.areaRange[1]
    )
      count++;
    if (Object.values(filters.amenities).some((v) => v)) count++;
    if (filters.availability !== "all") count++;
    if (filters.verificationLevel !== "all") count++;
    if (filters.radius !== defaultFilters.radius) count++;
    return count;
  }, [filters]);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="mr-2"
              >
                <ArrowLeft className="size-5" />
              </Button>
              <Home className="size-6 text-green-600" />
              <h1 className="text-3xl font-bold text-gray-900">MapHome</h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="flex items-center gap-2"
              >
                <Heart
                  className={`size-4 ${showFavoritesOnly ? "fill-current" : ""}`}
                />
                Yêu thích ({favoritesCount})
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                onClick={() => setViewMode("map")}
                className="flex items-center gap-2"
              >
                <MapIcon className="size-4" />
                Bản đồ
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                className="flex items-center gap-2"
              >
                <List className="size-4" />
                Danh sách
              </Button>
            </div>
          </div>

          <div className="flex gap-2 items-center flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc địa chỉ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {searchTerm && (
              <Button variant="ghost" onClick={() => setSearchTerm("")}>
                <X className="size-4 mr-2" />
                Xóa
              </Button>
            )}
            <FilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              activeFiltersCount={activeFiltersCount}
            />
            <SearchByWorkplace
              onSearch={setSearchLocations}
              currentLocations={searchLocations}
            />
          </div>

          {/* Search Location Tags */}
          {searchLocations.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <span className="text-sm text-gray-600">
                Tìm gần chỗ làm/trường
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "map" ? (
          <div className="h-full w-full flex">
            {/* Map */}
            <div className={`${selectedProperty ? "w-2/3" : "w-full"} h-full`}>
              <RentalMapView
                properties={propertiesWithDistance}
                onPropertyClick={setSelectedProperty}
              />
            </div>

            {/* Selected Property Details */}
            {selectedProperty && (
              <div className="w-1/3 bg-white border-l border-gray-200 overflow-y-auto">
                <div className="p-4 border-b flex items-center justify-between">
                  <h3 className="font-semibold">Thông tin phòng</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedProperty(null)}
                  >
                    <X className="size-5" />
                  </Button>
                </div>
                <div className="p-4">
                  <PropertyCard property={selectedProperty} />
                  {/* Pin Info */}
                  {selectedProperty.pinInfo && (
                    <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">📌</span>
                        <p className="text-sm font-semibold text-orange-900">
                          Chủ trọ đã ghim vị trí
                        </p>
                      </div>
                      {selectedProperty.pinInfo.note && (
                        <p className="text-sm text-orange-700 italic mb-2">
                          "{selectedProperty.pinInfo.note}"
                        </p>
                      )}
                      <p className="text-xs text-orange-600">
                        Ghim lúc:{" "}
                        {new Date(
                          selectedProperty.pinInfo.pinnedAt,
                        ).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  )}
                  {/* Distance Info */}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      📍 Khoảng cách
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatDistance(
                        propertiesWithDistance.find(
                          (p) => p.id === selectedProperty.id,
                        )?.distance || 0,
                      )}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {searchLocations.length > 0
                        ? `Từ ${searchLocations.length === 1 ? searchLocations[0].name : `${searchLocations.length} địa điểm đã chọn`}`
                        : "Từ vị trí của bạn"}
                    </p>
                  </div>
                  {/* View Detail Button */}
                  <Button
                    className="mt-4 w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                    onClick={() => navigate(`/room/${selectedProperty.id}`)}
                  >
                    Xem trang chi tiết đầy đủ →
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full w-full">
            <PropertyList
              properties={filteredProperties}
              onPropertySelect={setSelectedProperty}
            />
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <footer className="bg-white border-t py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm text-gray-600 flex-wrap gap-2">
          <span>
            Tìm thấy{" "}
            <strong className="text-blue-600">
              {filteredProperties.length}
            </strong>{" "}
            nhà trọ
          </span>
          <span>
            📌 Đã ghim:{" "}
            <strong className="text-orange-600">
              {filteredProperties.filter((p) => p.pinInfo).length}
            </strong>
          </span>
          <span>
            Còn phòng:{" "}
            <strong className="text-green-600">
              {filteredProperties.filter((p) => p.available).length}
            </strong>
          </span>
          <span>
            Giá TB:{" "}
            <strong>
              {filteredProperties.length > 0
                ? Math.round(
                    filteredProperties.reduce((sum, p) => sum + p.price, 0) /
                      filteredProperties.length,
                  ).toLocaleString("vi-VN")
                : 0}
              đ/tháng
            </strong>
          </span>
          {searchLocations.length > 0 && (
            <span>
              Tìm gần{" "}
              <strong className="text-blue-600">
                {searchLocations.length}
              </strong>{" "}
              địa điểm
            </span>
          )}
        </div>
      </footer>
      <CompareFloatingBar />
      <Toaster />
    </div>
  );
}
