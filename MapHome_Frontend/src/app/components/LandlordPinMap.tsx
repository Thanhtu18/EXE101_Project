import { useEffect, useRef, useState } from "react";
import goongjs from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';
import { getGoongStyleUrl, getGoongAttribution, GOONG_API_KEY, GOONG_MAPTILES_KEY, getGoongTransformRequest } from "@/app/utils/goongApi";
import { Button } from "@/app/components/ui/button";
import { MapPin, RotateCcw, Check, Loader2, Navigation as NavIcon } from "lucide-react";

interface LandlordPinMapProps {
  onPinLocation: (lat: number, lng: number) => void;
  initialLocation?: [number, number];
}

const createPinElement = () => {
  const el = document.createElement('div');
  el.className = 'landlord-pin-marker';
  el.innerHTML = `
    <div style="position: relative;">
      <div style="
        background: linear-gradient(135deg, #f97316, #ef4444);
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
  `;
  return el;
};

export function LandlordPinMap({
  onPinLocation,
  initialLocation,
}: LandlordPinMapProps) {
  const mapRef = useRef<goongjs.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const pinMarkerRef = useRef<goongjs.Marker | null>(null);
  const [pinnedLocation, setPinnedLocation] = useState<[number, number] | null>(
    initialLocation || null,
  );
  const [isLocating, setIsLocating] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Default center: TP.HCM
  const defaultCenter: [number, number] = [10.7769, 106.7009];

  useEffect(() => {
    if (!mapContainerRef.current) return;

    goongjs.accessToken = GOONG_MAPTILES_KEY;
    
    const map = new goongjs.Map({
      container: mapContainerRef.current,
      style: getGoongStyleUrl('light'),
      center: initialLocation ? [initialLocation[1], initialLocation[0]] : [defaultCenter[1], defaultCenter[0]],
      zoom: 14,
      attributionControl: false,
      transformRequest: getGoongTransformRequest
    });

    map.addControl(new goongjs.NavigationControl(), 'top-right');
    mapRef.current = map;

    map.on('load', () => {
      setMapReady(true);
      if (initialLocation) {
        placePin(initialLocation[0], initialLocation[1], false);
      }
    });

    map.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      placePin(lat, lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const placePin = (lat: number, lng: number, notifyParent: boolean = true) => {
    const map = mapRef.current;
    if (!map) return;

    if (pinMarkerRef.current) {
      pinMarkerRef.current.remove();
    }

    const el = createPinElement();
    const marker = new goongjs.Marker({
      element: el,
      draggable: true,
      offset: [0, -22]
    })
      .setLngLat([lng, lat])
      .addTo(map);

    const popupHTML = (lt: number, lg: number) => `
      <div style="text-align: center; min-width: 180px; font-family: sans-serif;">
        <h3 style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #ef4444;">📌 Vị trí ghim</h3>
        <p style="margin: 0 0 4px; font-size: 12px; color: #666;">Lat: ${lt.toFixed(6)}<br/>Lng: ${lg.toFixed(6)}</p>
        <p style="margin: 4px 0 0; font-size: 10px; color: #999;">Kéo ghim để vi chỉnh</p>
      </div>
    `;

    const popup = new goongjs.Popup({ offset: 25 }).setHTML(popupHTML(lat, lng));
    marker.setPopup(popup);
    marker.togglePopup();

    marker.on('dragend', () => {
      const pos = marker.getLngLat();
      setPinnedLocation([pos.lat, pos.lng]);
      onPinLocation(pos.lat, pos.lng);
      popup.setHTML(popupHTML(pos.lat, pos.lng));
    });

    pinMarkerRef.current = marker;
    setPinnedLocation([lat, lng]);

    if (notifyParent) {
      onPinLocation(lat, lng);
    }

    map.flyTo({ center: [lng, lat], zoom: 16 });
  };

  const handleUseMyLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          placePin(latitude, longitude);
          setIsLocating(false);
        },
        () => {
          // Fallback
          const lat = defaultCenter[0] + (Math.random() - 0.5) * 0.01;
          const lng = defaultCenter[1] + (Math.random() - 0.5) * 0.01;
          placePin(lat, lng);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 },
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
    mapRef.current?.flyTo({ center: [defaultCenter[1], defaultCenter[0]], zoom: 14 });
  };

  // Sync with external updates
  useEffect(() => {
    if (mapRef.current && initialLocation && mapReady) {
      const isAlreadyAtLocation = pinnedLocation && 
        Math.abs(pinnedLocation[0] - initialLocation[0]) < 0.0001 && 
        Math.abs(pinnedLocation[1] - initialLocation[1]) < 0.0001;

      if (!isAlreadyAtLocation) {
        placePin(initialLocation[0], initialLocation[1], false);
      }
    }
  }, [initialLocation, mapReady]);

  return (
    <div className="space-y-4">
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <MapPin className="size-5 text-orange-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-orange-900 mb-1">Ghim vị trí trên bản đồ</h4>
            <p className="text-sm text-orange-700">
              Nhấn vào bản đồ để ghim vị trí phòng trọ. Bạn có thể <strong>kéo ghim</strong> để điều chỉnh tọa độ chính xác nhất.
            </p>
          </div>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
        <div ref={mapContainerRef} className="h-[400px] w-full" />

        <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-500 shadow-lg"
            size="sm"
          >
            {isLocating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <NavIcon className="size-4 mr-2" />}
            {isLocating ? "Đang xác định..." : "Vị trí GPS"}
          </Button>
          {pinnedLocation && (
            <Button type="button" onClick={handleReset} variant="outline" className="bg-white shadow-lg" size="sm">
              <RotateCcw className="size-4 mr-2" /> Đặt lại
            </Button>
          )}
        </div>

        {!pinnedLocation && mapReady && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[10] bg-black/70 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm pointer-events-none">
            👆 Nhấn vào bản đồ để ghim vị trí
          </div>
        )}
      </div>

      {pinnedLocation ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="size-5 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-green-900">Đã ghim vị trí thành công!</p>
              <p className="text-sm text-green-700">Tọa độ: {pinnedLocation[0].toFixed(6)}, {pinnedLocation[1].toFixed(6)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-gray-500">
          <div className="flex items-center gap-3">
            <MapPin className="size-5" />
            <span className="text-sm">Chưa ghim vị trí. Nhấn vào bản đồ để bắt đầu.</span>
          </div>
        </div>
      )}
    </div>
  );
}
