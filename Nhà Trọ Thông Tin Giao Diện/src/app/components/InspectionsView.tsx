import { useState } from 'react';
import { useVerification } from '@/app/contexts/VerificationContext';
import { useProperties } from '@/app/contexts/PropertiesContext';
import { InspectionDialog } from '@/app/components/InspectionDialog';
import { VerificationRequest } from '@/app/components/types';
import { Button } from '@/app/components/ui/button';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  MapPin, 
  Phone,
  Award,
  ShieldCheck,
  User,
} from 'lucide-react';

export function InspectionsView() {
  const { requests, updateRequestStatus } = useVerification();
  const { properties } = useProperties();
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInspect = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setIsDialogOpen(true);
  };

  const handleApprove = (requestId: string) => {
    if (confirm('Xác nhận duyệt lịch hẹn kiểm tra?')) {
      updateRequestStatus(requestId, 'approved');
      alert('✅ Đã duyệt lịch hẹn!');
    }
  };

  const handleReject = (requestId: string) => {
    const reason = prompt('Lý do từ chối:');
    if (reason) {
      updateRequestStatus(requestId, 'rejected');
      alert('❌ Đã từ chối yêu cầu!');
    }
  };

  const getStatusBadge = (status: VerificationRequest['status']) => {
    const configs = {
      pending: { label: '⏳ Chờ duyệt', color: 'bg-orange-100 text-orange-800' },
      approved: { label: '✓ Đã duyệt', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '✅ Hoàn thành', color: 'bg-green-100 text-green-800' },
      rejected: { label: '✗ Từ chối', color: 'bg-red-100 text-red-800' },
    };
    const config = configs[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getBadgeIcon = (level?: string) => {
    if (!level || level === 'none') return null;
    return '✓';
  };

  // Stats
  const stats = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    completed: requests.filter(r => r.status === 'completed').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-orange-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Clock className="size-6 text-orange-600" />
            <span className="text-3xl font-bold text-orange-600">{stats.pending}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Chờ duyệt</p>
        </div>
        <div className="bg-white rounded-xl border border-blue-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="size-6 text-blue-600" />
            <span className="text-3xl font-bold text-blue-600">{stats.approved}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đã duyệt lịch</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <Award className="size-6 text-green-600" />
            <span className="text-3xl font-bold text-green-600">{stats.completed}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đã cấp tích xanh</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="size-6 text-red-600" />
            <span className="text-3xl font-bold text-red-600">{stats.rejected}</span>
          </div>
          <p className="text-sm text-gray-600 font-medium">Từ chối</p>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Danh sách yêu cầu kiểm tra</h3>
        </div>
        
        {requests.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldCheck className="size-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có yêu cầu kiểm tra nào
            </h3>
            <p className="text-gray-600">
              Các yêu cầu từ chủ trọ sẽ hiển thị ở đây
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {requests.map((request) => {
              const property = properties.find(p => p.id === request.propertyId);
              return (
                <div key={request.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-6">
                    {/* Property Image */}
                    {property && (
                      <div className="flex-shrink-0">
                        <img
                          src={property.image}
                          alt={request.propertyName}
                          className="w-24 h-24 rounded-lg object-cover border"
                        />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">
                            {request.propertyName}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <User className="size-4" />
                              {request.landlordName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="size-4" />
                              {request.phone}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(request.status)}
                          {request.badgeAwarded && request.badgeAwarded !== 'none' && (
                            <span className="px-3 py-1 bg-gradient-to-r from-green-50 to-blue-50 border border-green-300 rounded-full text-xs font-semibold text-green-800">
                              {getBadgeIcon(request.badgeAwarded)} Đã cấp {request.badgeAwarded.toUpperCase()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="size-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">{request.address}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <Calendar className="size-4 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-700">
                            {new Date(request.scheduledDate).toLocaleDateString('vi-VN', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })} • {request.scheduledTime}
                          </span>
                        </div>
                      </div>

                      {request.notes && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-blue-900">
                            <span className="font-semibold">Ghi chú:</span> {request.notes}
                          </p>
                        </div>
                      )}

                      {request.inspectorNotes && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                          <p className="text-sm text-green-900">
                            <span className="font-semibold">Kết quả kiểm tra:</span> {request.inspectorNotes}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApprove(request.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                              size="sm"
                            >
                              <CheckCircle className="size-4 mr-2" />
                              Duyệt lịch
                            </Button>
                            <Button
                              onClick={() => handleReject(request.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="size-4 mr-2" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <Button
                            onClick={() => handleInspect(request)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                            size="sm"
                          >
                            <ShieldCheck className="size-4 mr-2" />
                            Hoàn thành kiểm tra
                          </Button>
                        )}
                        {request.status === 'completed' && (
                          <div className="text-sm text-gray-600">
                            Hoàn thành lúc {new Date(request.completedAt!).toLocaleString('vi-VN')}
                          </div>
                        )}
                        {request.status === 'rejected' && (
                          <div className="text-sm text-red-600 font-medium">
                            Đã từ chối yêu cầu này
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inspection Dialog */}
      {selectedRequest && (
        <InspectionDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedRequest(null);
          }}
          request={selectedRequest}
        />
      )}
    </div>
  );
}