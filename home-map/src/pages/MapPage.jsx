import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../App.css'

// Fix Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png'
import iconShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

// Dữ liệu nhà trọ mẫu
const rentalProperties = [
  {
    id: 1,
    name: 'Nhà trọ Tân Bình 1',
    position: [10.8006, 106.6506],
    price: '2.500.000',
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washingMachine: true,
      kitchen: true,
      fridge: true,
      aircon: true
    },
    address: '123 Hoàng Hoa Thám, Tân Bình'
  },
  {
    id: 2,
    name: 'Phòng trọ Quận 1',
    position: [10.7769, 106.7009],
    price: '4.000.000',
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washingMachine: false,
      kitchen: true,
      fridge: true,
      aircon: true
    },
    address: '456 Lê Lai, Quận 1'
  },
  {
    id: 3,
    name: 'Nhà trọ Bình Thạnh',
    position: [10.8142, 106.7117],
    price: '3.200.000',
    amenities: {
      wifi: true,
      furniture: true,
      tv: false,
      washingMachine: true,
      kitchen: true,
      fridge: true,
      aircon: true
    },
    address: '789 Xô Viết Nghệ Tĩnh, Bình Thạnh'
  },
  {
    id: 4,
    name: 'Phòng trọ Thủ Đức',
    position: [10.8505, 106.7718],
    price: '2.800.000',
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washingMachine: true,
      kitchen: false,
      fridge: true,
      aircon: false
    },
    address: '321 Võ Văn Ngân, Thủ Đức'
  },
  {
    id: 5,
    name: 'Nhà trọ Phú Nhuận',
    position: [10.7980, 106.6836],
    price: '3.500.000',
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washingMachine: true,
      kitchen: true,
      fridge: true,
      aircon: true
    },
    address: '555 Phan Xích Long, Phú Nhuận'
  }
]

function MapPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [mapCenter, setMapCenter] = useState([10.8006, 106.6956])

  useEffect(() => {
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    if (lat && lng) {
      setMapCenter([parseFloat(lat), parseFloat(lng)])
    }
  }, [searchParams])

  const getAmenityIcon = (amenity, value) => {
    return value ? '✓' : '✗'
  }

  const getAmenityClass = (value) => {
    return value ? 'amenity-yes' : 'amenity-no'
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-content">
          <button className="back-btn" onClick={() => navigate('/')}>
            ← Về trang chủ
          </button>
          <div>
            <h1>🏠 Tìm Nhà Trọ - Rental Map</h1>
            <p>Tìm nhà trọ phù hợp với bạn tại TP.HCM</p>
          </div>
        </div>
      </header>

      <div className="main-content">
        <div className="map-wrapper">
          <MapContainer 
            center={mapCenter} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {rentalProperties.map((property) => (
              <Marker 
                key={property.id} 
                position={property.position}
                eventHandlers={{
                  click: () => setSelectedProperty(property)
                }}
              >
                <Popup>
                  <div className="popup-content">
                    <h3>{property.name}</h3>
                    <p className="price">💰 {property.price} VNĐ/tháng</p>
                    <p className="address">📍 {property.address}</p>
                    <button 
                      className="view-details-btn"
                      onClick={() => setSelectedProperty(property)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {selectedProperty && (
          <div className="details-panel">
            <button 
              className="close-btn"
              onClick={() => setSelectedProperty(null)}
            >
              ✕
            </button>
            
            <h2>{selectedProperty.name}</h2>
            <div className="price-tag">
              <span className="price-label">Giá thuê:</span>
              <span className="price-value">{selectedProperty.price} VNĐ/tháng</span>
            </div>
            
            <div className="address-section">
              <strong>📍 Địa chỉ:</strong>
              <p>{selectedProperty.address}</p>
            </div>

            <div className="amenities-section">
              <h3>Tiện ích:</h3>
              <ul className="amenities-list">
                <li className={getAmenityClass(selectedProperty.amenities.wifi)}>
                  <span className="icon">{getAmenityIcon('wifi', selectedProperty.amenities.wifi)}</span>
                  <span>WiFi</span>
                </li>
                <li className={getAmenityClass(selectedProperty.amenities.furniture)}>
                  <span className="icon">{getAmenityIcon('furniture', selectedProperty.amenities.furniture)}</span>
                  <span>Nội thất</span>
                </li>
                <li className={getAmenityClass(selectedProperty.amenities.tv)}>
                  <span className="icon">{getAmenityIcon('tv', selectedProperty.amenities.tv)}</span>
                  <span>Tivi</span>
                </li>
                <li className={getAmenityClass(selectedProperty.amenities.washingMachine)}>
                  <span className="icon">{getAmenityIcon('washingMachine', selectedProperty.amenities.washingMachine)}</span>
                  <span>Máy giặt</span>
                </li>
                <li className={getAmenityClass(selectedProperty.amenities.kitchen)}>
                  <span className="icon">{getAmenityIcon('kitchen', selectedProperty.amenities.kitchen)}</span>
                  <span>Bếp</span>
                </li>
                <li className={getAmenityClass(selectedProperty.amenities.fridge)}>
                  <span className="icon">{getAmenityIcon('fridge', selectedProperty.amenities.fridge)}</span>
                  <span>Tủ lạnh</span>
                </li>
                <li className={getAmenityClass(selectedProperty.amenities.aircon)}>
                  <span className="icon">{getAmenityIcon('aircon', selectedProperty.amenities.aircon)}</span>
                  <span>Máy lạnh</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapPage
