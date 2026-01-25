import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PostPage.css'

function PostPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    area: '',
    address: '',
    description: '',
    phone: '',
    amenities: {
      wifi: false,
      furniture: false,
      tv: false,
      washingMachine: false,
      kitchen: false,
      fridge: false,
      aircon: false
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Post data:', formData)
    alert('Đăng tin thành công!')
    navigate('/map')
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAmenityChange = (amenity) => {
    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [amenity]: !formData.amenities[amenity]
      }
    })
  }

  return (
    <div className="post-page">
      <header className="post-header">
        <div className="post-header-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Về trang chủ
          </button>
          <h1>📝 Đăng Tin Cho Thuê Nhà Trọ</h1>
        </div>
      </header>

      <div className="post-container">
        <form onSubmit={handleSubmit} className="post-form">
          <div className="form-section">
            <h3>Thông tin cơ bản</h3>
            
            <div className="form-group">
              <label>Tiêu đề tin đăng *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="VD: Phòng trọ đầy đủ tiện nghi gần ĐH FPT"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Giá thuê (VNĐ/tháng) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="2500000"
                  required
                />
              </div>
              <div className="form-group">
                <label>Diện tích (m²) *</label>
                <input
                  type="number"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="25"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Địa chỉ *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Số nhà, tên đường, phường, quận"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Tiện ích</h3>
            <div className="amenities-grid">
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.wifi}
                  onChange={() => handleAmenityChange('wifi')}
                />
                <span className="checkbox-custom"></span>
                <span>📶 WiFi</span>
              </label>
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.furniture}
                  onChange={() => handleAmenityChange('furniture')}
                />
                <span className="checkbox-custom"></span>
                <span>🛋️ Nội thất</span>
              </label>
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.tv}
                  onChange={() => handleAmenityChange('tv')}
                />
                <span className="checkbox-custom"></span>
                <span>📺 Tivi</span>
              </label>
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.washingMachine}
                  onChange={() => handleAmenityChange('washingMachine')}
                />
                <span className="checkbox-custom"></span>
                <span>🧺 Máy giặt</span>
              </label>
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.kitchen}
                  onChange={() => handleAmenityChange('kitchen')}
                />
                <span className="checkbox-custom"></span>
                <span>🍳 Bếp</span>
              </label>
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.fridge}
                  onChange={() => handleAmenityChange('fridge')}
                />
                <span className="checkbox-custom"></span>
                <span>🧊 Tủ lạnh</span>
              </label>
              <label className="amenity-checkbox">
                <input
                  type="checkbox"
                  checked={formData.amenities.aircon}
                  onChange={() => handleAmenityChange('aircon')}
                />
                <span className="checkbox-custom"></span>
                <span>❄️ Máy lạnh</span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h3>Mô tả chi tiết</h3>
            <div className="form-group">
              <label>Mô tả về phòng trọ *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Mô tả về phòng trọ, vị trí, tiện ích xung quanh..."
                required
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h3>Thông tin liên hệ</h3>
            <div className="form-group">
              <label>Số điện thoại *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0912345678"
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              Hủy
            </button>
            <button type="submit" className="btn-submit">
              Đăng Tin
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PostPage
