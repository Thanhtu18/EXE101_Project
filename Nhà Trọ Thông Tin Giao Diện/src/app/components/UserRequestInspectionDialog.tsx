import { useState } from 'react';
import { RentalProperty } from './types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useVerification } from '@/app/contexts/VerificationContext';
import { toast } from 'sonner';
import { Calendar, Clock, User, Phone, AlertCircle, ShieldCheck, Info } from 'lucide-react';

interface UserRequestInspectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  property: RentalProperty;
  currentUserId: string; // ID của user hiện tại
  currentUserName: string; // Tên user hiện tại
}

export function UserRequestInspectionDialog({
  open,
  onOpenChange,
  property,
  currentUserId,
  currentUserName,
}: UserRequestInspectionDialogProps) {
  const { addRequest } = useVerification();
  const [formData, setFormData] = useState({
    scheduledDate: '',
    scheduledTime: '',
    userPhone: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.scheduledDate || !formData.scheduledTime || !formData.userPhone) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setIsSubmitting(true);

    try {
      addRequest({
        propertyId: property.id,
        propertyName: property.name,
        landlordId: property.landlordId || 'unknown',
        landlordName: property.ownerName,
        phone: property.phone,
        address: property.address,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        notes: formData.notes,
        // User-specific fields
        requesterType: 'user',
        requesterId: currentUserId,
        requesterName: currentUserName,
        requesterPhone: formData.userPhone,
      });

      toast.success('Yêu cầu kiểm tra đã được gửi! Admin sẽ liên hệ bạn sớm.');
      onOpenChange(false);
      
      // Reset form
      setFormData({
        scheduledDate: '',
        scheduledTime: '',
        userPhone: '',
        notes: '',
      });
    } catch (error) {
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <ShieldCheck className="size-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">Yêu cầu kiểm tra phòng trọ</DialogTitle>
              <DialogDescription className="text-sm">
                Gửi yêu cầu để MapHome kiểm tra thực địa
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Info className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-semibold mb-1">Tại sao bạn nên yêu cầu kiểm tra?</p>
              <ul className="space-y-1 text-xs">
                <li>✓ Đội ngũ MapHome sẽ đến thực địa xác minh thông tin</li>
                <li>✓ Bảo vệ bạn khỏi tin ảo và lừa đảo</li>
                <li>✓ Admin sẽ yêu cầu bạn gửi ảnh chụp thực tế (nếu cần)</li>
                <li>✓ Miễn phí cho người thuê trọ!</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Property info */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <h4 className="font-semibold text-sm mb-2 text-gray-700">Thông tin phòng trọ</h4>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">Tên:</span> {property.name}</p>
            <p><span className="font-medium">Địa chỉ:</span> {property.address}</p>
            <p><span className="font-medium">Giá:</span> {property.price.toLocaleString('vi-VN')}đ/tháng</p>
            <p><span className="font-medium">Chủ trọ:</span> {property.ownerName} - {property.phone}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Your info */}
          <div className="space-y-3 border rounded-lg p-4 bg-purple-50/50">
            <h4 className="font-semibold text-sm flex items-center gap-2 text-purple-900">
              <User className="size-4" />
              Thông tin của bạn
            </h4>
            
            <div className="space-y-2">
              <Label htmlFor="userName" className="text-sm">
                Họ tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="userName"
                value={currentUserName}
                disabled
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userPhone" className="text-sm">
                Số điện thoại <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  id="userPhone"
                  type="tel"
                  placeholder="0901234567"
                  value={formData.userPhone}
                  onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                  className="pl-10"
                  required
                />
              </div>
              <p className="text-xs text-gray-500">Admin sẽ liên hệ bạn qua số này</p>
            </div>
          </div>

          {/* Preferred schedule */}
          <div className="space-y-3 border rounded-lg p-4">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <Calendar className="size-4" />
              Lịch hẹn mong muốn
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="scheduledDate" className="text-sm">
                  Ngày <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledTime" className="text-sm">
                  Giờ <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Đây là lịch hẹn dự kiến, admin sẽ xác nhận lại với bạn
            </p>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">
              Ghi chú thêm (tùy chọn)
            </Label>
            <Textarea
              id="notes"
              placeholder="VD: Tôi có thể đến cùng admin để xem phòng trực tiếp..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-semibold mb-1">Lưu ý quan trọng:</p>
              <p>Admin có thể yêu cầu bạn gửi ảnh chụp thực tế của phòng trọ để xác minh. Vui lòng kiểm tra thông báo trong dashboard sau khi gửi yêu cầu.</p>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Clock className="size-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <ShieldCheck className="size-4 mr-2" />
                  Gửi yêu cầu kiểm tra
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
