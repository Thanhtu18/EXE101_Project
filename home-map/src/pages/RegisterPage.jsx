import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthPages.css'

function RegisterPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!')
      return
    }

    // Xử lý đăng ký ở đây
    console.log('Register:', formData)
    alert('Đăng ký thành công!')
    navigate('/login')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Tìm Nhà Trọ</span>
          </div>
        </div>

        <div className="auth-box">
          <h2>Đăng Ký Tài Khoản</h2>
          <p className="auth-subtitle">Tạo tài khoản để bắt đầu tìm nhà trọ</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email"
                required
              />
            </div>

            <div className="form-group">
              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
              />
            </div>

            <div className="form-group">
              <label>Mật khẩu</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Nhập lại mật khẩu"
                required
                minLength="6"
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" required />
                <span>Tôi đồng ý với <a href="#">Điều khoản dịch vụ</a> và <a href="#">Chính sách bảo mật</a></span>
              </label>
            </div>

            <button type="submit" className="btn-submit">
              Đăng Ký
            </button>
          </form>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          <div className="social-login">
            <button className="btn-social google">
              <span>🌐</span>
              Đăng ký với Google
            </button>
            <button className="btn-social facebook">
              <span>📘</span>
              Đăng ký với Facebook
            </button>
          </div>

          <p className="auth-footer">
            Đã có tài khoản?{' '}
            <a href="#" onClick={(e) => {
              e.preventDefault()
              navigate('/login')
            }}>
              Đăng nhập
            </a>
          </p>
        </div>

        <button className="btn-back" onClick={() => navigate('/')}>
          ← Về trang chủ
        </button>
      </div>
    </div>
  )
}

export default RegisterPage
