import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { Footer } from "@/app/components/Footer";
import { Navbar } from "@/app/components/Navbar";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (e) => {
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
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <MessageSquare className="size-16 mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Liên Hệ Với Chúng Tôi
          </h2>
          <p className="text-xl text-green-100">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Mail className="size-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a
                      href="mailto:support@timnhatro.vn"
                      className="text-blue-600 hover:underline"
                    >
                      support@timnhatro.vn
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Phone className="size-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Hotline</p>
                    <a
                      href="tel:1900xxxx"
                      className="text-blue-600 hover:underline"
                    >
                      1900 xxxx
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="size-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Địa chỉ</p>
                    <p className="text-gray-600">Khu phố 6, Thủ Đức, TP.HCM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
              <h3 className="font-bold text-gray-900 mb-3">
                Câu Hỏi Thường Gặp
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p>
                  <strong>Q:</strong> Làm sao để xác thực tài khoản?
                </p>
                <p className="ml-4 text-gray-600">
                  A: Bạn có thể xác thực qua SMS OTP hoặc GPS khi đăng tin.
                </p>

                <p className="mt-3">
                  <strong>Q:</strong> Có mất phí khi đăng tin không?
                </p>
                <p className="ml-4 text-gray-600">
                  A: Hiện tại dịch vụ hoàn toàn miễn phí.
                </p>

                <p className="mt-3">
                  <strong>Q:</strong> Làm sao để báo cáo tin lừa đảo?
                </p>
                <p className="ml-4 text-gray-600">
                  A: Vui lòng liên hệ email support@timnhatro.vn hoặc gọi
                  hotline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
