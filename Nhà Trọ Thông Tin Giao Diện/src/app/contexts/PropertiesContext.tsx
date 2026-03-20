import { createContext, useContext, useState, ReactNode } from 'react';
import { RentalProperty } from '@/app/components/types';
import { mockRentalProperties } from '@/app/components/mockData';

interface PropertiesContextType {
  properties: RentalProperty[];
  addProperty: (property: Omit<RentalProperty, 'id'>) => void;
  updateProperty: (id: string, updates: Partial<RentalProperty>) => void;
}

const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<RentalProperty[]>(mockRentalProperties);

  const addProperty = (newProperty: Omit<RentalProperty, 'id'>) => {
    const id = `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const property: RentalProperty = {
      id,
      ...newProperty,
    };
    setProperties((prev) => [property, ...prev]);
  };

  const updateProperty = (id: string, updates: Partial<RentalProperty>) => {
    setProperties((prev) =>
      prev.map((prop) =>
        prop.id === id ? { ...prop, ...updates } : prop
      )
    );
  };

  return (
    <PropertiesContext.Provider value={{ properties, addProperty, updateProperty }}>
      {children}
    </PropertiesContext.Provider>
  );
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertiesProvider');
  }
  return context;
}