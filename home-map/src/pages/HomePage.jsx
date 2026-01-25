import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomePage.css'

function HomePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [searchData, setSearchData] = useState({
    location: '',
    priceRange: '',
    areaRange: ''
  })

  const handleFindByLocation = () => {
    // Yêu cầu quyền truy cập vị trí
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          navigate(`/map?lat=${latitude}&lng=${longitude}`)
        },
        (error) => {
          alert('Không thể lấy vị trí của bạn. Vui lòng cho phép truy cập vị trí!')
          console.error(error)
        }
      )
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị!')
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Search:', searchData)
    // Chuyển đến trang map với các filter
    navigate('/map')
  }

  const handleSearchChange = (field, value) => {
    setSearchData({
      ...searchData,
      [field]: value
    })
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-header-content">
          <div className="logo" onClick={() => navigate('/')}>
            <span className="logo-icon">🏠</span>
            <span className="logo-text">Tìm Nhà Trọ</span>
          </div>
          <div className="header-actions">
            <button className="btn-login" onClick={() => navigate('/login')}>
              <span>👤</span>
                Đăng nhập
            </button>
            <button className="btn-post" onClick={() => navigate('/post')}>
              Đăng trọ
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Tìm phòng trọ<br />
            <span className="hero-highlight">Nhanh chóng & Dễ dàng</span>
          </h1>
          <p className="hero-subtitle">
            Trang thông tin và cho thuê phòng trọ nhanh chóng, hiệu quả<br />
            với hơn 500 tin đăng mới và 30.000 lượt xem mỗi ngày
          </p>

          {/* Tabs */}
          <div className="property-tabs">
            <button 
              className={`tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              Tất cả
            </button>
            <button 
              className={`tab ${activeTab === 'room' ? 'active' : ''}`}
              onClick={() => setActiveTab('room')}
            >
              Nhà trọ, phòng trọ
            </button>
            <button 
              className={`tab ${activeTab === 'house' ? 'active' : ''}`}
              onClick={() => setActiveTab('house')}
            >
              Nhà nguyên căn
            </button>
            <button 
              className={`tab ${activeTab === 'apartment' ? 'active' : ''}`}
              onClick={() => setActiveTab('apartment')}
            >
              Căn hộ
            </button>
            <button 
              className={`tab ${activeTab === 'dormitory' ? 'active' : ''}`}
              onClick={() => setActiveTab('dormitory')}
            >
              Ký túc xá
            </button>
          </div>

          {/* Search Form */}
          <form className="search-form" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Bạn muốn tìm trọ ở đâu?"
                value={searchData.location}
                onChange={(e) => handleSearchChange('location', e.target.value)}
                className="search-input"
              />
            </div>

            <div className="search-select-wrapper">
              <span className="select-icon">💰</span>
              <select
                value={searchData.priceRange}
                onChange={(e) => handleSearchChange('priceRange', e.target.value)}
                className="search-select"
              >
                <option value="">Mức giá</option>
                <option value="0-2">Dưới 2 triệu</option>
                <option value="2-3">2 - 3 triệu</option>
                <option value="3-5">3 - 5 triệu</option>
                <option value="5-7">5 - 7 triệu</option>
                <option value="7+">Trên 7 triệu</option>
              </select>
            </div>

            <div className="search-select-wrapper">
              <span className="select-icon">📏</span>
              <select
                value={searchData.areaRange}
                onChange={(e) => handleSearchChange('areaRange', e.target.value)}
                className="search-select"
              >
                <option value="">Diện tích</option>
                <option value="0-20">Dưới 20m²</option>
                <option value="20-30">20 - 30m²</option>
                <option value="30-50">30 - 50m²</option>
                <option value="50+">Trên 50m²</option>
              </select>
            </div>

            <button type="submit" className="btn-search">
              🔍 Tìm kiếm
            </button>
          </form>

          <button className="btn-find-location" onClick={handleFindByLocation}>
            <span className="btn-icon">📍</span>
            Tìm trọ bằng bản đồ
          </button>

          <p className="find-note">
            Ghim vị trí và tìm kiếm nhà trọ xung quanh bạn
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon green">📍</div>
          <h3>Bản đồ tương tác</h3>
          <p>Xem vị trí chính xác của từng phòng trọ trên bản đồ</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon blue">🏠</div>
          <h3>Đầy đủ tiện ích</h3>
          <p>Thông tin chi tiết về giá cả, tiện nghi và liên hệ chủ trọ</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon purple">👥</div>
          <h3>Dễ dàng sử dụng</h3>
          <p>Giao diện thân thiện, tìm kiếm nhanh chóng và chính xác</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Tìm Nhà Trọ. Giúp bạn tìm được mái nhà phù hợp.</p>
        <button className="help-btn">?</button>
      </footer>
    </div>
  )
}

export default HomePage
