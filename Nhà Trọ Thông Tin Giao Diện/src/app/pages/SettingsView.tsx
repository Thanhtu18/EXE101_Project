import { useState, useEffect } from "react";
import { 
  Settings, 
  Globe, 
  Phone, 
  Mail, 
  ShieldAlert, 
  DollarSign, 
  Bell, 
  Save, 
  RotateCcw,
  Zap,
  Info,
  Layers,
  Edit2,
  Trash2,
  Plus,
  User,
  Camera,
  Key,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { useAuth } from "@/app/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export function SettingsView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"general" | "pricing" | "broadcast" | "subscription_plans" | "account">("general");

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/subscriptions/plans`);
      if (res.ok) {
        setPlans(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchPlans();
  }, []);

  const handleUpdatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/subscriptions/plans/${editingPlan._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPlan),
      });
      if (res.ok) {
        toast.success("Cập nhật gói thành công! ✨");
        setEditingPlan(null);
        fetchPlans();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/subscriptions/plans`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPlan),
      });
      if (res.ok) {
        toast.success("Tạo gói mới thành công! 🚀");
        setEditingPlan(null);
        setIsCreating(false);
        fetchPlans();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string, name: string) => {
    if (!window.confirm(`⚠️ Bạn có chắc chắn muốn xóa gói "${name}"? Các người dùng đang sử dụng gói này sẽ không bị ảnh hưởng, nhưng người mới sẽ không thể mua gói này nữa.`)) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/subscriptions/plans/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Đã ngừng kích hoạt gói! 📁");
        fetchPlans();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleResetPlans = async () => {
    if (!window.confirm("⚠️ Bạn có chắc chắn muốn đặt lại các gói về mặc định (4 gói chính)? Các gói cũ sẽ bị ngừng kích hoạt nhưng người dùng đang sử dụng vẫn giữ nguyên quyền lợi.")) return;
    
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/subscriptions/reset`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Đã đặt lại các gói về 4 tầng chính thức! 🛠️");
        fetchPlans();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/admin/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Cài đặt hệ thống đã được cập nhật! ✨");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#16a34a]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="size-5 text-[#16a34a]" /> Cấu hình Hệ thống
          </h2>
          <p className="text-sm text-gray-500">Quản lý các tham số vận hành toàn nền tảng</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => fetchSettings()}
            className="flex items-center gap-2"
          >
            <RotateCcw className="size-4" /> Hoàn tác
          </Button>
          <Button 
            onClick={handleUpdate}
            disabled={saving}
            className="bg-gradient-to-r from-[#16a34a] to-[#0ea5e9] text-white flex items-center gap-2 shadow-lg shadow-green-200"
          >
            <Save className="size-4" /> {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[200px_1fr] gap-6">
        {/* Navigation Sidebar */}
        <div className="space-y-1">
          <TabNav 
            active={activeTab === "general"} 
            onClick={() => setActiveTab("general")} 
            icon={<Globe />} 
            label="Chung" 
          />
          <TabNav 
            active={activeTab === "pricing"} 
            onClick={() => setActiveTab("pricing")} 
            icon={<DollarSign />} 
            label="Dịch vụ & Giá" 
          />
          <TabNav 
            active={activeTab === "broadcast"} 
            onClick={() => setActiveTab("broadcast")} 
            icon={<Bell />} 
            label="Truyền thông" 
          />
          <TabNav 
            active={activeTab === "subscription_plans"} 
            onClick={() => setActiveTab("subscription_plans")} 
            icon={<Layers />} 
            label="Gói dịch vụ" 
          />
          <div className="pt-4 mt-4 border-t border-gray-100">
            <TabNav 
              active={activeTab === "account"} 
              onClick={() => setActiveTab("account")} 
              icon={<User />} 
              label="Tài khoản" 
            />
          </div>
        </div>

        {/* Form Area */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <form className="p-6 space-y-8">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <SectionHeader 
                  title="Thông tin nền tảng" 
                  description="Cập nhật các thông tin hiển thị cơ bản của website."
                />
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup 
                    label="Tên Website" 
                    value={settings.siteName} 
                    onChange={(val) => setSettings({...settings, siteName: val})} 
                    icon={<Globe className="size-4" />}
                  />
                  <InputGroup 
                    label="Email Hỗ trợ" 
                    value={settings.contactEmail} 
                    onChange={(val) => setSettings({...settings, contactEmail: val})} 
                    icon={<Mail className="size-4" />}
                  />
                  <InputGroup 
                    label="Hotline" 
                    value={settings.contactPhone} 
                    onChange={(val) => setSettings({...settings, contactPhone: val})} 
                    icon={<Phone className="size-4" />}
                  />
                </div>

                <div className="pt-6 border-t border-gray-50">
                  <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-lg">
                        <ShieldAlert className="size-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-red-900">Chế độ Bảo trì</h4>
                        <p className="text-xs text-red-700">Tạm khóa toàn bộ truy cập từ phía người dùng.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings.maintenanceMode}
                        onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "pricing"}
            {activeTab === "pricing" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                <SectionHeader 
                    title="Cấu hình Giá Dịch vụ" 
                    description="Thiết lập chi phí cho các gói xác thực Tích Xanh."
                />
                <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-50">
                        <div className="flex items-center gap-2 mb-4 text-blue-700">
                            <Zap className="size-4" />
                            <span className="text-xs font-bold uppercase">Gói Xác thực Cơ bản</span>
                        </div>
                        <InputGroup 
                            label="Chi phí (VNĐ)" 
                            type="number"
                            value={settings.pricing.basicVerification} 
                            onChange={(val) => setSettings({...settings, pricing: {...settings.pricing, basicVerification: parseInt(val)}})} 
                        />
                        <p className="mt-2 text-[10px] text-blue-600 italic">* Áp dụng cho xác minh qua số điện thoại/Zalo.</p>
                    </div>

                    <div className="p-4 bg-amber-50/30 rounded-2xl border border-amber-50">
                        <div className="flex items-center gap-2 mb-4 text-amber-700">
                            <Zap className="size-4" />
                            <span className="text-xs font-bold uppercase">Gói Xác thực Premium (Đi thực địa)</span>
                        </div>
                        <InputGroup 
                            label="Chi phí (VNĐ)" 
                            type="number"
                            value={settings.pricing.premiumVerification} 
                            onChange={(val) => setSettings({...settings, pricing: {...settings.pricing, premiumVerification: parseInt(val)}})} 
                        />
                        <p className="mt-2 text-[10px] text-amber-600 italic">* Áp dụng cho xác minh tận nơi bởi đội ngũ MapHome.</p>
                    </div>
                </div>
                </div>
            )}

            {activeTab === "broadcast" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                <SectionHeader 
                    title="Truyền thông Toàn hệ thống" 
                    description="Gửi thông báo quan trọng đến tất cả người dùng MapHome."
                />
                <div className="space-y-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-400 uppercase mb-2">Nội dung thông báo</label>
                        <textarea 
                            value={settings.broadcastMessage}
                            onChange={(e) => setSettings({...settings, broadcastMessage: e.target.value})}
                            className="w-full min-h-[120px] p-4 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:border-[#16a34a] focus:outline-none transition-all resize-none shadow-inner"
                            placeholder="Nhập nội dung thông báo tại đây..."
                        />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-green-50/30 rounded-xl border border-green-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-lg text-[#16a34a] border border-green-100">
                                <Info className="size-4" />
                            </div>
                            <span className="text-sm font-medium text-green-800 font-bold">Kích hoạt thông báo trên trang chủ</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                className="sr-only peer"
                                checked={settings.isBroadcastEnabled}
                                onChange={(e) => setSettings({...settings, isBroadcastEnabled: e.target.checked})}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#16a34a]"></div>
                        </label>
                    </div>
                </div>
                </div>
            )}

            {activeTab === "subscription_plans" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between">
                        <SectionHeader 
                            title="Quản lý Các Gói Đăng ký" 
                            description="Tùy chỉnh các gói dịch vụ dành cho Chủ trọ."
                        />
                        {!editingPlan && (
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline"
                                    onClick={handleResetPlans}
                                    disabled={saving}
                                    className="border-amber-200 text-amber-700 hover:bg-amber-50"
                                >
                                    <RotateCcw className="size-4 mr-2" /> Đặt lại gói mẫu
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setIsCreating(true);
                                        setEditingPlan({
                                            planId: "",
                                            name: "",
                                            price: 0,
                                            yearlyPrice: 0,
                                            description: "",
                                            features: [{ text: "", included: true }],
                                            badge: "",
                                            badgeColor: "bg-gray-100 text-gray-700",
                                            icon: "Star",
                                            cta: "Chọn gói",
                                            ctaVariant: "default"
                                        });
                                    }}
                                    className="bg-[#16a34a] text-white hover:bg-[#15803d]"
                                >
                                    <Plus className="size-4 mr-2" /> Thêm gói mới
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {editingPlan ? (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                    <Edit2 className="size-4 text-[#16a34a]" /> 
                                    {isCreating ? "Tạo gói dịch vụ mới" : `Đang chỉnh sửa: ${editingPlan.name}`}
                                </h4>
                                <Button variant="ghost" size="sm" onClick={() => { setEditingPlan(null); setIsCreating(false); }}>Hủy</Button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <InputGroup label="ID Gói (duy nhất)" value={editingPlan.planId} onChange={(val) => setEditingPlan({...editingPlan, planId: val})} />
                                    <InputGroup label="Tên Gói hiển thị" value={editingPlan.name} onChange={(val) => setEditingPlan({...editingPlan, name: val})} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Giá Tháng" type="number" value={editingPlan.price} onChange={(val) => setEditingPlan({...editingPlan, price: parseInt(val)})} />
                                        <InputGroup label="Giá Năm" type="number" value={editingPlan.yearlyPrice} onChange={(val) => setEditingPlan({...editingPlan, yearlyPrice: parseInt(val)})} />
                                    </div>
                                    <InputGroup label="Mô tả ngắn" value={editingPlan.description} onChange={(val) => setEditingPlan({...editingPlan, description: val})} />
                                    <div className="grid grid-cols-2 gap-4">
                                        <InputGroup label="Badge (Nhãn)" value={editingPlan.badge || ""} onChange={(val) => setEditingPlan({...editingPlan, badge: val})} />
                                        <InputGroup label="Màu Nhãn (CSS)" value={editingPlan.badgeColor || ""} onChange={(val) => setEditingPlan({...editingPlan, badgeColor: val})} />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="text-[11px] font-bold text-gray-400 uppercase">Danh sách Lợi ích</label>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="h-7 text-[10px] px-2"
                                            onClick={() => setEditingPlan({
                                                ...editingPlan, 
                                                features: [...editingPlan.features, { text: "", included: true }]
                                            })}
                                        >
                                            <Plus className="size-3 mr-1" /> Thêm
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin">
                                        {editingPlan.features.map((feature: any, idx: number) => (
                                            <div key={idx} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-100">
                                                <input 
                                                    type="checkbox" 
                                                    className="rounded text-[#16a34a]"
                                                    checked={feature.included} 
                                                    onChange={(e) => {
                                                        const newFeatures = [...editingPlan.features];
                                                        newFeatures[idx].included = e.target.checked;
                                                        setEditingPlan({...editingPlan, features: newFeatures});
                                                    }}
                                                />
                                                <input 
                                                    type="text" 
                                                    className="flex-1 text-xs border-none focus:ring-0 p-0"
                                                    placeholder="Lợi ích..."
                                                    value={feature.text}
                                                    onChange={(e) => {
                                                        const newFeatures = [...editingPlan.features];
                                                        newFeatures[idx].text = e.target.value;
                                                        setEditingPlan({...editingPlan, features: newFeatures});
                                                    }}
                                                />
                                                <button 
                                                    type="button"
                                                    className="text-gray-300 hover:text-red-500"
                                                    onClick={() => {
                                                        const newFeatures = editingPlan.features.filter((_: any, i: number) => i !== idx);
                                                        setEditingPlan({...editingPlan, features: newFeatures});
                                                    }}
                                                >
                                                    <Trash2 className="size-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <Button variant="outline" onClick={() => { setEditingPlan(null); setIsCreating(false); }}>Bỏ qua</Button>
                                <Button 
                                    onClick={isCreating ? handleCreatePlan : handleUpdatePlan} 
                                    disabled={saving} 
                                    className="bg-[#16a34a] text-white hover:bg-[#15803d] shadow-lg shadow-green-100"
                                >
                                    <Save className="size-4 mr-2" /> {isCreating ? "Tạo gói ngay" : "Lưu phiên bản mới"}
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {plans.filter(p => p.isActive).map((plan) => (
                                <div key={plan._id} className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-[#16a34a]/30 hover:shadow-md transition-all group">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 bg-green-50 rounded-2xl flex flex-col items-center justify-center text-[#16a34a]">
                                            <span className="text-sm font-bold leading-none">{plan.price >= 1000 ? (plan.price / 1000) + 'k' : plan.price}</span>
                                            <span className="text-[10px] scale-90">VNĐ</span>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h5 className="font-bold text-gray-900">{plan.name}</h5>
                                                {plan.badge && (
                                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${plan.badgeColor || 'bg-gray-100 text-gray-600'}`}>
                                                        {plan.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500">{plan.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="outline" size="sm" onClick={() => setEditingPlan(plan)} className="h-9 px-4 rounded-xl border-gray-100 text-gray-600 hover:bg-gray-50">
                                            <Edit2 className="size-3.5 mr-1.5" /> Sửa
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan._id, plan.name)} className="h-9 px-4 rounded-xl text-red-500 hover:bg-red-50">
                                            <Trash2 className="size-3.5 mr-1.5" /> Ngừng kích hoạt
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {activeTab === "account" && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div>
                        <SectionHeader 
                            title="Thông tin cá nhân" 
                            description="Cập nhật ảnh đại diện và thông tin cơ bản của quản trị viên."
                        />
                        
                        {/* Avatar Upload Section for Admin */}
                        <div className="flex flex-col items-center gap-4 py-6 border-b border-gray-50 mb-8">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#16a34a] to-[#0ea5e9] flex items-center justify-center text-white text-3xl font-bold">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        (user?.fullName || user?.username || "A").charAt(0).toUpperCase()
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-[#16a34a] text-white rounded-full shadow-lg cursor-pointer hover:bg-[#15803d] transition-all transform hover:scale-110">
                                    <Camera className="size-4" />
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            
                                            const formData = new FormData();
                                            formData.append("image", file);
                                            const token = localStorage.getItem("token");
                                            
                                            try {
                                                // 1. Upload new image
                                                const uploadRes = await fetch(`${API_BASE}/api/upload/single`, {
                                                    method: "POST",
                                                    headers: { Authorization: `Bearer ${token}` },
                                                    body: formData
                                                });
                                                
                                                if (uploadRes.ok) {
                                                    const { url } = await uploadRes.json();
                                                    // 2. Update admin profile with new avatar URL
                                                    const updateRes = await fetch(`${API_BASE}/api/user/${user?.id}`, {
                                                        method: "PUT",
                                                        headers: { 
                                                            "Content-Type": "application/json", 
                                                            Authorization: `Bearer ${token}` 
                                                        },
                                                        body: JSON.stringify({ avatar: url })
                                                    });
                                                    
                                                    if (updateRes.ok) {
                                                        const updatedUser = await updateRes.json();
                                                        updateUser(updatedUser);
                                                        toast.success("Cập nhật ảnh đại diện thành công! ✨");
                                                        // Use a slight delay before reload to let user see toast if needed, 
                                                        // or just rely on state update
                                                        setTimeout(() => window.location.reload(), 1000);
                                                    }
                                                }
                                            } catch (err) {
                                                console.error("Admin avatar update error:", err);
                                                toast.error("Lỗi khi tải ảnh lên. ❌");
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Admin Profile Picture</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup 
                                label="Họ và tên" 
                                value={user?.fullName || ""} 
                                onChange={async (val) => {
                                    /* This is just for UI, actual update is via the Save button at top or a local form */
                                }} 
                                icon={<User className="size-4" />}
                            />
                            <InputGroup 
                                label="Số điện thoại" 
                                value={user?.phone || ""} 
                                onChange={(val) => {}} 
                                icon={<Phone className="size-4" />}
                            />
                        </div>
                    </div>

                    <div className="pt-8 border-t border-gray-50">
                        <SectionHeader 
                            title="Bảo mật tài khoản" 
                            description="Đổi mật khẩu định kỳ để bảo vệ quyền quản trị tối cao."
                        />
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-white p-3 rounded-xl text-amber-600 shadow-sm">
                                    <Key className="size-6" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900">Mật khẩu đăng nhập</h5>
                                    <p className="text-xs text-gray-500">Lần cuối thay đổi: Chưa rõ</p>
                                </div>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    const currentPassword = window.prompt("Nhập mật khẩu hiện tại:");
                                    if (!currentPassword) return;
                                    const newPassword = window.prompt("Nhập mật khẩu mới (tối thiểu 6 ký tự):");
                                    if (!newPassword || newPassword.length < 6) return;
                                    
                                    const token = localStorage.getItem("token");
                                    fetch(`${API_BASE}/api/auth/change-password`, {
                                        method: "PUT",
                                        headers: { 
                                            "Content-Type": "application/json", 
                                            Authorization: `Bearer ${token}` 
                                        },
                                        body: JSON.stringify({ currentPassword, newPassword })
                                    })
                                    .then(async res => {
                                        if (res.ok) {
                                            toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
                                            setTimeout(() => {
                                              logout();
                                              navigate("/login");
                                            }, 2000);
                                        } else {
                                            const d = await res.json();
                                            toast.error(d.message || "Lỗi đổi mật khẩu ❌");
                                        }
                                    })
                                    .catch(console.error);
                                }}
                            >
                                Thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

function TabNav({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
        active 
          ? "bg-[#16a34a] text-white shadow-lg shadow-green-100" 
          : "text-gray-500 hover:bg-gray-100"
      }`}
    >
      <span className="[&>svg]:size-4">{icon}</span>
      {label}
    </button>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}

function InputGroup({ label, value, onChange, icon, type = "text" }: { label: string; value: any; onChange: (val: string) => void; icon?: React.ReactNode, type?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-bold text-gray-400 uppercase">{label}</label>
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">{icon}</div>}
        <input 
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-10 ${icon ? 'pl-9' : 'px-4'} pr-4 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold text-gray-700 focus:border-[#16a34a] focus:bg-white focus:outline-none transition-all shadow-inner`}
        />
      </div>
    </div>
  );
}
