import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export function ContactPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = (import.meta as any).env?.VITE_API_BASE || "http://localhost:5000";


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        
        // Modal stays for 5 seconds then resets
        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        const data = await res.json();
        setError(data.message || "Có lỗi xảy ra khi gửi tin nhắn.");
      }
    } catch (err) {
      console.error("Contact submission error:", err);
      setError("Không thể kết nối tới máy chủ.");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16"
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          >
            <MessageSquare className="size-16 mx-auto mb-4" />
          </motion.div>
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Liên Hệ Với Chúng Tôi
          </motion.h2>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-green-100"
          >
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </motion.p>
        </div>
      </motion.div>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Contact Info */}
          <motion.div variants={fadeInUp} className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-white p-6 transition-all hover:shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "support@timnhatro.vn", color: "bg-green-50 text-green-600", href: "mailto:support@timnhatro.vn" },
                  { icon: Phone, label: "Điện thoại", value: "024 3654 321", color: "bg-blue-50 text-blue-600", href: "tel:0243654321" },
                  { icon: MapPin, label: "Địa chỉ", value: "Số 1, Đại Cồ Việt\nHai Bà Trưng, Hà Nội", color: "bg-purple-50 text-purple-600" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <item.icon className="size-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-semibold text-gray-900 hover:text-green-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-semibold text-gray-900 whitespace-pre-line">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-blue-700 rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Clock className="size-5" />
                Giờ Làm Việc
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                  <span className="opacity-80">Thứ 2 - Thứ 6</span>
                  <span className="font-semibold">8:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                  <span className="opacity-80">Thứ 7</span>
                  <span className="font-semibold">9:00 - 17:00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-80">Chủ nhật</span>
                  <span className="font-medium px-2 py-0.5 bg-white/20 rounded">Nghỉ</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-white p-8">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div 
                    key="success"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="size-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Gửi thành công!
                    </h3>
                    <p className="text-gray-600">
                      Chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-8"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Gửi thêm tin nhắn khác
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="form">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Gửi Tin Nhắn
                    </h3>
                    {error && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        className="mb-6 overflow-hidden"
                      >
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 border border-red-100 italic text-sm">
                          <AlertCircle className="size-5" />
                          {error}
                        </div>
                      </motion.div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 ml-1">
                            Họ tên *
                          </label>
                          <Input
                            type="text"
                            name="name"
                            className="h-12 rounded-xl focus:ring-green-500/20"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nguyễn Văn A"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 ml-1">
                            Email *
                          </label>
                          <Input
                            type="email"
                            name="email"
                            className="h-12 rounded-xl focus:ring-green-500/20"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 ml-1">
                            Số điện thoại
                          </label>
                          <Input
                            type="tel"
                            name="phone"
                            className="h-12 rounded-xl focus:ring-green-500/20"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0912 345 678"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-gray-700 ml-1">
                            Chủ đề *
                          </label>
                          <Input
                            type="text"
                            name="subject"
                            className="h-12 rounded-xl focus:ring-green-500/20"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Vấn đề cần hỗ trợ"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 ml-1">
                          Nội dung *
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none text-sm"
                          placeholder="Mô tả chi tiết vấn đề của bạn..."
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 h-14 rounded-xl shadow-lg shadow-green-600/20 text-lg font-bold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <div className="size-6 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        ) : (
                          <Send className="size-5 mr-3" />
                        )}
                        {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn ngay"}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FAQ Section */}
            <motion.div 
              variants={fadeInUp}
              className="mt-12 bg-white rounded-2xl p-8 border border-white shadow-xl bg-gradient-to-br from-blue-50/50 to-white"
            >
              <h3 className="font-bold text-gray-900 text-xl mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                Câu Hỏi Thường Gặp
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { q: "Làm sao để xác thực tài khoản?", a: "Bạn có thể xác thực qua SMS OTP hoặc GPS trực tiếp khi đăng tin trọ." },
                  { q: "Có mất phí khi đăng tin không?", a: "Hiện tại dịch vụ hoàn toàn miễn phí cho tất cả chủ trọ." },
                  { q: "Làm sao để báo cáo lừa đảo?", a: "Vui lòng liên hệ support@timnhatro.vn hoặc dùng tính năng báo cáo trực tiếp trong tin đăng." },
                  { q: "Hỗ trợ 24/7 không?", a: "Đội ngũ chuyên viên sẽ phản hồi bạn trong giờ làm việc (8h-18h hàng ngày)." },
                ].map((faq, i) => (
                  <div key={i} className="space-y-2 p-4 rounded-xl hover:bg-white transition-colors">
                    <p className="font-bold text-gray-900">
                      <span className="text-blue-600 mr-2">Q:</span>
                      {faq.q}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
