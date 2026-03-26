import { useState, useMemo, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { RentalMapView } from "@/app/components/RentalMapView";
import { PropertyList } from "@/app/components/PropertyList";
import { PropertyCard } from "@/app/components/PropertyCard";
import { useProperties } from "@/app/contexts/PropertiesContext";
import { RentalProperty, RentalFilters, PropertyWithDistance } from "@/app/components/types";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Search, MapIcon, List, X, Home, ArrowLeft, Heart } from "lucide-react";
import {
  FilterPanel,
  defaultFilters,
} from "@/app/components/FilterPanel";
import {
  SearchByWorkplace,
  SearchLocation,
} from "@/app/components/SearchByWorkplace";
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
  const { properties, searchProperties } = useProperties();

  const [selectedProperty, setSelectedProperty] =
    useState<RentalProperty | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [filters, setFilters] = useState<RentalFilters>(defaultFilters);
  const [searchLocations, setSearchLocations] = useState<SearchLocation[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { isFavorite, favoritesCount } = useFavorites();

  // User location (simulated - near Nhà thờ Đức Bà, TP.HCM)
  const userLocation: [number, number] = [10.7769, 106.7009];

  // Calculate optimal center point for multi-location search
  const searchCenter: [number, number] = useMemo(() => {
    if (searchLocations.length === 0) return userLocation;
    if (searchLocations.length === 1) return searchLocations[0].coordinates;
    return findOptimalLocation(searchLocations.map((l) => l.coordinates));
  }, [searchLocations, userLocation]);


  // Server-side search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      const selectedAmenities = Object.entries(filters.amenities)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(",");

      searchProperties({
        q: searchTerm,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        minArea: filters.areaRange[0],
        maxArea: filters.areaRange[1],
        amenities: selectedAmenities,
        verified: filters.verificationLevel === "verified" ? "true" : undefined
      });
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  // Add distances to all properties

  const propertiesWithDistance = useMemo(() => {
    return addDistanceToProperties(properties, searchCenter);
  }, [properties, searchCenter]);

  // Apply all filters
  const filteredProperties = useMemo(() => {
    let result = propertiesWithDistance;

    // Text search
    if (searchTerm) {
      result = result.filter(
        (property: PropertyWithDistance) =>
          property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Favorites filter
    if (showFavoritesOnly) {
      result = result.filter((property: PropertyWithDistance) => isFavorite(property.id));
    }

    // Radius filter
    result = result.filter((property: PropertyWithDistance) => property.distance <= filters.radius);


    // Sorting
    switch (filters.sortBy) {
      case "price-asc":
        result.sort((a: PropertyWithDistance, b: PropertyWithDistance) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a: PropertyWithDistance, b: PropertyWithDistance) => b.price - a.price);
        break;
      case "distance":
        result.sort((a: PropertyWithDistance, b: PropertyWithDistance) => a.distance - b.distance);
        break;
      case "area":
        result.sort((a: PropertyWithDistance, b: PropertyWithDistance) => b.area - a.area);
        break;
    }

    return result;
  }, [
    propertiesWithDistance,
    searchTerm,
    filters,
    showFavoritesOnly,
    isFavorite,
  ]);

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
              <span className="text-sm text-gray-600">Tìm gần:</span>
              {searchLocations.map((loc) => (
                <span
                  key={loc.id}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-sm"
                >
                  📍 {loc.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {viewMode === "map" ? (
          <div className="h-full w-full flex">
            {/* Map */}
            <div
              className={`${selectedProperty ? "w-2/3" : "w-full"} h-full transition-all duration-300`}
            >
              <div className="h-full w-full p-4">
                <RentalMapView
                  properties={filteredProperties}
                  selectedProperty={selectedProperty}
                  onPropertySelect={setSelectedProperty}
                  searchLocations={searchLocations}
                />
              </div>
            </div>

            {/* Detail Panel */}
            {selectedProperty && (
              <div className="w-1/3 h-full bg-white border-l shadow-lg overflow-y-auto">
                <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center z-10">
                  <h2 className="text-xl font-bold">Chi tiết phòng trọ</h2>
                  <Button
                    variant="ghost"
                    size="icon"
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
