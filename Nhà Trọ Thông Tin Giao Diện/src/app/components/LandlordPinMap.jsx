import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/app/components/ui/button';
import { MapPin, Navigation, RotateCcw, Check, Loader2 } from 'lucide-react';

const pinIcon = L.divIcon({
  html: `
    <div style="position: relative; width: 44px; height: 44px;">
      <div style="
        width: 44px;
        height: 44px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 4px solid white;
        box-shadow: 0 6px 16px rgba(239,68,68,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: bounce-pin 0.6s ease-out;
        background: #ef4444;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </div>
      <div style="
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 8px;
        background: radial-gradient(ellipse, rgba(0,0,0,0.3), transparent);
        border-radius: 50%;
      "></div>
    </div>
    <style>
      @keyframes bounce-pin {
        0% { transform: rotate(-45deg) translateY(-30px); opacity: 0; }
        60% { transform: rotate(-45deg) translateY(5px); opacity: 1; }
        100% { transform: rotate(-45deg) translateY(0); }
      }
    </style>
  `,
  className: 'landlord-pin-marker',
  iconSize: [44, 44],
  iconAnchor: [22, 44],
  popupAnchor: [0, -44],
});

export function LandlordPinMap({ onPinLocation, initialLocation }) {
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const pinMarkerRef = useRef(null);
  const [pinnedLocation, setPinnedLocation] = useState(initialLocation || null);
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  const defaultCenter = [10.7769, 106.7009];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        initialLocation || defaultCenter,
        14
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapRef.current);

      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        placePin(lat, lng);
      });

      setMapReady(true);

      if (initialLocation) {
        setTimeout(() => placePin(initialLocation[0], initialLocation[1]), 300);
      }
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const placePin = (lat, lng) => {
    if (!mapRef.current) return;

    if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
    }

    pinMarkerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true })
      .addTo(mapRef.current);

    pinMarkerRef.current.bindPopup(
      `<div style="text-align: center; padding: 4px;">
        <p style="margin: 0; font-weight: bold; color: #ef4444;">📍 Vị trí phòng trọ</p>
        <p style="margin: 4px 0 0; font-size: 12px; color: #666;">
          Lat: ${lat.toFixed(6)}<br/>Lng: ${lng.toFixed(6)}
        </p>
        <p style="margin: 4px 0 0; font-size: 11px; color: #999;">
          Kéo ghim để điều chỉnh vị trí
        </p>
      </div>`,
      { maxWidth: 200 }
    ).openPopup();

    pinMarkerRef.current.on('dragend', () => {
      const pos = pinMarkerRef.current?.getLatLng();
      if (pos) {
        setPinnedLocation([pos.lat, pos.lng]);
        onPinLocation(pos.lat, pos.lng);
        pinMarkerRef.current?.setPopupContent(
          `<div style="text-align: center; padding: 4px;">
            <p style="margin: 0; font-weight: bold; color: #ef4444;">📍 Vị trí phòng trọ</p>
            <p style="margin: 4px 0 0; font-size: 12px; color: #666;">
              Lat: ${pos.lat.toFixed(6)}<br/>Lng: ${pos.lng.toFixed(6)}
            </p>
            <p style="margin: 4px 0 0; font-size: 11px; color: #999;">
              Kéo ghim để điều chỉnh vị trí
            </p>
          </div>`
        );
      }
    });

    setPinnedLocation([lat, lng]);
    onPinLocation(lat, lng);

    mapRef.current.panTo([lat, lng], { animate: true });
  };

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          placePin(latitude, longitude);
          mapRef.current?.setView([latitude, longitude], 16, { animate: true });
          setIsLocating(false);
        },
        () => {
          const lat = 10.7769 + (Math.random() - 0.5) * 0.01;
          const lng = 106.7009 + (Math.random() - 0.5) * 0.01;
          placePin(lat, lng);
          mapRef.current?.setView([lat, lng], 16, { animate: true });
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const handleReset = () => {
    if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
      pinMarkerRef.current = null;
    }
    setPinnedLocation(null);
    mapRef.current?.setView(defaultCenter, 14, { animate: true });
  };

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-1">Ghim vị trí trên bản đồ</h4>
            <p className="text-sm text-orange-700">
              Nhấn vào bản đồ để đặt ghim tại vị trí chính xác của phòng trọ.
              Bạn có thể <strong>kéo ghim</strong> để điều chỉnh hoặc dùng GPS để xác định vị trí hiện tại.
            </p>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div ref={mapContainerRef} className="h-[400px] w-full" />

        {/* Floating controls */}
        <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg border border-blue-200"
            size="sm"
          >
            {isLocating ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="size-4 mr-2" />
            )}
            {isLocating ? 'Đang xác định...' : 'Vị trí GPS'}
          </Button>
          {pinnedLocation && (
            <Button
              type="button"
              onClick={handleReset}
              variant="outline"
              className="bg-white shadow-lg"
              size="sm"
            >
              <RotateCcw className="size-4 mr-2" />
              Đặt lại
            </Button>
          )}
        </div>

        {/* No pin instruction overlay */}
        {!pinnedLocation && mapReady && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm pointer-events-none">
            👆 Nhấn vào bản đồ để ghim vị trí
          </div>
        )}
      </div>

      {/* Pin Status */}
      {pinnedLocation ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="size-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-900">Đã ghim vị trí thành công!</p>
              <p className="text-sm text-green-700">
                Tọa độ: {pinnedLocation[0].toFixed(6)}, {pinnedLocation[1].toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <MapPin className="size-5 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-600">Chưa ghim vị trí</p>
              <p className="text-sm text-gray-500">Nhấn vào bản đồ hoặc dùng GPS để ghim</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
