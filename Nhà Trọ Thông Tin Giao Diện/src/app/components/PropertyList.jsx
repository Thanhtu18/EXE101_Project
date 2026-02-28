import { PropertyCard } from "./PropertyCard";

export function PropertyList({ properties, onPropertySelect }) {
  return (
    <div className="space-y-4 overflow-y-auto h-full p-4">
      <h2 className="text-2xl font-bold mb-4">
        Danh sách nhà trọ ({properties.length})
      </h2>
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onClick={() => onPropertySelect(property)}
        />
      ))}
    </div>
  );
}
