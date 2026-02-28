import { useState } from "react";
import { MapPin, X, Plus, Target } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";

/* =========================
   POPULAR LOCATIONS
========================= */

const popularLocations = [
  {
    id: "bk",
    name: "ĐH Bách Khoa TP.HCM",
    address: "268 Lý Thường Kiệt, Quận 10",
    coordinates: [10.7725, 106.6576],
  },
  {
    id: "ktl",
    name: "ĐH Kinh Tế - Luật",
    address: "Khu phố 6, Thủ Đức",
    coordinates: [10.8714, 106.783],
  },
  {
    id: "khtn",
    name: "ĐH Khoa Học Tự Nhiên",
    address: "227 Nguyễn Văn Cừ, Quận 5",
    coordinates: [10.7628, 106.6824],
  },
  {
    id: "rmit",
    name: "ĐH RMIT Việt Nam",
    address: "702 Nguyễn Văn Linh, Quận 7",
    coordinates: [10.7292, 106.6958],
  },
  {
    id: "vincom",
    name: "Vincom Center Đồng Khởi",
    address: "72 Lê Thánh Tôn, Quận 1",
    coordinates: [10.779, 106.7016],
  },
  {
    id: "bitexco",
    name: "Bitexco Financial Tower",
    address: "2 Hải Triều, Quận 1",
    coordinates: [10.7717, 106.7042],
  },
  {
    id: "pmi",
    name: "KCN Tân Bình",
    address: "Tây Thạnh, Tân Phú",
    coordinates: [10.81, 106.628],
  },
  {
    id: "landmark",
    name: "Landmark 81",
    address: "720A Điện Biên Phủ, Bình Thạnh",
    coordinates: [10.7952, 106.7219],
  },
];

/* =========================
   COMPONENT
========================= */

export function SearchByWorkplace({ onSearch, currentLocations = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocations, setSelectedLocations] = useState(currentLocations);
  const [customLocation, setCustomLocation] = useState({
    name: "",
    address: "",
  });
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPopularLocations = popularLocations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.address.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const addLocation = (location) => {
    if (!selectedLocations.find((l) => l.id === location.id)) {
      setSelectedLocations([...selectedLocations, location]);
    }
  };

  const removeLocation = (id) => {
    setSelectedLocations(selectedLocations.filter((l) => l.id !== id));
  };

  const handleApply = () => {
    onSearch(selectedLocations);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedLocations([]);
    onSearch([]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <Target className="size-4 mr-2" />
          Tìm gần chỗ làm/trường
          {currentLocations.length > 0 && (
            <Badge
              className="ml-2 px-1.5 py-0 h-5 min-w-[20px]"
              variant="secondary"
            >
              {currentLocations.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Tìm trọ gần địa điểm</DialogTitle>
          <DialogDescription>
            Chọn nơi làm việc, trường học hoặc địa điểm quan trọng để tìm nhà
            trọ xung quanh
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Selected Locations */}
          {selectedLocations.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Đã chọn ({selectedLocations.length})
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedLocations.map((loc) => (
                  <Badge key={loc.id} variant="secondary" className="px-3 py-2">
                    <MapPin className="size-3 mr-1" />
                    {loc.name}
                    <button
                      onClick={() => removeLocation(loc.id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search-location">Tìm kiếm địa điểm</Label>
            <Input
              id="search-location"
              placeholder="Nhập tên trường, công ty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Popular Locations */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Địa điểm phổ biến</Label>

            <div className="grid gap-2 max-h-[300px] overflow-y-auto">
              {filteredPopularLocations.map((loc) => {
                const isSelected = selectedLocations.find(
                  (l) => l.id === loc.id,
                );

                return (
                  <button
                    key={loc.id}
                    onClick={() => addLocation(loc)}
                    disabled={!!isSelected}
                    className={`text-left p-3 rounded-lg border transition
                      ${
                        isSelected
                          ? "bg-blue-50 border-blue-300 opacity-60 cursor-not-allowed"
                          : "hover:bg-gray-50 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <MapPin className="size-5 text-blue-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm">{loc.name}</h4>
                        <p className="text-xs text-gray-600 truncate">
                          {loc.address}
                        </p>
                      </div>
                      {isSelected ? (
                        <Badge variant="secondary">Đã chọn</Badge>
                      ) : (
                        <Plus className="size-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Location */}
          <div className="border-t pt-4 space-y-3">
            <Label className="text-sm font-semibold">
              Hoặc nhập địa chỉ tùy chỉnh
            </Label>

            <Input
              placeholder="Tên địa điểm"
              value={customLocation.name}
              onChange={(e) =>
                setCustomLocation({
                  ...customLocation,
                  name: e.target.value,
                })
              }
            />

            <Input
              placeholder="Địa chỉ cụ thể"
              value={customLocation.address}
              onChange={(e) =>
                setCustomLocation({
                  ...customLocation,
                  address: e.target.value,
                })
              }
            />

            <Button
              variant="outline"
              size="sm"
              className="w-full"
              disabled={!customLocation.name || !customLocation.address}
              onClick={() => {
                const newLocation = {
                  id: `custom-${Date.now()}`,
                  name: customLocation.name,
                  address: customLocation.address,
                  coordinates: [10.7769, 106.7009],
                };

                addLocation(newLocation);
                setCustomLocation({ name: "", address: "" });
              }}
            >
              <Plus className="size-4 mr-2" />
              Thêm địa điểm
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={handleClear} className="flex-1">
              Xóa tất cả
            </Button>

            <Button
              onClick={handleApply}
              className="flex-1"
              disabled={selectedLocations.length === 0}
            >
              Áp dụng ({selectedLocations.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
