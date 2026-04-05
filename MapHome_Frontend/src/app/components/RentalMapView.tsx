import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RentalProperty, LandlordProfile } from './types';
import { SearchLocation } from './SearchByWorkplace';
import { Button } from '@/app/components/ui/button';
import { Navigation } from 'lucide-react';

interface RentalMapViewProps {
  properties: RentalProperty[];
  selectedProperty: RentalProperty | null;
  onPropertySelect: (property: RentalProperty) => void;
  searchLocations?: SearchLocation[];
  searchRadius?: number; // in km
  searchCenter?: [number, number];
}

// Regular property icon (no pin)
const createPropertyIcon = (available: boolean, isVerified: boolean = false) => {
  const color = available ? '#059669' : '#9ca3af'; // emerald-600 vs gray-400
  const verifiedBadge = isVerified
    ? `<div style="
        position: absolute;
        top: -4px;
        right: -4px;
        background: linear-gradient(135deg, #10b981, #059669);
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 4px 8px rgba(6,78,59,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      </div>`
    : '';
  return L.divIcon({
    html: `
      <div style="position: relative;">
        ${verifiedBadge}
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 6px 12px rgba(6,78,59,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.95;
        ">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="white" 
            style="transform: rotate(45deg);"
          >
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};


// Landlord-pinned property icon (prominent, with glow)
const createPinnedPropertyIcon = (available: boolean) => {
  const gradient = available
    ? 'linear-gradient(135deg, #059669, #064e3b)' // emerald-600 to emerald-950
    : 'linear-gradient(135deg, #f97316, #ea580c)';
  const glowColor = available ? 'rgba(5,150,105,0.4)' : 'rgba(249,115,22,0.4)';
  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: ${glowColor};
          animation: pin-glow 2s infinite;
        "></div>
        <div style="
          background: ${gradient};
          width: 42px;
          height: 42px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          border: 3px solid white;
          box-shadow: 0 8px 16px rgba(6,78,59,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="white" style="transform: rotate(45deg);">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <!-- Pin badge -->
        <div style="
          position: absolute;
          top: -6px;
          right: -6px;
          background: #ff4d4d;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2.5px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"/>
            <rect x="9" y="21" width="6" height="2" rx="1"/>
          </svg>
        </div>
      </div>
      <style>
        @keyframes pin-glow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0; }
        }
      </style>
    `,
    className: 'pinned-marker',
    iconSize: [42, 42],
    iconAnchor: [21, 42],
    popupAnchor: [0, -42],
  });
};


const userLocationIcon = L.divIcon({
  html: `
    <div style="position: relative;">
      <div style="
        background-color: #10b981;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 8px 16px rgba(6,78,59,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: pulse-aura 2.5s infinite ease-out;
        z-index: 10;
        position: relative;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
      <div style="
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90px;
        height: 90px;
        border-radius: 50%;
        background-color: rgba(16, 185, 129, 0.15);
        border: 2px solid rgba(16, 185, 129, 0.3);
        animation: ripple-aura 2.5s infinite cubic-bezier(0.4, 0, 0.2, 1);
      "></div>
    </div>
    <style>
      @keyframes pulse-aura {
        0%, 100% { transform: scale(1); filter: brightness(1); }
        50% { transform: scale(1.1); filter: brightness(1.2); }
      }
      @keyframes ripple-aura {
        0% { width: 44px; height: 44px; opacity: 1; }
        100% { width: 140px; height: 140px; opacity: 0; }
      }
    </style>
  `,
  className: 'user-location-marker',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -22],
});


// Facility icons
const createFacilityIcon = (type: string) => {
  const config = {
    hospital: { color: '#ef4444', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 11h-4v4h-4v-4H6v-4h4V6h4v4h4v4z' },
    school: { color: '#f59e0b', icon: 'M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z' },
    supermarket: { color: '#8b5cf6', icon: 'M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z' },
    park: { color: '#10b981', icon: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z' },
    bus_stop: { color: '#3b82f6', icon: 'M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z' },
  }[type] || { color: '#6b7280', icon: '' };

  return L.divIcon({
    html: `
      <div style="position: relative;">
        <div style="
          background-color: ${config.color};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="${config.icon}"></path>
          </svg>
        </div>
      </div>
    `,
    className: 'facility-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export function RentalMapView({ properties, selectedProperty, onPropertySelect, searchLocations, searchRadius = 1, searchCenter }: RentalMapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  const [showLegend, setShowLegend] = useState(true);
  // Shared drag position for legend button + legend panel
  const legendX = useMotionValue(16);
  const legendY = useMotionValue(16);

  // Simulated user location (near Nhà thờ Đức Bà, TP.HCM)
  const defaultCenter: [number, number] = [10.7769, 106.7009];
  const effectiveCenter = searchCenter || defaultCenter;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(effectiveCenter, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each property
    properties.forEach((property) => {
      if (!mapRef.current) return;

      const isPinned = !!property.pinInfo;
      const isVerified = property.greenBadge?.level === 'verified';
      const icon = isPinned
        ? createPinnedPropertyIcon(property.available)
        : createPropertyIcon(property.available, isVerified);

      const marker = L.marker(property.location, { icon }).addTo(mapRef.current);

      // Build popup content
      const landlord = property.landlordId && typeof property.landlordId === 'object'
        ? property.landlordId as LandlordProfile
        : null;

      const pinBadgeHtml = isPinned
        ? `<div style="display: flex; align-items: center; gap: 6px; background: linear-gradient(135deg, #fef3c7, #fde68a); padding: 4px 10px; border-radius: 12px; margin-bottom: 8px; border: 1px solid #f59e0b;">
             <span style="font-size: 12px;">📌</span>
             <span style="font-size: 11px; font-weight: 600; color: #92400e;">Chủ trọ đã ghim GPS</span>
           </div>`
        : '';

      const landlordHtml = landlord
        ? `<div style="background: #f9fafb; border-radius: 8px; padding: 8px; margin-top: 8px; border: 1px solid #e5e7eb;">
             <div style="display: flex; align-items: center; gap: 8px;">
               <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #3b82f6, #1d4ed8); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
                 ${landlord.name.charAt(0)}
               </div>
               <div>
                 <p style="margin: 0; font-size: 13px; font-weight: 600; color: #1f2937;">${landlord.name}</p>
                 <div style="display: flex; align-items: center; gap: 4px;">
                   <span style="font-size: 11px; color: #f59e0b;">★ ${landlord.rating}</span>
                   ${landlord.verified ? '<span style="font-size: 10px; color: #059669; font-weight: 600;">✓ Đã xác thực</span>' : ''}
                 </div>
               </div>
             </div>
             <div style="display: flex; gap: 8px; margin-top: 6px; font-size: 11px; color: #6b7280;">
               <span>📋 ${landlord.totalListings} tin</span>
               <span>💬 ${landlord.responseRate}%</span>
               <span>⏱ ${landlord.responseTime}</span>
             </div>
           </div>`
        : '';

      const pinNoteHtml = property.pinInfo?.note
        ? `<div style="background: #eff6ff; padding: 6px 10px; border-radius: 6px; margin-top: 6px; border-left: 3px solid #3b82f6;">
             <p style="margin: 0; font-size: 12px; color: #1e40af; font-style: italic;">
               💬 "${property.pinInfo.note}"
             </p>
           </div>`
        : '';

      const popupContent = `
        <div style="min-width: 220px; max-width: 280px;">
          ${pinBadgeHtml}
          <img src="${property.image}" alt="${property.name}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
          <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 600;">${property.name}</h3>
          <p style="margin: 0 0 6px 0; font-size: 13px; color: #666;">${property.address}</p>
          <p style="margin: 0 0 4px 0; font-size: 18px; font-weight: 700; color: #2563eb;">${property.price.toLocaleString('vi-VN')}đ/tháng</p>
          <div style="display: flex; gap: 6px; font-size: 12px; color: #6b7280; margin-bottom: 4px;">
            <span>📐 ${property.area}m²</span>
            <span>${property.available ? '🟢 Còn phòng' : '🔴 Hết phòng'}</span>
          </div>
          ${pinNoteHtml}
          ${landlordHtml}
          <button
            onclick="window.open('/room/${property.id}', '_self')"
            style="
              margin-top: 10px;
              width: 100%;
              padding: 8px 16px;
              background: ${isPinned ? 'linear-gradient(135deg, #10b981, #059669)' : '#2563eb'};
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
            "
          >
            Xem chi tiết
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      marker.on('click', () => {
        onPropertySelect(property);
      });

      markersRef.current.push(marker);
    });

    // Add user location marker and circle
    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker(effectiveCenter, {
        icon: userLocationIcon,
      }).addTo(mapRef.current);

      const userPopupContent = `
        <div style="min-width: 180px; text-align: center;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #3b82f6;">
            📍 Vị trí đang tìm
          </h3>
          <p style="margin: 0; font-size: 14px; color: #666;">
            Khu vực tìm kiếm của bạn
          </p>
        </div>
      `;

      userMarkerRef.current.bindPopup(userPopupContent, {
        maxWidth: 200,
        className: 'custom-popup',
      });
    } else {
      userMarkerRef.current.setLatLng(effectiveCenter);
    }
    if (!userCircleRef.current) {
      userCircleRef.current = L.circle(effectiveCenter, {
        color: '#10b981',
        fillColor: '#10b981',
        fillOpacity: 0.1,
        weight: 2,
        radius: (searchRadius || 1) * 1000, // Convert km to meters
      }).addTo(mapRef.current);
    } else {
      // Update existing circle
      userCircleRef.current.setLatLng(effectiveCenter);
      userCircleRef.current.setRadius((searchRadius || 1) * 1000);
    }


    // Add facilities
    // Facilities removed for now

    // Add search locations
    if (searchLocations && searchLocations.length > 0) {
      searchLocations.forEach((location, index) => {
        if (!mapRef.current) return;

        const searchLocationIcon = L.divIcon({
          html: `
            <div style="position: relative;">
              <div style="
                background-color: #f59e0b;
                width: 44px;
                height: 44px;
                border-radius: 50%;
                border: 4px solid white;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: 18px;
              ">
                ${index + 1}
              </div>
            </div>
          `,
          className: 'search-location-marker',
          iconSize: [44, 44],
          iconAnchor: [22, 22],
          popupAnchor: [0, -22],
        });

        const marker = L.marker(location.coordinates, {
          icon: searchLocationIcon,
        }).addTo(mapRef.current);

        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #f59e0b;">
              🎯 Địa điểm ${index + 1}
            </h3>
            <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 600; color: #333;">
              ${location.name}
            </h4>
            <p style="margin: 0; font-size: 13px; color: #666;">
              ${location.address}
            </p>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 250,
          className: 'custom-popup',
        });

        L.circle(location.coordinates, {
          color: '#f59e0b',
          fillColor: '#f59e0b',
          fillOpacity: 0.1,
          radius: 1000,
        }).addTo(mapRef.current);

        markersRef.current.push(marker);
      });
    }

    // Cleanup on unmount
    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
    };
  }, [properties, onPropertySelect, searchLocations]);

  // Handle selected property
  useEffect(() => {
    if (selectedProperty && mapRef.current) {
      const marker = markersRef.current.find((m) => {
        const latLng = m.getLatLng();
        return (
          latLng.lat === selectedProperty.location[0] &&
          latLng.lng === selectedProperty.location[1]
        );
      });

      if (marker) {
        marker.openPopup();
        mapRef.current.setView(marker.getLatLng(), 15, { animate: true });
      }
    }
  }, [selectedProperty]);

  const handleCenterOnUser = () => {
    if (mapRef.current) {
      mapRef.current.setView(effectiveCenter, 15, { animate: true });
      if (userMarkerRef.current) {
        userMarkerRef.current.openPopup();
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Count pinned vs regular
  const pinnedCount = properties.filter(p => p.pinInfo).length;
  const regularCount = properties.length - pinnedCount;

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainerRef} className="h-full w-full rounded-lg" />

      {/* Legend - always mounted, dark emerald glassmorphism */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={mapContainerRef}
        style={{ x: legendX, y: legendY, position: 'absolute', top: 0, left: 0, cursor: 'grab', pointerEvents: showLegend ? 'auto' : 'none' }}
        animate={{ opacity: showLegend ? 1 : 0, scale: showLegend ? 1 : 0.95 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        whileDrag={{ scale: 1.02, boxShadow: '0 24px 60px -10px rgba(6,78,59,0.5)', cursor: 'grabbing' }}
        className="z-20 w-[230px] will-change-transform select-none rounded-2xl overflow-hidden shadow-2xl shadow-emerald-900/40"
      >
        {/* Dark Emerald Header */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 px-4 pt-4 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Grip dots — white */}
            <div className="grid grid-cols-2 gap-[3px] opacity-30">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-white" />
              ))}
            </div>
            <div>
              <h4 className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.35em]">Bản đồ tìm kiếm</h4>
            </div>
          </div>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setShowLegend(false); }}
            className="size-6 rounded-lg bg-white/10 hover:bg-red-500/80 flex items-center justify-center text-white/50 hover:text-white transition-all duration-200"
            style={{ cursor: 'pointer' }}
          >
            <span className="text-[10px] font-bold">✕</span>
          </button>
        </div>

        {/* Content — semi-dark */}
        <div className="bg-emerald-950/90 backdrop-blur-md px-4 py-4 space-y-4 border-t border-emerald-800/30">
          {/* Pinned */}
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-800 border-2 border-emerald-700/50 shadow-lg" />
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-emerald-950 shadow-md animate-bounce" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Chủ trọ đã ghim</p>
              <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-widest">{pinnedCount} Vị trí GPS</p>
            </div>
          </div>

          {/* Regular */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-900/60 border border-emerald-700/40 flex-shrink-0 flex items-center justify-center">
              <div className="size-3.5 bg-emerald-400 rounded-full" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Chưa ghim vị trí</p>
              <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-widest">{regularCount} Tin thường</p>
            </div>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 border border-emerald-500/40 shadow-lg shadow-emerald-900/50 flex-shrink-0 flex items-center justify-center">
              <Navigation className="size-4 text-white" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-white leading-tight">Vị trí của bạn</p>
              <p className="text-[10px] font-semibold text-emerald-400/70 uppercase tracking-widest">Đang hoạt động</p>
            </div>
          </div>
        </div>

        {/* Tip Footer */}
        <div className="bg-emerald-900/80 px-4 py-3 border-t border-emerald-800/30">
          <p className="text-[9px] text-emerald-400/80 font-bold text-center leading-relaxed uppercase tracking-tight">
            📌 Ghim GPS = Chủ trọ đã xác thực có mặt tại vị trí đăng bài.
          </p>
        </div>
      </motion.div>

      {/* Chú thích toggle button — emerald pill style */}
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0.08}
        dragConstraints={mapContainerRef}
        style={{ x: legendX, y: legendY, position: 'absolute', top: 0, left: 0, cursor: 'grab', pointerEvents: showLegend ? 'none' : 'auto' }}
        animate={{ opacity: showLegend ? 0 : 1, scale: showLegend ? 0.9 : 1 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        whileDrag={{ scale: 1.05, cursor: 'grabbing' }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onPointerUp={(e) => {
          const hasMoved = Math.abs(legendX.get() - legendX.getPrevious()!) > 4 ||
                           Math.abs(legendY.get() - legendY.getPrevious()!) > 4;
          if (!hasMoved) setShowLegend(true);
        }}
        className="z-20 bg-emerald-950 text-white shadow-xl shadow-emerald-900/40 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center gap-2 select-none will-change-transform border border-emerald-800/50 hover:bg-emerald-900 transition-colors"
      >
        <div className="grid grid-cols-2 gap-[2.5px] opacity-50">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[3px] h-[3px] rounded-full bg-white" />
          ))}
        </div>
        <span className="text-emerald-400">📌</span>
        <span>Chú thích</span>
      </motion.button>


      {/* My Location Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleCenterOnUser}
        className="absolute bottom-32 right-8 z-[1000] size-14 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white rounded-2xl shadow-2xl shadow-emerald-900/30 flex items-center justify-center hover:brightness-110 transition-all will-change-transform"
      >
        <Navigation className="size-6" />
      </motion.button>

    </div>
  );
}