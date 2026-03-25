import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { VerificationRequest, GreenBadgeLevel } from '@/app/components/types';
import { useAuth } from './AuthContext';

interface VerificationContextType {
  requests: VerificationRequest[];
  loading: boolean;
  addRequest: (request: Omit<VerificationRequest, 'id' | 'requestedAt' | 'status'>) => Promise<boolean>;
  updateRequestStatus: (requestId: string, status: VerificationRequest['status']) => Promise<boolean>;
  completeInspection: (requestId: string, badgeLevel: GreenBadgeLevel, notes?: string) => Promise<boolean>;
  getRequestsByLandlord: (landlordId: string) => VerificationRequest[];
  getRequestsByProperty: (propertyId: string) => VerificationRequest[];
  getRequestsByUser: (userId: string) => VerificationRequest[];
  notifyUserAboutPhotos: (requestId: string) => Promise<boolean>;
  submitUserPhotos: (requestId: string, photos: string[]) => Promise<boolean>;
  refreshRequests: () => Promise<void>;
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

export function VerificationProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const mapBackendRequest = (req: any): VerificationRequest => ({
    ...req,
    id: req._id,
  });

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/api/verifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.map(mapBackendRequest));
      }
    } catch (err) {
      console.error("Failed to fetch verification requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests();
    }
  }, [user]);

  const addRequest = async (newRequest: Omit<VerificationRequest, 'id' | 'requestedAt' | 'status'>) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/verifications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRequest),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) => [mapBackendRequest(data), ...prev]);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to add verification request:", err);
      return false;
    }
  };

  const updateRequestStatus = async (requestId: string, status: VerificationRequest['status']) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/verifications/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mapBackendRequest(data) : req))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to update verification request status:", err);
      return false;
    }
  };

  const completeInspection = async (requestId: string, badgeLevel: GreenBadgeLevel, notes?: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/verifications/${requestId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ badgeAwarded: badgeLevel, inspectorNotes: notes }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mapBackendRequest(data) : req))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to complete inspection:", err);
      return false;
    }
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

  const notifyUserAboutPhotos = async (requestId: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/verifications/${requestId}/notify`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mapBackendRequest(data) : req))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to notify user about photos:", err);
      return false;
    }
  };

  const submitUserPhotos = async (requestId: string, photos: string[]) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/verifications/${requestId}/photos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ photos }),
      });
      if (res.ok) {
        const data = await res.json();
        setRequests((prev) =>
          prev.map((req) => (req.id === requestId ? mapBackendRequest(data) : req))
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to submit photos:", err);
      return false;
    }
  };

  return (
    <VerificationContext.Provider
      value={{
        requests,
        loading,
        addRequest,
        updateRequestStatus,
        completeInspection,
        getRequestsByLandlord,
        getRequestsByProperty,
        getRequestsByUser,
        notifyUserAboutPhotos,
        submitUserPhotos,
        refreshRequests: fetchRequests,
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