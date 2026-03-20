import { createContext, useContext, useState, ReactNode } from 'react';
import { VerificationRequest, GreenBadge, GreenBadgeLevel } from '@/app/components/types';

interface VerificationContextType {
  requests: VerificationRequest[];
  addRequest: (request: Omit<VerificationRequest, 'id' | 'requestedAt' | 'status'>) => void;
  updateRequestStatus: (requestId: string, status: VerificationRequest['status']) => void;
  completeInspection: (requestId: string, badgeLevel: GreenBadgeLevel, notes?: string) => void;
  getRequestsByLandlord: (landlordId: string) => VerificationRequest[];
  getRequestsByProperty: (propertyId: string) => VerificationRequest[];
  getRequestsByUser: (userId: string) => VerificationRequest[]; // New
  notifyUserAboutPhotos: (requestId: string) => void; // New - Thông báo user gửi ảnh
  submitUserPhotos: (requestId: string, photos: string[]) => void; // New - User gửi ảnh
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);

  const addRequest = (newRequest: Omit<VerificationRequest, 'id' | 'requestedAt' | 'status'>) => {
    const id = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const request: VerificationRequest = {
      id,
      ...newRequest,
      requestedAt: new Date().toISOString(),
      status: 'pending',
    };
    setRequests((prev) => [request, ...prev]);
  };

  const updateRequestStatus = (requestId: string, status: VerificationRequest['status']) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status } : req
      )
    );
  };

  const completeInspection = (requestId: string, badgeLevel: GreenBadgeLevel, notes?: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'completed',
              completedAt: new Date().toISOString(),
              badgeAwarded: badgeLevel,
              inspectorNotes: notes,
            }
          : req
      )
    );
  };

  const getRequestsByLandlord = (landlordId: string) => {
    return requests.filter((req) => req.landlordId === landlordId);
  };

  const getRequestsByProperty = (propertyId: string) => {
    return requests.filter((req) => req.propertyId === propertyId);
  };

  const getRequestsByUser = (userId: string) => {
    return requests.filter((req) => req.requesterType === 'user' && req.requesterId === userId);
  };

  const notifyUserAboutPhotos = (requestId: string) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'awaiting_photos' as const,
              notifiedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  const submitUserPhotos = (requestId: string, photos: string[]) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'photos_submitted' as const,
              userProvidedPhotos: photos,
              photosSubmittedAt: new Date().toISOString(),
            }
          : req
      )
    );
  };

  return (
    <VerificationContext.Provider
      value={{
        requests,
        addRequest,
        updateRequestStatus,
        completeInspection,
        getRequestsByLandlord,
        getRequestsByProperty,
        getRequestsByUser,
        notifyUserAboutPhotos,
        submitUserPhotos,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}

export function useVerification() {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}