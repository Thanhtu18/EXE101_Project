import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { propertyService } from '@/services/propertyService';
import { RentalProperty } from '@/types/models';

interface PropertiesContextValue {
  properties: RentalProperty[];
  loading: boolean;
  refresh: () => Promise<void>;
  search: (keyword: string) => Promise<void>;
}

const PropertiesContext = createContext<PropertiesContextValue | undefined>(undefined);

export function PropertiesProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = useState<RentalProperty[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await propertyService.list();
      setProperties(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const search = useCallback(async (keyword: string) => {
    setLoading(true);
    try {
      if (!keyword.trim()) {
        const all = await propertyService.list();
        setProperties(all);
      } else {
        const data = await propertyService.list({ keyword });
        setProperties(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      properties,
      loading,
      refresh,
      search,
    }),
    [loading, properties, refresh, search],
  );

  return <PropertiesContext.Provider value={value}>{children}</PropertiesContext.Provider>;
}

export function useProperties() {
  const context = useContext(PropertiesContext);
  if (!context) {
    throw new Error('useProperties must be used within PropertiesProvider');
  }
  return context;
}
