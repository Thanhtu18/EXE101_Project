import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AuthPages.css'

function LoginPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    // Xử lý đăng nhập ở đây
    console.log('Login:', formData)
    alert('Đăng nhập thành công!')
    navigate('/')
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
          <h2>Đăng Nhập</h2>
          <p className="auth-subtitle">Chào mừng bạn trở lại!</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email hoặc Số điện thoại</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email hoặc số điện thoại"
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
              />
            </div>

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="forgot-link">Quên mật khẩu?</a>
            </div>

            <button type="submit" className="btn-submit">
              Đăng Nhập
            </button>
          </form>

          <div className="auth-divider">
            <span>hoặc</span>
          </div>

          <div className="social-login">
            <button className="btn-social google">
              <span>🌐</span>
              Đăng nhập với Google
            </button>
            <button className="btn-social facebook">
              <span>📘</span>
              Đăng nhập với Facebook
            </button>
          </div>

          <p className="auth-footer">
            Chưa có tài khoản?{' '}
            <a href="#" onClick={(e) => {
              e.preventDefault()
              navigate('/register')
            }}>
              Đăng ký ngay
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

export default LoginPage
