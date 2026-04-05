import { createContext, useContext, useState, ReactNode } from 'react';
import { RentalProperty } from '@/app/components/types';

interface CompareContextType {
  compareList: RentalProperty[];
  addToCompare: (property: RentalProperty) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<RentalProperty[]>([]);

  const addToCompare = (property: RentalProperty) => {
    setCompareList(prev => {
      // Giới hạn tối đa 4 phòng để so sánh
      if (prev.length >= 4) {
        return prev;
      }
      // Không thêm nếu đã tồn tại
      if (prev.some(p => p.id === property.id)) {
        return prev;
      }
      return [...prev, property];
    });
  };

  const removeFromCompare = (propertyId: string) => {
    setCompareList(prev => prev.filter(p => p.id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (propertyId: string) => {
    return compareList.some(p => p.id === propertyId);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return context;
}
