import { motion } from 'framer-motion';
import { RentalProperty } from './types';
import { PropertyCard } from './PropertyCard';

interface PropertyListProps {
  properties: RentalProperty[];
  onPropertySelect: (property: RentalProperty) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function PropertyList({ properties, onPropertySelect }: PropertyListProps) {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-4 overflow-y-auto h-full p-4"
    >
      <h2 className="text-2xl font-bold mb-4">Danh sách nhà trọ ({properties.length})</h2>
      {properties.map((property) => (
        <motion.div key={property.id} variants={item}>
          <PropertyCard
            property={property}
            onClick={() => onPropertySelect(property)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
