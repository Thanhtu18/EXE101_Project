import { GreenBadgeLevel } from '@/app/components/types';
import { ShieldCheck } from 'lucide-react';

interface GreenBadgeDisplayProps {
  level: GreenBadgeLevel;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function GreenBadgeDisplay({ 
  level, 
  className = '', 
  size = 'md',
  showLabel = true 
}: GreenBadgeDisplayProps) {
  if (level !== 'verified') return null;

  const sizeClasses = {
    sm: {
      icon: 'size-3',
      text: 'text-xs',
      padding: 'px-2 py-0.5',
      gap: 'gap-1',
    },
    md: {
      icon: 'size-4',
      text: 'text-sm',
      padding: 'px-3 py-1',
      gap: 'gap-1.5',
    },
    lg: {
      icon: 'size-5',
      text: 'text-base',
      padding: 'px-4 py-2',
      gap: 'gap-2',
    },
  };

  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`inline-flex items-center ${sizeClass.gap} ${sizeClass.padding} rounded-full bg-gradient-to-r from-green-50 to-green-100 border border-green-300 font-semibold text-green-800 ${className}`}
      style={{
        boxShadow: '0 0 12px rgba(34, 197, 94, 0.3)',
      }}
    >
      <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-full p-0.5">
        <ShieldCheck className={`${sizeClass.icon} text-white`} strokeWidth={2.5} />
      </div>
      {showLabel && (
        <span className={sizeClass.text}>
          Đã xác thực
        </span>
      )}
    </div>
  );
}

// Badge cho card nhỏ gọn
export function GreenBadgeMini({ level }: { level: GreenBadgeLevel }) {
  if (level !== 'verified') return null;

  return (
    <div
      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg z-10"
      title="Đã được xác thực bởi nền tảng"
    >
      ✓
    </div>
  );
}

// Icon cho bản đồ (marker)
export function VerifiedMarkerIcon() {
  return (
    <div className="absolute -top-1 -right-1 bg-green-500 border-2 border-white rounded-full w-5 h-5 flex items-center justify-center shadow-md">
      <ShieldCheck className="size-3 text-white" strokeWidth={3} />
    </div>
  );
}
