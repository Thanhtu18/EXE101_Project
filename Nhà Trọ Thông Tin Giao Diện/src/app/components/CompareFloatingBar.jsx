import { useNavigate } from "react-router";
import { useCompare } from "@/app/contexts/CompareContext";
import { Button } from "@/app/components/ui/button";
import { X, GitCompare, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const navigate = useNavigate();

  if (compareList.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
      >
        <div className="bg-white shadow-2xl rounded-2xl border border-gray-200 px-6 py-4 flex items-center gap-4">
          {/* Left: Selected items */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">
                {compareList.length}/4 phòng đã chọn
              </span>
            </div>

            {/* Mini cards */}
            <div className="flex gap-2">
              {compareList.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="relative group"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img
                      src={property.image}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={() => removeFromCompare(property.id)}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 border-l pl-4">
            <Button
              variant="outline"
              size="sm"
              onClick={clearCompare}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Xóa tất cả
            </Button>
            <Button
              onClick={() => navigate("/compare")}
              disabled={compareList.length < 2}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <GitCompare className="w-4 h-4" />
              So sánh ngay
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
