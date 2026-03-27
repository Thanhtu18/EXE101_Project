import { useState, useEffect } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { X, Home, MapPin, DollarSign, Maximize } from 'lucide-react';

interface EditPropertyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  onSuccess: () => void;
}

export function EditPropertyDialog({
  isOpen,
  onClose,
  property,
  onSuccess,
}: EditPropertyDialogProps) {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [price, setPrice] = useState('');
  const [area, setArea] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (property) {
      setName(property.name || '');
      setAddress(property.address || '');
      setPrice(property.price?.toString() || '');
      setArea(property.area?.toString() || '');
    }
  }, [property]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem("token");
      const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";
      
      const res = await fetch(`${API_BASE}/api/properties/${property._id || property.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          name,
          address,
          price: Number(price),
          area: Number(area)
        })
      });

      if (!res.ok) {
        throw new Error("Lỗi khi cập nhật phòng");
      }

      alert("✅ Cập nhật thông tin phòng thành công!");
      onSuccess();
      onClose();
    } catch (err: any) {
      alert("❌ Cập nhật thất bại: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !property) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="flex bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-t-2xl items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Home className="size-5" />
            Sửa thông tin phòng
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded">
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <Home className="size-4 text-blue-500" /> Tên phòng trọ / Tiêu đề
            </Label>
            <Input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ví dụ: Phòng trọ cao cấp trung tâm..." 
              required
            />
          </div>
          
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
              <MapPin className="size-4 text-red-500" /> Địa chỉ
            </Label>
            <Input 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ cụ thể..." 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <DollarSign className="size-4 text-green-500" /> Giá thuê (VNĐ)
              </Label>
              <Input 
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="VD: 3000000" 
                required
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                <Maximize className="size-4 text-purple-500" /> Diện tích (m²)
              </Label>
              <Input 
                type="number"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="VD: 25" 
                required
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
