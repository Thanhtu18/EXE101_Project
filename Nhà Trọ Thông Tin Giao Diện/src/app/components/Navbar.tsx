import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/app/contexts/AuthContext';
import { Button } from '@/app/components/ui/button';
import { Home, MapPin, UserPlus, PenSquare, MessageCircle, FileText, Mail, User, LogOut } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleUserAction = () => {
    if (isAuthenticated && user) {
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'landlord') {
        navigate('/landlord/dashboard');
      } else {
        // For regular users, go to user dashboard
        navigate('/user/dashboard');
      }
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center shadow-md">
              <Home className="size-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MapHome</h1>
          </div>

          {/* Navigation Buttons */}
          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={isActive('/') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/')}
              className={isActive('/') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <Home className="size-4 mr-1.5" />
              Trang chủ
            </Button>

            <Button
              variant={isActive('/map') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/map')}
              className={isActive('/map') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <MapPin className="size-4 mr-1.5" />
              Tìm trọ
            </Button>

            <Button
              variant={isActive('/blog') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/blog')}
              className={isActive('/blog') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <MessageCircle className="size-4 mr-1.5" />
              Blog
            </Button>

            <Button
              variant={isActive('/policy') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/policy')}
              className={isActive('/policy') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <FileText className="size-4 mr-1.5" />
              Chính sách
            </Button>

            <Button
              variant={isActive('/contact') ? 'default' : 'ghost'}
              size="sm"
              onClick={() => navigate('/contact')}
              className={isActive('/contact') ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              <Mail className="size-4 mr-1.5" />
              Liên hệ
            </Button>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="hidden sm:flex"
                >
                  <User className="size-4 mr-1.5" />
                  Đăng nhập
                </Button>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="sm:hidden"
                >
                  <User className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-xs text-gray-600">
                    <strong className="text-sm text-gray-900">{user?.fullName || user?.username}</strong>
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleUserAction}
                  >
                    {user?.role === 'admin' ? 'Admin' : user?.role === 'landlord' ? 'Quản lý' : 'Tài khoản'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    <LogOut className="size-4" />
                  </Button>
                </div>
                {/* Mobile - Show user button */}
                <div className="flex items-center gap-2 sm:hidden">
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
        <nav className="flex md:hidden items-center gap-1 mt-3 overflow-x-auto pb-1">
          <Button
            variant={isActive('/') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/')}
            className={isActive('/') ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Home className="size-3.5 mr-1" />
            <span className="text-xs">Trang chủ</span>
          </Button>

          <Button
            variant={isActive('/map') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/map')}
            className={isActive('/map') ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <MapPin className="size-3.5 mr-1" />
            <span className="text-xs">Tìm trọ</span>
          </Button>

          <Button
            variant={isActive('/blog') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/blog')}
            className={isActive('/blog') ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <MessageCircle className="size-3.5 mr-1" />
            <span className="text-xs">Blog</span>
          </Button>

          <Button
            variant={isActive('/policy') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/policy')}
            className={isActive('/policy') ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <FileText className="size-3.5 mr-1" />
            <span className="text-xs">Chính sách</span>
          </Button>

          <Button
            variant={isActive('/contact') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => navigate('/contact')}
            className={isActive('/contact') ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Mail className="size-3.5 mr-1" />
            <span className="text-xs">Liên hệ</span>
          </Button>
        </nav>
      </div>
    </header>
  );
}