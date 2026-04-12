import { motion, AnimatePresence } from "framer-motion";
import { RentalProperty } from "./types";
import { PropertyCard } from "./PropertyCard";

interface PropertyListProps {
  properties: RentalProperty[];
  onPropertySelect: (property: RentalProperty) => void;
  loading?: boolean;
}

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
};

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow p-4 animate-pulse">
      <div className="h-44 bg-gray-100 rounded-lg mb-3" />
      <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-100 rounded w-full" />
    </div>
  );
}

export function PropertyList({
  properties,
  onPropertySelect,
  loading = false,
}: PropertyListProps) {
  if (loading) {
    return (
      <div className="h-full overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Danh sách nhà trọ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-48 h-48 rounded-xl bg-gradient-to-br from-emerald-50 to-white flex items-center justify-center shadow-md mb-6"
        >
          <svg
            width="96"
            height="96"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21l-4.35-4.35"
              stroke="#06503B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="#06503B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
        <h3 className="text-lg font-bold mb-2">Không tìm thấy kết quả</h3>
        <p className="text-sm text-gray-500 text-center">
          Thử xóa bộ lọc hoặc điều chỉnh tiêu chí tìm kiếm để có nhiều kết quả
          hơn.
        </p>
      </div>
    );
  }

  return (
    <motion.div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Danh sách nhà trọ ({properties.length})
      </h2>

      <AnimatePresence initial={false}>
        <motion.ul
          layout
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {properties.map((property) => (
            <motion.li
              key={property.id}
              layout
              variants={itemVariants}
              exit="exit"
            >
              <PropertyCard
                property={property}
                onClick={() => onPropertySelect(property)}
              />
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </motion.div>
  );
}
