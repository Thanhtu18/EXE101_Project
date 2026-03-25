import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ArrowLeft, Home, UserPlus } from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'user' | 'landlord' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      return;
    }

    setLoading(true);
    try {
      const result = await register({
        username,
        email,
        password,
        confirmPassword,
        fullName,
        phone,
        role,
      });

      if (!result.success) {
        setError(result.message || 'Đăng ký thất bại');
        setLoading(false);
        return;
      }

      // No longer auto-login to follow user request
      setSuccess("Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Lỗi mạng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="size-5" />
          </Button>
          <Home className="size-6 text-green-600" />
          <h1 className="text-2xl font-bold text-gray-900">MapHome</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="size-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h2>
            <p className="text-gray-600">Tạo tài khoản để bắt đầu tìm trọ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <Input
                type="text"
                placeholder="chutro123"
                required
                value={username}
                onChange={(e) => setUsername((e.target as HTMLInputElement).value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <Input
                type="text"
                placeholder="Nguyễn Văn A"
                required
                value={fullName}
                onChange={(e) => setFullName((e.target as HTMLInputElement).value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="email@example.com"
                required
                value={email}
                onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <Input
                type="tel"
                placeholder="0123456789"
                required
                value={phone}
                onChange={(e) => setPhone((e.target as HTMLInputElement).value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)}
              />
            </div>

            <div className="flex gap-4 items-center flex-wrap">
              <label className="text-sm font-medium text-gray-700">Bạn là</label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'landlord'}
                  onChange={() => setRole('landlord')}
                />
                Chủ trọ
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                />
                Người tìm trọ
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                />
                Quản trị viên
              </label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              <UserPlus className="size-4 mr-2" />
              {loading ? 'Đang xử lý...' : 'Đăng ký'}
            </Button>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-green-600 font-medium hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}