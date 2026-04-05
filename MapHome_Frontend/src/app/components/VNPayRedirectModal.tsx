import { useEffect, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent } from '@/app/components/ui/card';
import { Lock, X } from 'lucide-react';

interface VNPayRedirectModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onComplete?: () => void;
}

export function VNPayRedirectModal({ isOpen, onCancel, onComplete }: VNPayRedirectModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }

    // Animate progress bar from 0 to 100% over 2.5 seconds
    const duration = 2500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    let currentProgress = 0;
    const timer = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(timer);
        // Call onComplete after progress reaches 100%
        if (onComplete) {
          setTimeout(onComplete, 300);
        }
      }
      setProgress(currentProgress);
    }, interval);

    return () => clearInterval(timer);
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        onClick={onCancel}
      />

      {/* Modal Card */}
      <Card className="relative w-[600px] shadow-2xl border-2 border-gray-200 animate-in fade-in zoom-in duration-300">
        <CardContent className="p-12">
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>

          <div className="flex flex-col items-center text-center space-y-6">
            {/* VNPay Logo */}
            <div className="w-full flex justify-center">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-red-600 font-black text-xl">V</span>
                </div>
                <span className="text-white font-black text-3xl tracking-tight">VNPay</span>
              </div>
            </div>

            {/* Loading Spinner */}
            <div className="relative">
              {/* Outer ring */}
              <div className="w-20 h-20 rounded-full border-4 border-blue-100"></div>
              {/* Spinning ring */}
              <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 animate-spin"></div>
              {/* Inner pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse opacity-50"></div>
              </div>
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Đang chuyển đến VNPay...
              </h2>
              <p className="text-gray-600 font-medium">
                Vui lòng không đóng trình duyệt
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full space-y-2">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-full transition-all duration-200 ease-linear relative overflow-hidden"
                  style={{ width: `${progress}%` }}
                >
                  {/* Shimmer effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    style={{
                      animation: 'shimmer 1.5s infinite',
                      transform: 'translateX(-100%)',
                    }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {Math.round(progress)}%
              </p>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg w-full">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Lock className="size-4 text-green-600" />
              </div>
              <p className="text-sm text-green-800 font-medium text-left">
                Kết nối được mã hóa SSL 256-bit
              </p>
            </div>

            {/* Additional info */}
            <div className="pt-2 space-y-2">
              <p className="text-xs text-gray-500">
                Bạn sẽ được chuyển đến cổng thanh toán an toàn của VNPay
              </p>
            </div>

            {/* Cancel Link */}
            <Button
              variant="ghost"
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 text-sm mt-4"
            >
              Hủy và quay lại
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keyframes animation in a style tag without jsx attribute */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}