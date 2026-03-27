import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { AlertCircle, Flag, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface ReportPropertyDialogProps {
  propertyId: string;
  propertyName: string;
}

export function ReportPropertyDialog({ propertyId, propertyName }: ReportPropertyDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const handleSubmit = async () => {
    if (!reason) {
      setError("Vui lòng chọn lý do báo cáo.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/reports`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyId,
          reason,
          description,
        }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setOpen(false);
          setIsSubmitted(false);
          setReason("");
          setDescription("");
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.message || "Có lỗi xảy ra khi gửi báo cáo.");
      }
    } catch (err) {
      console.error("Report error:", err);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
          <Flag className="size-4 mr-2" />
          Báo cáo tin đăng
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {isSubmitted ? (
          <div className="py-12 text-center">
            <CheckCircle2 className="size-12 text-green-600 mx-auto mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Cảm ơn bạn!</h3>
            <p className="text-gray-600">
              Báo cáo của bạn đã được gửi. Chúng tôi sẽ xem xét trong thời gian sớm nhất.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <Flag className="size-5" />
                Báo cáo tin đăng
              </DialogTitle>
              <DialogDescription>
                Bạn đang báo cáo tin: <span className="font-semibold text-gray-900">{propertyName}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm flex items-center gap-2">
                  <AlertCircle className="size-4" />
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <label className="text-sm font-medium">Lý do báo cáo *</label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn lý do" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incorrect_info">Thông tin không chính xác</SelectItem>
                    <SelectItem value="duplicate">Tin đăng trùng lặp</SelectItem>
                    <SelectItem value="sold_rented">Phòng đã cho thuê/bán</SelectItem>
                    <SelectItem value="fraud">Dấu hiệu lừa đảo</SelectItem>
                    <SelectItem value="prohibited_content">Nội dung cấm/nhạy cảm</SelectItem>
                    <SelectItem value="other">Lý do khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium">Mô tả chi tiết (không bắt buộc)</label>
                <Textarea
                  placeholder="Cung cấp thêm chi tiết để chúng tôi xử lý nhanh hơn..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={isSubmitting}>
                Hủy
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  "Gửi báo cáo"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
