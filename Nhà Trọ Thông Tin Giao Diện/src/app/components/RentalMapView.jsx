import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { mockFacilities } from "./mockFacilities";
import { getLandlordById } from "./mockData";
import { Button } from "@/app/components/ui/button";
import { Navigation } from "lucide-react";

/* =========================
   ICONS
========================= */

const createPropertyIcon = (available) => {
  const color = available ? "#6b7280" : "#9ca3af";

  return L.divIcon({
    html: `
      <div style="
        width:32px;
        height:32px;
        border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 3px 6px rgba(0,0,0,0.2);
        opacity:0.85;
      "></div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createPinnedPropertyIcon = (available) => {
  const gradient = available
    ? "linear-gradient(135deg,#10b981,#059669)"
    : "linear-gradient(135deg,#f97316,#ea580c)";

  return L.divIcon({
    html: `
      <div style="
        width:42px;
        height:42px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${gradient};
        border:3px solid white;
        box-shadow:0 4px 12px rgba(0,0,0,0.3);
      "></div>
    `,
    className: "pinned-marker",
    iconSize: [42, 42],
    iconAnchor: [21, 42],
  });
};

const userLocationIcon = L.divIcon({
  html: `
    <div style="
      width:28px;
      height:28px;
      border-radius:50%;
      background:#3b82f6;
      border:3px solid white;
      box-shadow:0 0 0 6px rgba(59,130,246,0.2);
    "></div>
  `,
  className: "user-location-marker",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

/* =========================
   COMPONENT
========================= */

export function RentalMapView({
  properties,
  selectedProperty,
  onPropertySelect,
  searchLocations,
}) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const userCircleRef = useRef(null);

  const [showLegend, setShowLegend] = useState(true);
  const [userLocation] = useState([10.7769, 106.7009]);

  /* =========================
     INIT MAP
  ========================= */

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(userLocation, 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    /* =========================
       PROPERTY MARKERS
    ========================= */

    properties.forEach((property) => {
      if (!mapRef.current) return;

      const icon = property.pinInfo
        ? createPinnedPropertyIcon(property.available)
        : createPropertyIcon(property.available);

      const marker = L.marker(property.location, { icon }).addTo(
        mapRef.current,
      );

      const landlord = property.landlordId
        ? getLandlordById(property.landlordId)
        : null;

      const popupContent = `
        <div style="min-width:220px">
          <img src="${property.image}" 
               style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin-bottom:8px" />
          <h3 style="margin:0;font-size:15px;font-weight:600">
            ${property.name}
          </h3>
          <p style="margin:4px 0;font-size:13px;color:#666">
            ${property.address}
          </p>
          <p style="margin:0;font-size:16px;font-weight:700;color:#2563eb">
            ${property.price.toLocaleString("vi-VN")}đ/tháng
          </p>
          ${
            landlord
              ? `<p style="font-size:12px;margin-top:6px;color:#555">
                   Chủ trọ: ${landlord.name}
                 </p>`
              : ""
          }
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 300 });

      marker.on("click", () => {
        onPropertySelect(property);
      });

      markersRef.current.push(marker);
    });

    /* =========================
       USER LOCATION
    ========================= */

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(userLocation, {
        icon: userLocationIcon,
      }).addTo(mapRef.current);

      userCircleRef.current = L.circle(userLocation, {
        radius: 500,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
      }).addTo(mapRef.current);
    }

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
    };
  }, [properties]);

  /* =========================
     SELECTED PROPERTY
  ========================= */

  useEffect(() => {
    if (!selectedProperty || !mapRef.current) return;

    const marker = markersRef.current.find((m) => {
      const { lat, lng } = m.getLatLng();
      return (
        lat === selectedProperty.location[0] &&
        lng === selectedProperty.location[1]
      );
    });

    if (marker) {
      marker.openPopup();
      mapRef.current.setView(marker.getLatLng(), 15, { animate: true });
    }
  }, [selectedProperty]);

  const handleCenterOnUser = () => {
    if (!mapRef.current) return;

    mapRef.current.setView(userLocation, 15, { animate: true });
    userMarkerRef.current?.openPopup();
  };

  /* =========================
     LEGEND COUNTS
  ========================= */

  const pinnedCount = properties.filter((p) => p.pinInfo).length;
  const regularCount = properties.length - pinnedCount;

  /* =========================
     JSX
  ========================= */

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />

      {showLegend && (
        <div className="absolute top-4 left-4 z-[1000] bg-white p-3 rounded-xl shadow border text-xs space-y-2">
          <div className="flex justify-between">
            <strong>Chú thích</strong>
            <button onClick={() => setShowLegend(false)}>✕</button>
          </div>
          <p>📌 Ghim GPS: {pinnedCount}</p>
          <p>📍 Thường: {regularCount}</p>
        </div>
      )}

      {!showLegend && (
        <button
          onClick={() => setShowLegend(true)}
          className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded shadow text-xs"
        >
          📌 Chú thích
        </button>
      )}

      <Button
        onClick={handleCenterOnUser}
        className="absolute bottom-6 right-6 z-[1000] bg-white text-blue-600 border-2 border-blue-600"
        size="icon"
      >
        <Navigation className="size-5" />
      </Button>
    </div>
  );
}
