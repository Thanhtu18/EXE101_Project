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
  ShieldCheck,
  ChevronRight,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/app/components/ui/button";
import { ConfirmDialog } from "@/app/components/ConfirmDialog";
import { useAuth } from "@/app/contexts/AuthContext";
import api from "@/app/utils/api";
import { getAvatarUrl, getInitials } from "@/app/utils/avatarUtils";
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
  const [activeTab, setActiveTab] = useState<
    "general" | "pricing" | "broadcast" | "subscription_plans" | "account"
  >("general");
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/admin/settings");
      if (res.status === 200) {
        setSettings(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await api.get("/api/subscriptions/plans");
      if (res.status === 200) {
        setPlans(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchPlans();
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await api.put("/api/admin/settings", settings);
      if (res.status === 200) {
        toast.success("Cài đặt hệ thống đã được cập nhật! ✨");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlan = async () => {
    try {
      if (!editingPlan.name || editingPlan.price === undefined) {
        toast.error("Vui lòng điền đủ tên và giá gói!");
        return;
      }
      setSaving(true);
      if (isCreating) {
        const res = await api.post(
          "/api/admin/subscriptions/plans",
          editingPlan,
        );
        if (res.status === 201) toast.success("Thêm gói mới thành công! ✨");
      } else {
        const res = await api.put(
          `/api/admin/subscriptions/plans/${editingPlan._id || editingPlan.planId}`,
          editingPlan,
        );
        if (res.status === 200) toast.success("Cập nhật gói thành công! ✨");
      }
      setEditingPlan(null);
      setIsCreating(false);
      fetchPlans();
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirm({
      open: true,
      title: "Xác nhận xóa gói dịch vụ",
      description:
        "Bạn có chắc muốn xóa vĩnh viễn gói dịch vụ này? Thao tác không thể hoàn tác.",
      onConfirm: async () => {
        try {
          const res = await api.delete(`/api/admin/subscriptions/plans/${id}`);
          if (res.status === 200) {
            toast.success("Đã xóa gói dịch vụ! 🗑️");
            fetchPlans();
          }
        } catch (error) {
          console.error(error);
          toast.error("Không thể xóa lúc này.");
        }
      },
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUpdatingAvatar(true);
      const formData = new FormData();
      formData.append("image", file);

      // 1. Upload to Cloudinary
      const uploadRes = await api.post("/api/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (uploadRes.status === 201) {
        const imageUrl = uploadRes.data.url;

        // 2. Update user profile
        // Note: Backend might use _id, but our User interface uses id
        const userId = user?.id || (user as any)?._id;
        const updateRes = await api.put(`/api/user/${userId}`, {
          avatar: imageUrl,
        });

        if (updateRes.status === 200) {
          updateUser(updateRes.data);
          toast.success("Cập nhật ảnh đại diện thành công! ✨");
        }
      }
    } catch (error: any) {
      console.error("Avatar update failed:", error);
      toast.error(
        error.response?.data?.message || "Không thể cập nhật ảnh đại diện.",
      );
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    title?: string;
    description?: string;
    onConfirm?: () => Promise<void> | void;
  }>({ open: false });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
          Đang tải cấu hình...
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-inner">
              <Settings className="size-5" />
            </div>
            Cấu hình Hệ thống
          </h2>
          <p className="text-xs text-indigo-500/70 mt-1 font-medium">
            Điều chỉnh các tham số vận hành cốt lõi của nền tảng
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => fetchSettings()}
            className="rounded-2xl h-11 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest px-6"
          >
            <RotateCcw className="size-4 mr-2" /> Hoàn tác
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={saving}
            className="rounded-2xl h-11 bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-8 shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all border-none"
          >
            <Save className="size-4 mr-2" />{" "}
            {saving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white rounded-[32px] border border-slate-100 p-3 shadow-sm space-y-2 sticky top-24">
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
          <div className="pt-2 mt-2 border-t border-slate-50">
            <TabNav
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              icon={<User />}
              label="Tài khoản"
            />
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="p-10 space-y-10"
            >
              {activeTab === "general" && (
                <div className="space-y-8">
                  <SectionHeader
                    title="Thông tin nền tảng"
                    description="Cập nhật các thông tin hiển thị cơ bản của website."
                  />
                  <div className="grid grid-cols-2 gap-8">
                    <InputGroup
                      label="Tên Website"
                      value={settings.siteName}
                      onChange={(val) =>
                        setSettings({ ...settings, siteName: val })
                      }
                      icon={<Globe className="size-4" />}
                    />
                    <InputGroup
                      label="Email Hỗ trợ"
                      value={settings.contactEmail}
                      onChange={(val) =>
                        setSettings({ ...settings, contactEmail: val })
                      }
                      icon={<Mail className="size-4" />}
                    />
                    <InputGroup
                      label="Hotline"
                      value={settings.contactPhone}
                      onChange={(val) =>
                        setSettings({ ...settings, contactPhone: val })
                      }
                      icon={<Phone className="size-4" />}
                    />
                  </div>

                  <div className="pt-8 border-t border-slate-100">
                    <div className="flex items-center justify-between p-6 bg-rose-50/30 rounded-[32px] border border-rose-100/50 group">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl text-rose-600 shadow-inner border border-rose-50 group-hover:rotate-12 transition-transform">
                          <ShieldAlert className="size-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-rose-900 uppercase tracking-widest">
                            Chế độ Bảo trì
                          </h4>
                          <p className="text-xs text-rose-600 font-medium">
                            Tạm khóa toàn bộ truy cập từ phía người dùng.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.maintenanceMode}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              maintenanceMode: e.target.checked,
                            })
                          }
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-7 after:transition-all peer-checked:bg-rose-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "pricing" && (
                <div className="space-y-8">
                  <SectionHeader
                    title="Cấu hình Giá Dịch vụ"
                    description="Thiết lập chi phí cho các gói xác thực Tích Xanh."
                  />
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-8 bg-blue-50/30 rounded-[32px] border border-blue-50 space-y-6">
                      <div className="flex items-center gap-3 text-blue-700">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-blue-100">
                          <Zap className="size-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Xác thực Cơ bản
                        </span>
                      </div>
                      <InputGroup
                        label="Chi phí (VNĐ)"
                        type="number"
                        value={settings.pricing.basicVerification}
                        onChange={(val) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              basicVerification: parseInt(val),
                            },
                          })
                        }
                      />
                      <p className="text-[10px] text-blue-400 font-bold uppercase italic tracking-tighter">
                        Áp dụng xác minh qua SĐT/Zalo
                      </p>
                    </div>

                    <div className="p-8 bg-amber-50/30 rounded-[32px] border border-amber-50 space-y-6">
                      <div className="flex items-center gap-3 text-amber-700">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-amber-100">
                          <ShieldCheck className="size-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Xác thực Thực địa
                        </span>
                      </div>
                      <InputGroup
                        label="Chi phí (VNĐ)"
                        type="number"
                        value={settings.pricing.premiumVerification}
                        onChange={(val) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              premiumVerification: parseInt(val),
                            },
                          })
                        }
                      />
                      <p className="text-[10px] text-amber-400 font-bold uppercase italic tracking-tighter">
                        Xác minh tận nơi bởi MapHome
                      </p>
                    </div>

                    <div className="p-8 bg-emerald-50/30 rounded-[32px] border border-emerald-50 space-y-6">
                      <div className="flex items-center gap-3 text-emerald-700">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-emerald-100">
                          <Plus className="size-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Phí Đăng Bài
                        </span>
                      </div>
                      <InputGroup
                        label="Chi phí (VNĐ)"
                        type="number"
                        value={settings.pricing.postRoomFee || 0}
                        onChange={(val) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              postRoomFee: parseInt(val),
                            },
                          })
                        }
                      />
                      <p className="text-[10px] text-emerald-400 font-bold uppercase italic tracking-tighter">
                        Áp dụng khi đăng tin nhà trọ mới
                      </p>
                    </div>

                    <div className="p-8 bg-violet-50/30 rounded-[32px] border border-violet-50 space-y-6">
                      <div className="flex items-center gap-3 text-violet-700">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-violet-100">
                          <TrendingUp className="size-5" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Phí Đẩy Bài (Push)
                        </span>
                      </div>
                      <InputGroup
                        label="Chi phí (VNĐ)"
                        type="number"
                        value={settings.pricing.pushRoomFee || 0}
                        onChange={(val) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              pushRoomFee: parseInt(val),
                            },
                          })
                        }
                      />
                      <p className="text-[10px] text-violet-400 font-bold uppercase italic tracking-tighter">
                        Dịch vụ đưa tin đăng lên đầu trang
                      </p>
                    </div>

                    <div className="p-8 bg-rose-50/30 rounded-[32px] border border-rose-50 space-y-6">
                      <div className="flex items-center gap-3 text-rose-700">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-rose-100">
                          <Zap className="size-5 text-rose-600" />
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Tin Đăng Gấp
                        </span>
                      </div>
                      <InputGroup
                        label="Chi phí (VNĐ)"
                        type="number"
                        value={settings.pricing.urgentRoomFee || 0}
                        onChange={(val) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              urgentRoomFee: parseInt(val),
                            },
                          })
                        }
                      />
                      <p className="text-[10px] text-rose-400 font-bold uppercase italic tracking-tighter">
                        Phí gắn nhãn ưu tiên "Gấp"
                      </p>
                      <div className="p-8 bg-indigo-50/30 rounded-[32px] border border-indigo-50 space-y-6">
                      <div className="flex items-center gap-3 text-indigo-700">
                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-inner border border-indigo-100 font-black text-xs">
                          %
                        </div>
                        <span className="text-xs font-black uppercase tracking-widest">
                          Tỷ lệ Hoa hồng
                        </span>
                      </div>
                      <InputGroup
                        label="Tỷ lệ (%)"
                        type="number"
                        value={settings.pricing.commissionRate || 0}
                        onChange={(val) =>
                          setSettings({
                            ...settings,
                            pricing: {
                              ...settings.pricing,
                              commissionRate: parseInt(val),
                            },
                          })
                        }
                      />
                      <p className="text-[10px] text-indigo-400 font-bold uppercase italic tracking-tighter">
                        Phần trăm mỗi giao dịch thành công
                      </p>
                    </div>
                  </div>
                  </div>
                </div>
              )}

              {activeTab === "broadcast" && (
                <div className="space-y-8">
                  <SectionHeader
                    title="Truyền thông Hệ thống"
                    description="Gửi thông báo quan trọng đến toàn bộ người dùng."
                  />
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-black text-indigo-500/60 uppercase tracking-widest">
                        Nội dung thông báo (Markdown)
                      </label>
                      <textarea
                        value={settings.broadcastMessage}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            broadcastMessage: e.target.value,
                          })
                        }
                        className="w-full min-h-[180px] p-6 bg-slate-50 border border-slate-100 rounded-[32px] text-sm font-bold text-slate-700 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner resize-none"
                        placeholder="Nhập nội dung thông báo..."
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-emerald-50/30 rounded-[32px] border border-emerald-100/50">
                      <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl text-emerald-600 shadow-inner border border-emerald-50">
                          <Bell className="size-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-emerald-900 uppercase tracking-widest">
                            Hiển thị trên Trang chủ
                          </h4>
                          <p className="text-xs text-emerald-600 font-medium">
                            Bật/tắt thanh thông báo ở đầu trang.
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer scale-110">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={settings.isBroadcastEnabled}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              isBroadcastEnabled: e.target.checked,
                            })
                          }
                        />
                        <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-7 after:transition-all peer-checked:bg-emerald-600 shadow-inner"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "subscription_plans" && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <SectionHeader
                      title="Gói Đăng ký Dịch vụ"
                      description="Quản lý đặc quyền và mức phí dành cho Chủ trọ."
                    />
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
                          badgeColor: "bg-gray-100",
                          icon: "Star",
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl h-10 px-6 text-xs font-black uppercase tracking-widest flex items-center gap-2 border-none transition-all shadow-lg shadow-emerald-100"
                    >
                      <Plus className="size-4" /> Thêm gói mới
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {plans
                      .filter((p) => p.isActive)
                      .map((plan) => (
                        <motion.div
                          key={plan._id}
                          whileHover={{ y: -4, scale: 1.01 }}
                          className="flex items-center justify-between p-6 bg-white rounded-[32px] border border-slate-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
                        >
                          <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-[22px] flex flex-col items-center justify-center text-emerald-600 border border-slate-100 shadow-inner group-hover:bg-emerald-500 group-hover:text-white transition-all">
                              <span className="text-sm font-black leading-none">
                                {plan.price >= 1000
                                  ? plan.price / 1000 + "k"
                                  : plan.price}
                              </span>
                              <span className="text-[10px] uppercase font-black tracking-tighter mt-0.5 opacity-60">
                                VNĐ
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-black bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent tracking-tight">
                                  {plan.name}
                                </h5>
                                {plan.badge && (
                                  <span
                                    className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest ${plan.badgeColor || "bg-slate-100 text-slate-500"}`}
                                  >
                                    {plan.badge}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400 font-bold max-w-sm truncate">
                                {plan.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPlan(plan)}
                              className="h-10 rounded-xl border-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest px-4 hover:bg-slate-50"
                            >
                              Sửa
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) =>
                                handleDeletePlan(plan._id || plan.planId, e)
                              }
                              className="h-10 rounded-xl text-slate-300 font-black text-[10px] uppercase tracking-widest px-4 hover:text-rose-500 hover:bg-rose-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                  </div>

                  <AnimatePresence>
                    {editingPlan && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                          onClick={() => setEditingPlan(null)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 20 }}
                          className="relative bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar p-10 border border-slate-100"
                        >
                          <h3 className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-8">
                            {isCreating
                              ? "Thêm Gói Đặc Quyền Mới"
                              : "Chỉnh sửa Gói"}
                          </h3>

                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <InputGroup
                                label="Tên Gói (VD: Pro, V.I.P)"
                                value={editingPlan.name}
                                onChange={(val) =>
                                  setEditingPlan({ ...editingPlan, name: val })
                                }
                              />
                              <InputGroup
                                label="Mô tả ngắn gọn"
                                value={editingPlan.description}
                                onChange={(val) =>
                                  setEditingPlan({
                                    ...editingPlan,
                                    description: val,
                                  })
                                }
                              />
                              <InputGroup
                                label="Icon (Lucide name)"
                                value={editingPlan.icon || "Star"}
                                onChange={(val) =>
                                  setEditingPlan({ ...editingPlan, icon: val })
                                }
                              />
                              <InputGroup
                                label="Huy hiệu (Badge Text)"
                                value={editingPlan.badge || ""}
                                onChange={(val) =>
                                  setEditingPlan({ ...editingPlan, badge: val })
                                }
                              />
                              <InputGroup
                                label="Giá Mỗi Tháng (VNĐ)"
                                type="number"
                                value={editingPlan.price}
                                onChange={(val) =>
                                  setEditingPlan({
                                    ...editingPlan,
                                    price: Number(val),
                                  })
                                }
                              />
                              <InputGroup
                                label="Giá Mỗi Năm (VNĐ)"
                                type="number"
                                value={editingPlan.yearlyPrice}
                                onChange={(val) =>
                                  setEditingPlan({
                                    ...editingPlan,
                                    yearlyPrice: Number(val),
                                  })
                                }
                              />
                            </div>

                            <div className="pt-6 border-t border-slate-100 space-y-4">
                              <div className="flex items-center justify-between">
                                <label className="text-[11px] font-black text-indigo-500/60 uppercase tracking-widest">
                                  Danh sách Quyền lợi
                                </label>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setEditingPlan({
                                      ...editingPlan,
                                      features: [
                                        ...(editingPlan.features || []),
                                        { text: "", included: true },
                                      ],
                                    })
                                  }
                                  className="h-8 rounded-lg text-xs font-black"
                                >
                                  <Plus className="size-3 mr-1" /> Thêm quyền
                                  lợi
                                </Button>
                              </div>
                              {(editingPlan.features || []).map(
                                (feature: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex items-center gap-3"
                                  >
                                    <button
                                      onClick={() => {
                                        const newFeatures = [
                                          ...editingPlan.features,
                                        ];
                                        newFeatures[idx].included =
                                          !newFeatures[idx].included;
                                        setEditingPlan({
                                          ...editingPlan,
                                          features: newFeatures,
                                        });
                                      }}
                                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${feature.included ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}
                                    >
                                      <CheckCircle className="size-4" />
                                    </button>
                                    <input
                                      value={feature.text}
                                      onChange={(e) => {
                                        const newFeatures = [
                                          ...editingPlan.features,
                                        ];
                                        newFeatures[idx].text = e.target.value;
                                        setEditingPlan({
                                          ...editingPlan,
                                          features: newFeatures,
                                        });
                                      }}
                                      className="flex-1 h-10 px-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none focus:border-emerald-500"
                                      placeholder="VD: Đăng ký tối đa 5 phòng"
                                    />
                                    <button
                                      onClick={() => {
                                        const newFeatures =
                                          editingPlan.features.filter(
                                            (_: any, i: number) => i !== idx,
                                          );
                                        setEditingPlan({
                                          ...editingPlan,
                                          features: newFeatures,
                                        });
                                      }}
                                      className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-300 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                    >
                                      <Trash2 className="size-4" />
                                    </button>
                                  </div>
                                ),
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-3 mt-10">
                            <Button
                              variant="outline"
                              onClick={() => setEditingPlan(null)}
                              className="h-12 rounded-2xl px-6 font-black text-xs uppercase tracking-widest text-slate-500"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleSavePlan}
                              disabled={saving}
                              className="h-12 rounded-2xl px-8 font-black text-xs uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-100"
                            >
                              {saving ? "Đang lưu..." : "Lưu Gói Dịch Vụ"}
                            </Button>
                          </div>
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {activeTab === "account" && (
                <div className="space-y-10">
                  <SectionHeader
                    title="Quản trị viên"
                    description="Thông tin cá nhân và bảo mật tài khoản."
                  />
                  <div className="flex flex-col items-center gap-6 pb-10 border-b border-slate-50">
                    <div className="relative group">
                      <div className="w-32 h-32 rounded-[40px] border-[6px] border-white shadow-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-black group-hover:scale-105 transition-transform duration-500 relative">
                        {user?.avatar ? (
                          <img
                            src={getAvatarUrl(user.avatar) || ""}
                            className={`w-full h-full object-cover ${updatingAvatar ? "opacity-40" : ""}`}
                          />
                        ) : (
                          getInitials(user?.fullName, user?.username)
                        )}
                        {updatingAvatar && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </div>
                      <label 
                        className={`absolute -bottom-2 -right-2 p-3 bg-white text-emerald-600 rounded-2xl shadow-xl transition-all transform hover:rotate-12 border border-slate-100 ${updatingAvatar ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-emerald-600 hover:text-white"}`}
                      >
                        <Camera className="size-5" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          disabled={updatingAvatar}
                        />
                      </label>
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                        {user?.fullName}
                      </h4>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mt-1">
                        Super Administrator
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <InputGroup
                      label="Email đăng nhập"
                      value={user?.email || ""}
                      onChange={() => {}}
                      icon={<Mail className="size-4" />}
                    />
                    <InputGroup
                      label="Số điện thoại"
                      value={user?.phone || ""}
                      onChange={() => {}}
                      icon={<Phone className="size-4" />}
                    />
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="bg-white p-4 rounded-2xl text-indigo-500 shadow-inner group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-500">
                        <Key className="size-6" />
                      </div>
                      <div>
                        <h5 className="text-sm font-black bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-widest">
                          Bảo mật mật khẩu
                        </h5>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">
                          Yêu cầu xác nhận mật khẩu hiện tại
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-xl h-10 border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest px-6 hover:bg-white shadow-sm transition-all hover:scale-105"
                    >
                      Thay đổi ngay <ChevronRight className="size-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <ConfirmDialog
            open={deleteConfirm.open}
            title={deleteConfirm.title}
            description={deleteConfirm.description}
            confirmText="Xoá"
            cancelText="Huỷ"
            onConfirm={async () => {
              await deleteConfirm.onConfirm?.();
              setDeleteConfirm({ open: false });
            }}
            onCancel={() => setDeleteConfirm({ open: false })}
          />
        </div>
      </div>
    </motion.div>
  );
}

function TabNav({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[13px] font-black tracking-tight transition-all active:scale-95 ${
        active
          ? "text-white"
          : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
      }`}
    >
      {active && (
        <motion.div
          layoutId="activeTabPill"
          className="absolute inset-0 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100"
          transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
        />
      )}
      <span className="relative z-10 [&>svg]:size-5">{icon}</span>
      <span className="relative z-10">{label}</span>
      {active && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full relative z-10"
        />
      )}
    </button>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h3 className="text-base font-black bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent uppercase tracking-widest leading-none mb-1">
        {title}
      </h3>
      <p className="text-xs font-bold text-indigo-500/50 italic mt-1.5">
        {description}
      </p>
    </div>
  );
}

function InputGroup({
  label,
  value,
  onChange,
  icon,
  type = "text",
}: {
  label: string;
  value: any;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black text-indigo-500/60 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full h-12 ${icon ? "pl-11" : "px-5"} pr-5 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-black text-emerald-700 focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-inner`}
        />
      </div>
    </div>
  );
}
