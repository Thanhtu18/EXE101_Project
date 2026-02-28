import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/app/components/ui/button";
import {
  Home,
  MapPin,
  MessageCircle,
  FileText,
  Mail,
  User,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleUserAction = () => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "landlord") {
        navigate("/landlord/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-md">
              <Home className="size-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MapHome</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className={isActive("/") ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Home className="size-4 mr-1.5" />
              Trang chủ
            </Button>

            <Button
              variant={isActive("/map") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/map")}
              className={
                isActive("/map") ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <MapPin className="size-4 mr-1.5" />
              Tìm trọ
            </Button>

            <Button
              variant={isActive("/blog") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/blog")}
              className={
                isActive("/blog") ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <MessageCircle className="size-4 mr-1.5" />
              Blog
            </Button>

            <Button
              variant={isActive("/policy") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/policy")}
              className={
                isActive("/policy") ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <FileText className="size-4 mr-1.5" />
              Chính sách
            </Button>

            <Button
              variant={isActive("/contact") ? "default" : "ghost"}
              size="sm"
              onClick={() => navigate("/contact")}
              className={
                isActive("/contact") ? "bg-green-600 hover:bg-green-700" : ""
              }
            >
              <Mail className="size-4 mr-1.5" />
              Liên hệ
            </Button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="hidden sm:flex"
                >
                  <User className="size-4 mr-1.5" />
                  Đăng nhập
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/login")}
                  className="sm:hidden"
                >
                  <User className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUserAction}
                  >
                    <User className="size-4 mr-1.5" />
                    {user?.name || "Tài khoản"}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>

                {/* Mobile */}
                <div className="sm:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleUserAction}
                  >
                    <User className="size-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="flex md:hidden items-center gap-1 mt-3 overflow-x-auto pb-2">
          {[
            { path: "/", label: "Trang chủ", icon: Home },
            { path: "/map", label: "Tìm trọ", icon: MapPin },
            { path: "/blog", label: "Blog", icon: MessageCircle },
            { path: "/policy", label: "Chính sách", icon: FileText },
            { path: "/contact", label: "Liên hệ", icon: Mail },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.path}
                variant={isActive(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={
                  isActive(item.path) ? "bg-green-600 hover:bg-green-700" : ""
                }
              >
                <Icon className="size-3.5 mr-1" />
                <span className="text-xs">{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
