import { useState } from "react";
import { format, addDays, isAfter, startOfDay } from "date-fns";
import { vi } from "date-fns/locale/vi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Calendar } from "@/app/components/ui/calendar";
import { Input } from "@/app/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  MessageSquare,
  Check,
} from "lucide-react";

const TIME_SLOTS = [
  { value: "08:00", label: "08:00 - 09:00" },
  { value: "09:00", label: "09:00 - 10:00" },
  { value: "10:00", label: "10:00 - 11:00" },
  { value: "11:00", label: "11:00 - 12:00" },
  { value: "14:00", label: "14:00 - 15:00" },
  { value: "15:00", label: "15:00 - 16:00" },
  { value: "16:00", label: "16:00 - 17:00" },
  { value: "17:00", label: "17:00 - 18:00" },
  { value: "18:00", label: "18:00 - 19:00" },
];

export function BookingDialog({ open, onOpenChange, property }) {
  const [selectedDate, setSelectedDate] = useState(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [note, setNote] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      alert("Vui lòng chọn ngày và giờ xem nhà");
      return;
    }

    // Show confirmation
    const dateStr = format(selectedDate, "dd/MM/yyyy", { locale: vi });
    const timeSlot = TIME_SLOTS.find((t) => t.value === selectedTime)?.label;

    const message =
      `✓ Đặt lịch xem nhà thành công!\n\n` +
      `Phòng: ${property.name}\n` +
      `Địa chỉ: ${property.address}\n\n` +
      `Ngày: ${dateStr}\n` +
      `Giờ: ${timeSlot}\n\n` +
      `Người xem: ${customerName}\n` +
      `SĐT: ${customerPhone}\n` +
      `${note ? `Ghi chú: ${note}\n\n` : "\n"}` +
      `Chủ nhà sẽ liên hệ lại với bạn để xác nhận.`;

    setIsSubmitted(true);

    // Reset after 2 seconds and close
    setTimeout(() => {
      alert(message);
      onOpenChange(false);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedDate(undefined);
        setSelectedTime("");
        setCustomerName("");
        setCustomerPhone("");
        setNote("");
      }, 300);
    }, 1500);
  };

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30); // Can book up to 30 days ahead

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isSubmitted ? (
          <div className="py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Check className="size-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-green-600 mb-2">
              Đặt lịch thành công!
            </h3>
            <p className="text-gray-600">Chủ nhà sẽ liên hệ lại với bạn</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <CalendarIcon className="size-6 text-blue-600" />
                Đặt lịch xem nhà
              </DialogTitle>
              <DialogDescription>
                {property.name} - {property.address}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Property Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={property.image}
                    alt={property.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {property.name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {property.address}
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      {property.price.toLocaleString("vi-VN")}đ/tháng
                    </p>
                  </div>
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Chọn ngày xem nhà *
                </label>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      !isAfter(date, addDays(today, -1)) ||
                      isAfter(date, maxDate)
                    }
                    locale={vi}
                    className="rounded-md border"
                  />
                </div>
                {selectedDate && (
                  <p className="text-center mt-2 text-sm text-blue-600 font-medium">
                    Đã chọn:{" "}
                    {format(selectedDate, "dd/MM/yyyy", { locale: vi })}
                  </p>
                )}
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="size-4" />
                  Chọn khung giờ *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedTime(slot.value)}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedTime === slot.value
                          ? "border-blue-600 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User className="size-4" />
                    Họ tên của bạn *
                  </label>
                  <Input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="size-4" />
                    Số điện thoại *
                  </label>
                  <Input
                    type="tel"
                    placeholder="0912 345 678"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="size-4" />
                  Ghi chú (tùy chọn)
                </label>
                <textarea
                  className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Thêm ghi chú cho chủ nhà..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Thông tin liên hệ chủ nhà
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="size-4 text-gray-500" />
                    <span className="font-medium">{property.ownerName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-gray-500" />
                    <a
                      href={`tel:${property.phone.replace(/\s/g, "")}`}
                      className="text-blue-600 hover:underline"
                    >
                      {property.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  <CalendarIcon className="size-4 mr-2" />
                  Xác nhận đặt lịch
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
