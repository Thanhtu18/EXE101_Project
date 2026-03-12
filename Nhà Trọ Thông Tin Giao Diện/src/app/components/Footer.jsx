import { Link } from "react-router";
import {
  Home,
  Mail,
  FileText,
  MessageCircle,
  Facebook,
  Twitter,
  Instagram,
  Shield,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Home className="size-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">NhàTrọ.vn</span>
            </div>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Nền tảng tìm kiếm nhà trọ thông minh, kết nối người thuê với chủ
              trọ uy tín trên toàn quốc.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
              >
                <Instagram className="size-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Dịch vụ</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Home className="size-3" /> Tìm nhà trọ
                </Link>
              </li>
              <li>
                <Link
                  to="/post-room"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="size-3" /> Đăng tin
                </Link>
              </li>
              <li>
                <Link
                  to="/blog"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="size-3" /> Blog tư vấn
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Mail className="size-3" /> Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Pháp lý</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/policy"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="size-3" /> Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link
                  to="/policy"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="size-3" /> Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} NhàTrọ.vn — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
