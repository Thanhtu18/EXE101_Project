import { useEffect, useRef, useState } from "react";
import goongjs from '@goongmaps/goong-js';
import '@goongmaps/goong-js/dist/goong-js.css';
import { getGoongStyleUrl, getGoongAttribution, GOONG_MAPTILES_KEY, getGoongTransformRequest, reverseGeocode, type GeocodeResult } from "@/app/utils/goongApi";
import { Button } from "@/app/components/ui/button";
import { MapPin, RotateCcw, Check, Loader2, Navigation as NavIcon, Map as MapIcon } from "lucide-react";

interface LandlordPinMapProps {
  onPinLocation: (lat: number, lng: number, address?: string, geocodeResult?: GeocodeResult) => void;
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
  const [pinnedAddress, setPinnedAddress] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
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

  const placePin = async (lat: number, lng: number, notifyParent: boolean = true) => {
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

    // Initial popup while loading address
    const popup = new goongjs.Popup({ offset: 25 }).setHTML(`
      <div style="padding: 10px; text-align: center;">
        <div class="animate-spin inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
        <p style="font-size: 11px; color: #666; margin: 0;">Đang lấy địa chỉ...</p>
      </div>
    `);
    marker.setPopup(popup);
    marker.togglePopup();

    pinMarkerRef.current = marker;
    setPinnedLocation([lat, lng]);

    // Fetch address from Backend Proxy
    setIsGeocoding(true);
    const result = await reverseGeocode(lat, lng);
    const address = result?.formatted_address || null;
    setPinnedAddress(address);
    setIsGeocoding(false);

    const popupHTML = (lt: number, lg: number, addr: string | null) => `
      <div style="text-align: center; min-width: 200px; font-family: sans-serif; padding: 4px;">
        <h3 style="margin: 0 0 6px; font-size: 14px; font-weight: 600; color: #ef4444;">📌 Vị trí ghim</h3>
        ${addr ? `<p style="margin: 0 0 8px; font-size: 12px; font-weight: 500; color: #333; line-height: 1.4;">${addr}</p>` : ''}
        <p style="margin: 0 0 4px; font-size: 11px; color: #666;">Tọa độ: ${lt.toFixed(5)}, ${lg.toFixed(5)}</p>
        <p style="margin: 6px 0 0; font-size: 10px; color: #999; border-top: 1px solid #eee; pt-2;">Kéo ghim để điều chỉnh</p>
      </div>
    `;

    popup.setHTML(popupHTML(lat, lng, address));

    marker.on('dragend', async () => {
      const pos = marker.getLngLat();
      setPinnedLocation([pos.lat, pos.lng]);
      
      popup.setHTML(`
        <div style="padding: 10px; text-align: center;">
          <div class="animate-spin inline-block w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full mb-2"></div>
          <p style="font-size: 11px; color: #666; margin: 0;">Đang cập nhật địa chỉ...</p>
        </div>
      `);
      
      const result = await reverseGeocode(pos.lat, pos.lng);
      const newAddr = result?.formatted_address || null;
      setPinnedAddress(newAddr);
      popup.setHTML(popupHTML(pos.lat, pos.lng, newAddr));
      onPinLocation(pos.lat, pos.lng, newAddr || undefined, result || undefined);
    });

    if (notifyParent) {
      onPinLocation(lat, lng, address || undefined, result || undefined);
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
          // Fallback if denied or error
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
    setPinnedAddress(null);
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
            <h4 className="font-semibold text-orange-900 mb-1">Ghim vị trí chính xác</h4>
            <p className="text-sm text-orange-700">
              Sử dụng <strong>Vị trí GPS</strong> hoặc nhấn vào bản đồ để ghim. Tọa độ chính xác giúp khách hàng dễ dàng tìm đến phòng trọ của bạn hơn.
            </p>
          </div>
        </div>
      </div>

      <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-xl group">
        <div ref={mapContainerRef} className="h-[450px] w-full" />

        <div className="absolute top-4 right-4 z-[10] flex flex-col gap-2">
          <Button
            type="button"
            onClick={handleUseMyLocation}
            disabled={isLocating}
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-2 border-indigo-500 shadow-xl transition-all hover:scale-105"
            size="sm"
          >
            {isLocating ? <Loader2 className="size-4 mr-2 animate-spin" /> : <NavIcon className="size-4 mr-2" />}
            {isLocating ? "Đang xác định..." : "Vị trí GPS"}
          </Button>
          {pinnedLocation && (
            <Button type="button" onClick={handleReset} variant="outline" className="bg-white shadow-xl hover:bg-red-50 hover:text-red-600 border-gray-200" size="sm">
              <RotateCcw className="size-4 mr-2" /> Đặt lại
            </Button>
          )}
        </div>

        {!pinnedLocation && mapReady && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full border border-orange-200 shadow-lg text-orange-600 font-medium flex items-center gap-2 animate-bounce">
              <MapIcon className="size-4" /> 👆 Nhấn để ghim vị trí
            </div>
          </div>
        )}

        {isGeocoding && (
          <div className="absolute bottom-4 left-4 z-[10]">
             <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-indigo-100">
                <Loader2 className="size-3.5 animate-spin text-indigo-500" />
                <span className="text-xs font-medium text-indigo-600">Đang dịch tọa độ...</span>
             </div>
          </div>
        )}
      </div>

      {pinnedLocation ? (
        <div className="bg-white border-2 border-green-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <Check className="size-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-lg mb-1">Vị trí đã chọn</p>
              {pinnedAddress && (
                <p className="text-gray-700 font-medium mb-2 leading-relaxed">
                  {pinnedAddress}
                </p>
              )}
              <div className="flex gap-4 text-xs font-mono text-gray-500">
                 <span>Lat: {pinnedLocation[0].toFixed(6)}</span>
                 <span>Lng: {pinnedLocation[1].toFixed(6)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <MapPin className="size-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Bạn chưa ghim vị trí phòng trọ</p>
            <p className="text-gray-400 text-sm">Vui lòng chọn một điểm trên bản đồ</p>
        </div>
      )}
    </div>
  );
}
