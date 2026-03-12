import { createContext, useContext, useState } from "react";

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (property) => {
    setCompareList((prev) => {
      // Giới hạn tối đa 4 phòng
      if (prev.length >= 4) return prev;

      // Không thêm nếu đã tồn tại
      if (prev.some((p) => p.id === property.id)) {
        return prev;
      }

      return [...prev, property];
    });
  };

  const removeFromCompare = (propertyId) => {
    setCompareList((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (propertyId) => {
    return compareList.some((p) => p.id === propertyId);
  };

  const value = {
    compareList,
    addToCompare,
    removeFromCompare,
    clearCompare,
    isInCompare,
  };

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);

  if (!context) {
    throw new Error("useCompare must be used within CompareProvider");
  }

  return context;
}
