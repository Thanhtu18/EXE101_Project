import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { RentalProperty } from '@/app/components/types';
import { useAuth } from './AuthContext';

interface PropertiesContextType {
  properties: RentalProperty[];
  loading: boolean;
  addProperty: (property: Omit<RentalProperty, 'id'>) => Promise<boolean>;
  updateProperty: (id: string, updates: Partial<RentalProperty>) => Promise<boolean>;
  searchProperties: (filters: any) => Promise<void>;
  refreshProperties: () => Promise<void>;
}


const PropertiesContext = createContext<PropertiesContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

export function PropertiesProvider({ children }: { children: ReactNode }) {
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const mapBackendProperty = (prop: any): RentalProperty => ({
    ...prop,
    id: prop._id,
  });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/properties?all=true`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.map(mapBackendProperty));
      }
    } catch (err) {
      console.error("Failed to fetch properties:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const addProperty = async (newProperty: Omit<RentalProperty, 'id'>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProperty),
      });
      if (res.ok) {
        const data = await res.json();
        setProperties((prev) => [mapBackendProperty(data), ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add property:", err);
      return false;
    }
  };

  const updateProperty = async (id: string, updates: Partial<RentalProperty>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setProperties((prev) =>
          prev.map((prop) => (prop.id === id ? mapBackendProperty(data) : prop))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update property:", err);
      return false;
    }
  };

  const searchProperties = async (filters: any) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const res = await fetch(`${API_BASE}/api/properties/search?${queryParams.toString()}`);
      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data) ? data : (data.properties || []);
        setProperties(results.map(mapBackendProperty));
      }

    } catch (err) {
      console.error("Failed to search properties:", err);
    } finally {
      setLoading(false);
    }
  };

  return (

    <PropertiesContext.Provider 
      value={{ 
        properties, 
        loading, 
        addProperty, 
        updateProperty,
        searchProperties,
        refreshProperties: fetchProperties 
      }}

    >
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