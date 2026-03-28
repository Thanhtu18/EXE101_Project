import { 
  Wifi, 
  Armchair, 
  Wind, 
  Waves, 
  Refrigerator, 
  UtensilsCrossed, 
  Tv 
} from "lucide-react";

export const amenityLabels: Record<string, string> = {
  wifi: "High-speed Wifi",
  furniture: "Đầy đủ nội thất",
  airConditioner: "Máy lạnh / Điều hòa",
  washingMachine: "Máy giặt riêng",
  refrigerator: "Tủ lạnh",
  kitchen: "Bếp nấu ăn",
  tv: "Tivi truyền hình",
};

export const amenityMeta: Record<string, { label: string; icon: any }> = {
  wifi: { label: "High-speed Wifi", icon: Wifi },
  furniture: { label: "Đầy đủ nội thất", icon: Armchair },
  airConditioner: { label: "Máy lạnh / Điều hòa", icon: Wind },
  washingMachine: { label: "Máy giặt riêng", icon: Waves },
  refrigerator: { label: "Tủ lạnh", icon: Refrigerator },
  kitchen: { label: "Bếp nấu ăn", icon: UtensilsCrossed },
  tv: { label: "Tivi truyền hình", icon: Tv },
};
