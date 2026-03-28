import { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Home,
  ClipboardList,
  Shield,
  ShieldAlert,
  MapPin,
  TrendingUp,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import api from "@/app/utils/api";
import { toast } from "sonner";

interface UserDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export function UserDetailDialog({
  isOpen,
  onClose,
  userId,
}: UserDetailDialogProps) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"profile" | "properties" | "bookings">("profile");


  useEffect(() => {
    if (isOpen && userId) {
      fetchUserDetail();
    } else {
      setData(null);
      setActiveTab("profile");
    }
  }, [isOpen, userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/admin/users/${userId}`);
      if (res.status === 200) {
        setData(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
          <div className="flex items-center gap-5">
            <div className="size-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold border border-white/30 shadow-inner">
              {data?.user?.fullName?.substring(0, 1).toUpperCase() || data?.user?.username?.substring(0, 1).toUpperCase() || "?"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">
                  {data?.user?.fullName || data?.user?.username || "Đang tải..."}
                </h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/20 border border-white/30`}>
                  {data?.user?.role || "USER"}
                </span>
              </div>
              <p className="text-white/80 text-sm flex items-center gap-1.5 font-medium">
                <Mail className="size-3.5" /> {data?.user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-4 text-sm font-bold transition-all relative ${
              activeTab === "profile" ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hồ sơ
            {activeTab === "profile" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16a34a]" />}
          </button>
          {data?.user?.role === "landlord" && (
            <button
              onClick={() => setActiveTab("properties")}
              className={`px-5 py-4 text-sm font-bold transition-all relative ${
                activeTab === "properties" ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Căn hộ ({data?.properties?.length || 0})
              {activeTab === "properties" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16a34a]" />}
            </button>
          )}
          <button
            onClick={() => setActiveTab("bookings")}
            className={`px-5 py-4 text-sm font-bold transition-all relative ${
              activeTab === "bookings" ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Lịch hẹn ({data?.bookings?.length || 0})
            {activeTab === "bookings" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16a34a]" />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fcfdfe]">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="size-10 border-4 border-gray-100 border-t-[#16a34a] rounded-full animate-spin" />
              <p className="text-gray-400 text-sm font-medium animate-pulse">Đang truy xuất dữ liệu...</p>
            </div>
          ) : (
            <>
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <User className="size-3.5" /> Thông tin cơ bản
                      </h4>
                      <div className="space-y-3">
                        <InfoItem label="Họ tên" value={data?.user?.fullName || "Chưa cập nhật"} />
                        <InfoItem label="Username" value={data?.user?.username} />
                        <InfoItem label="Email" value={data?.user?.email} />
                        <InfoItem label="Số điện thoại" value={data?.user?.phone || "---"} />
                      </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Shield className="size-3.5" /> Trạng thái tài khoản
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between py-1 border-b border-gray-50">
                          <span className="text-gray-500 text-sm">Trạng thái:</span>
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            data?.user?.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}>
                            {data?.user?.status === "active" ? "ĐANG HOẠT ĐỘNG" : "BỊ KHOÁ"}
                          </span>
                        </div>
                        <InfoItem label="Vai trò" value={data?.user?.role === 'landlord' ? 'Chủ trọ' : data?.user?.role === 'admin' ? 'Quản trị viên' : 'Người thuê'} />
                        <InfoItem label="Ngày tham gia" value={data?.user?.createdAt ? new Date(data.user.createdAt).toLocaleDateString("vi-VN") : "---"} />
                        <InfoItem label="Cấp độ xác minh" value={`Level ${data?.user?.verificationLevel || 1}`} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "properties" && (
                <div className="space-y-4">
                  {data?.properties?.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {data.properties.map((prop: any) => (
                        <div key={prop._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:border-[#16a34a]/30 transition-all group">
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center text-2xl font-bold text-gray-300">
                             {prop.image ? <img src={prop.image} className="w-full h-full object-cover rounded-lg" /> : "🏠"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-bold text-gray-900 truncate mb-1 group-hover:text-[#16a34a] transition-colors">{prop.name}</h5>
                              <p className="text-xs text-gray-500 flex items-start gap-1 mb-2">
                                <MapPin className="size-3 mt-0.5 shrink-0" /> {prop.address}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-bold text-[#16a34a]">{prop.price?.toLocaleString()}đ/th</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  prop.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                                }`}>
                                  {prop.status === 'approved' ? 'HIỂN THỊ' : 'CHỜ DUYỆT'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyState icon={<Home />} text="Chưa đăng tin nào" />
                  )}
                </div>
              )}

              {activeTab === "bookings" && (
                <div className="space-y-3">
                  {data?.bookings?.length > 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b border-gray-100">
                            <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase text-[10px]">Căn hộ</th>
                            <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase text-[10px]">Thời gian</th>
                            <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase text-[10px]">Đối tác</th>
                            <th className="px-4 py-3 text-left font-bold text-gray-500 uppercase text-[10px]">Trạng thái</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {data.bookings.map((b: any) => (
                            <tr key={b._id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="font-bold text-gray-900">{b.propertyId?.name || "N/A"}</div>
                                <div className="text-[10px] text-gray-400 truncate max-w-[150px]">{b.propertyId?.address}</div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium text-gray-700">{new Date(b.bookingDate).toLocaleDateString('vi-VN')}</div>
                                <div className="text-[10px] text-gray-400">{b.bookingTime}</div>
                              </td>
                              <td className="px-4 py-3">
                                {data?.user?.role === 'landlord' ? (
                                  <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold">
                                      {b.userId?.username?.substring(0, 1).toUpperCase()}
                                    </div>
                                    <span className="text-gray-600 font-medium">{b.customerName}</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2">
                                    <div className="size-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold">
                                      {b.landlordId?.name?.substring(0, 1).toUpperCase()}
                                    </div>
                                    <span className="text-gray-600 font-medium">{b.landlordId?.name}</span>
                                  </div>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`text-[10px] font-bold uppercase ${
                                  b.status === 'completed' ? 'text-green-600' : b.status === 'confirmed' ? 'text-blue-600' : 'text-amber-600'
                                }`}>
                                  {b.status === 'pending' ? 'Chờ duyệt' : b.status === 'confirmed' ? 'Đã xác nhận' : b.status === 'completed' ? 'Hoàn thành' : b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState icon={<ClipboardList />} text="Chưa có lịch hẹn nào" />
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="px-8 font-bold border-gray-200 text-gray-500 hover:bg-white hover:text-gray-900 whitespace-nowrap">
            Đóng
          </Button>
          {!loading && data?.user && (
            <Button 
               className={`px-8 font-bold text-white shadow-lg ${
                 data?.user?.status === 'active' 
                   ? 'bg-[#dc2626] hover:bg-[#b91c1c] shadow-red-200' 
                   : 'bg-[#16a34a] hover:bg-[#15803d] shadow-green-200'
               }`}
               onClick={() => {
                 // Confirm the action with the user
                 if (window.confirm(`Bạn có chắc muốn ${data?.user?.status === 'active' ? 'KHOÁ' : 'MỞ KHOÁ'} tài khoản này?`)) {
                   // Trigger the action and provide feedback
                   toast.info("Tính năng cập nhật trạng thái đã sẵn có ngoài danh sách.");
                 }
               }}
            >
              {data?.user?.status === "active" ? "Khoá tài khoản" : "Mở khoá tài khoản"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-gray-50 last:border-0">
      <span className="text-gray-500 text-sm">{label}:</span>
      <span className="text-[#0f172a] font-bold text-sm text-right">{value}</span>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-gray-300 gap-3 grayscale opacity-60">
      <div className="size-16 rounded-full bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="[&>svg]:size-8 text-gray-300">{icon}</div>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider">{text}</p>
    </div>
  );
}
