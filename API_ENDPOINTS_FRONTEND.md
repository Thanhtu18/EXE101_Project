# Frontend API Endpoints & Integration Report

## MapHome Rental Property Application - Frontend Codebase

**Date:** March 20, 2026  
**Scope:** Nhà Trọ Thông Tin Giao Diện (Frontend)

---

## Executive Summary

The frontend codebase is **primarily mock-data driven** with minimal backend API integration. Data management relies on React Context API and local state management. The application does make some external API calls to third-party services for map rendering and image hosting.

---

## 1. ACTUAL API CALLS FOUND

### 1.1 External APIs

#### OpenStreetMap Tiles API

**Purpose:** Map rendering and tile layers  
**Endpoint:** `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`  
**Method:** GET (implicit in Leaflet)  
**Used In:**

- [RentalMapView.tsx](src/app/components/RentalMapView.tsx#L258)
- [RoomDetailPage.tsx](src/app/pages/RoomDetailPage.tsx#L173)
- [LandlordPinMap.tsx](src/app/components/LandlordPinMap.tsx#L115)

**Details:**

```typescript
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(mapRef.current);
```

#### Unsplash Image URLs (CDN)

**Purpose:** Property images, blog images, carousel images  
**Endpoint Pattern:** `https://images.unsplash.com/photo-{ID}?...parameters`  
**Method:** GET  
**Used In:**

- [mockData.ts](src/app/components/mockData.ts) - Multiple property images
- [BlogPage.tsx](src/app/pages/BlogPage.tsx) - Blog post images
- [HomePage.tsx](src/app/pages/HomePage.tsx) - Hero carousel and featured content
- [HeroCarousel.tsx](src/app/components/HeroCarousel.tsx) - Carousel images
- [LoginPage.tsx](src/app/pages/LoginPage.tsx) - Background images
- [RoomDetailPage.tsx](src/app/pages/RoomDetailPage.tsx) - Room detail images
- [PostRoomPage.tsx](src/app/pages/PostRoomPage.tsx) - Uploaded property images

**Sample URLs:**

```
https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=1200&fit=crop&q=80
https://images.unsplash.com/photo-1662454419736-de132ff75638?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBiZWRyb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc2ODQ5NjIzNnww&ixlib=rb-4.1.0&q=80&w=1080
```

---

## 2. PAYMENT INTEGRATION

### 2.1 VNPay Payment Gateway

**Status:** Implemented (UI-only, no actual payment processing)  
**Component:** [VNPayRedirectModal.tsx](src/app/components/VNPayRedirectModal.tsx)

**Implementation Details:**

- Modal shows VNPay branding and progress simulation
- Simulates 2.5 second redirect flow
- Used in [CheckoutPage.tsx](src/app/pages/CheckoutPage.tsx)
- Redirects to `/payment-success` on completion

**Flow:**

```
CheckoutPage → handlePayment() → VNPayRedirectModal → handleVNPayComplete() → PaymentSuccessPage
```

---

## 3. DATA SOURCES & CONTEXT APIS

### 3.1 Authentication Context

**File:** [AuthContext.tsx](src/app/contexts/AuthContext.tsx)

**Demo Accounts (No Backend Integration):**

```typescript
// Admin
- Username: admin / Password: admin123
- Email: admin@maphome.vn

// Landlord Demo
- Username: chutro1 / Password: 123456
- Email: chutro1@example.com

// User Demo
- Username: user1 / Password: 123456
- Email: user1@example.com
```

**Methods:**

- `login(username: string, password: string)` - Client-side validation only
- `register(data: RegisterData)` - Stores in localStorage under 'registeredUsers'
- `logout()` - Clears session
- `isAuthenticated: boolean`

**Storage:** localStorage (key: 'auth')

### 3.2 Properties Context

**File:** [PropertiesContext.tsx](src/app/contexts/PropertiesContext.tsx)

**Data Source:** [mockData.ts](src/app/components/mockData.ts)  
**Mock Data Objects:**

- `mockRentalProperties` - Array of 12+ rental properties
- `mockLandlords` - Array of 5 landlord profiles

**Methods:**

- `addProperty(property)` - Add new property (in-memory only)
- `updateProperty(id, updates)` - Update property details
- Consumed by: HomePage, PropertyList, MapPage, RoomDetailPage

### 3.3 Verification Context

**File:** [VerificationContext.tsx](src/app/contexts/VerificationContext.tsx)

**Mock Data:** In-memory state (initialized empty)

**Methods:**

- `addRequest()` - Request property verification
- `updateRequestStatus()` - Update verification status
- `completeInspection()` - Complete inspection and award badge
- `getRequestsByLandlord()` - Filter by landlord
- `getRequestsByProperty()` - Filter by property
- `getRequestsByUser()` - Filter by user
- `submitUserPhotos()` - User photo submission
- `notifyUserAboutPhotos()` - Notification trigger

### 3.4 Compare Context

**File:** [CompareContext.tsx](src/app/contexts/CompareContext.tsx)

**Purpose:** Store properties for comparison  
**Methods:**

- `addToCompare(propertyId)` - Add property
- `removeFromCompare(propertyId)` - Remove property
- `getComparedProperties()` - Get comparison list

---

## 4. FEATURE-BASED API ENDPOINT ORGANIZATION

### 4.1 AUTHENTICATION & USER MANAGEMENT

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Login validation: [LoginPage.tsx](src/app/pages/LoginPage.tsx#L40-L60)
- Registration form: [RegisterPage.tsx](src/app/pages/RegisterPage.tsx)
- Auth check: [AuthContext.tsx](src/app/contexts/AuthContext.tsx)

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
GET  /api/auth/verify
```

### 4.2 PROPERTY LISTINGS

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Fetch properties: [PropertiesContext.tsx](src/app/contexts/PropertiesContext.tsx)
- Display list: [PropertyList.tsx](src/app/components/PropertyList.tsx)
- Room details: [RoomDetailPage.tsx](src/app/pages/RoomDetailPage.tsx)
- Post room: [PostRoomPage.tsx](src/app/pages/PostRoomPage.tsx)

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
GET    /api/properties
GET    /api/properties/:id
POST   /api/properties
PUT    /api/properties/:id
DELETE /api/properties/:id
GET    /api/properties/search?query=...
GET    /api/properties/landlord/:landlordId
```

### 4.3 LANDLORD SERVICES

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Dashboard: [LandlordDashboardV2.tsx](src/app/pages/LandlordDashboardV2.tsx)
- Verification requests: [InspectionsView.tsx](src/app/components/InspectionsView.tsx)
- Request verification: [RequestVerificationDialog.tsx](src/app/components/RequestVerificationDialog.tsx)

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
GET    /api/landlord/profile
PUT    /api/landlord/profile
GET    /api/landlord/properties
GET    /api/landlord/verification-requests
POST   /api/landlord/verification-request
PUT    /api/landlord/verification-request/:id/status
GET    /api/landlord/analytics
GET    /api/landlord/subscription
```

### 4.4 VERIFICATION & INSPECTION

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Admin dashboard: [AdminPage.tsx](src/app/pages/AdminPage.tsx)
- Inspection dialog: [InspectionDialog.tsx](src/app/components/InspectionDialog.tsx)
- Green badge award: [GreenBadgeDisplay.tsx](src/app/components/GreenBadgeDisplay.tsx)

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
GET    /api/admin/verification-requests
PUT    /api/admin/verification/:id/approve
PUT    /api/admin/verification/:id/reject
POST   /api/admin/inspection/:id/complete
GET    /api/admin/verification-stats
```

### 4.5 BOOKING & INSPECTION SCHEDULING

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Booking dialog: [BookingDialog.tsx](src/app/components/BookingDialog.tsx)
- User inspection request: [UserRequestInspectionDialog.tsx](src/app/components/UserRequestInspectionDialog.tsx)
- Uses localStorage for session storage

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
POST   /api/bookings
GET    /api/bookings
PUT    /api/bookings/:id
DELETE /api/bookings/:id
GET    /api/bookings/property/:propertyId
POST   /api/inspections
GET    /api/inspections
PUT    /api/inspections/:id/status
```

### 4.6 PAYMENT & SUBSCRIPTION

**Status:** ⚠️ Partially Integrated (VNPay UI Only)

**Frontend Implementation:**

- Checkout page: [CheckoutPage.tsx](src/app/pages/CheckoutPage.tsx)
- VNPay modal: [VNPayRedirectModal.tsx](src/app/components/VNPayRedirectModal.tsx)
- Payment success: [PaymentSuccessPage.tsx](src/app/pages/PaymentSuccessPage.tsx)
- Payment failure: [PaymentFailurePage.tsx](src/app/pages/PaymentFailurePage.tsx)
- Subscription management: [SubscriptionManagement.tsx](src/app/components/SubscriptionManagement.tsx)

**Current Implementation:**

- Mock pricing tiers stored in component state
- VNPay redirect simulated with progress bar
- No actual payment processing
- Order data passed via location.state or sessionStorage

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
POST   /api/payments/vnpay/create-order
GET    /api/payments/vnpay/return
POST   /api/payments/vnpay/ipn
GET    /api/subscription/current
POST   /api/subscription/upgrade
POST   /api/subscription/cancel
GET    /api/payments/history
GET    /api/payments/invoice/:id
```

### 4.7 USER DASHBOARD

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- User dashboard: [UserDashboard.tsx](src/app/pages/UserDashboard.tsx)
- Favorites management: [useFavorites.ts](src/app/hooks/useFavorites.ts)

**Storage:** localStorage (key: 'favorites')

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
GET    /api/user/profile
PUT    /api/user/profile
GET    /api/user/favorites
POST   /api/user/favorites/:propertyId
DELETE /api/user/favorites/:propertyId
GET    /api/user/bookings
GET    /api/user/inspections
```

### 4.8 SEARCH & FILTERING

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Search component: [SearchByWorkplace.tsx](src/app/components/SearchByWorkplace.tsx)
- Filter panel: [FilterPanel.tsx](src/app/components/FilterPanel.tsx)
- All filtering done client-side on mock data

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
GET    /api/search?q=...&location=...&page=...&limit=...
GET    /api/properties/filter?...
GET    /api/properties/nearby?lat=...&lng=...&radius=...
GET    /api/facilities/nearby?lat=...&lng=...&type=...
```

### 4.9 MAP & LOCATION

**Status:** ✅ Third-Party Integration Active

**External APIs:**

- OpenStreetMap Tiles: [https://tile.openstreetmap.org/{z}/{x}/{y}.png](https://tile.openstreetmap.org/{z}/{x}/{y}.png)
- Leaflet.js: Map rendering library

**Frontend Implementation:**

- Map view: [RentalMapView.tsx](src/app/components/RentalMapView.tsx)
- Location pinning: [LandlordPinMap.tsx](src/app/components/LandlordPinMap.tsx)
- Room detail map: [RoomDetailPage.tsx](src/app/pages/RoomDetailPage.tsx)
- Vietnam locations data: [vietnamLocations.ts](src/app/data/vietnamLocations.ts)

### 4.10 UPLOAD & MEDIA

**Status:** ❌ No Backend Integration (Mock Only)

**Frontend Implementation:**

- Upload component: Image upload in [PostRoomPage.tsx](src/app/pages/PostRoomPage.tsx)
- Uses Unsplash URLs as fallback

**Expected Backend Endpoints (NOT IMPLEMENTED):**

```
POST   /api/upload/image
POST   /api/upload/multiple
DELETE /api/upload/:fileId
GET    /api/upload/quota
```

---

## 5. CLIENT-SIDE STORAGE

### 5.1 localStorage Usage

```javascript
// Authentication
localStorage.getItem("auth");
localStorage.setItem("auth", JSON.stringify(authData));

// Registered Users
localStorage.getItem("registeredUsers");
localStorage.setItem("registeredUsers", JSON.stringify(users));

// Favorites
localStorage.getItem("favorites");
localStorage.setItem("favorites", JSON.stringify(favoriteIds));
```

### 5.2 sessionStorage Usage

```javascript
// Checkout Data (temporary)
sessionStorage.getItem("inspectionCheckoutData");
sessionStorage.setItem("inspectionCheckoutData", JSON.stringify(checkoutData));
sessionStorage.removeItem("inspectionCheckoutData");
```

---

## 6. THIRD-PARTY INTEGRATIONS

### 6.1 Image Hosting

**Service:** Unsplash (via CDN)  
**Usage:** Property images, blog images, UI assets  
**Base URL:** `https://images.unsplash.com/`  
**Count:** 50+ image URLs in codebase

### 6.2 Mapping

**Service:** OpenStreetMap (via Leaflet.js)  
**Usage:** Property location display, location selection  
**Tiles URL:** `https://tile.openstreetmap.org/{z}/{x}/{y}.png`

### 6.3 Carousel

**Library:** react-slick  
**Usage:** Hero carousel, image galleries

### 6.4 Date Formatting

**Library:** date-fns  
**Usage:** Date display and manipulation (Vietnamese locale)

---

## 7. COMPONENTS ORGANIZATION

### 7.1 Pages (No API Calls)

```
src/app/pages/
├── HomePage.tsx                    - Home page (mock data)
├── LoginPage.tsx                   - Login (local auth)
├── RegisterPage.tsx                - Registration (local auth)
├── MapPage.tsx                     - Map view
├── RoomDetailPage.tsx              - Property details
├── ComparePage.tsx                 - Comparison tool
├── PostRoomPage.tsx                - Post property (local state)
├── CheckoutPage.tsx                - Checkout (VNPay simulation)
├── PaymentSuccessPage.tsx          - Success page
├── PaymentFailurePage.tsx          - Failure page
├── PricingPage.tsx                 - Pricing (local data)
├── LandlordDashboardV2.tsx        - Landlord dashboard (contexts)
├── UserDashboard.tsx               - User dashboard (contexts)
├── AdminPage.tsx                   - Admin dashboard (contexts)
├── BlogPage.tsx                    - Blog (mock data)
├── ContactPage.tsx                 - Contact form (no API)
└── PolicyPage.tsx                  - Policies
```

### 7.2 Contexts (Data Management)

```
src/app/contexts/
├── AuthContext.tsx                 - Authentication management
├── PropertiesContext.tsx           - Property list management
├── VerificationContext.tsx         - Verification requests
└── CompareContext.tsx              - Property comparison
```

### 7.3 Components Making External Calls

```
src/app/components/
├── RentalMapView.tsx              ✅ OpenStreetMap (L.tileLayer)
├── RoomDetailPage.tsx             ✅ OpenStreetMap (L.tileLayer)
├── LandlordPinMap.tsx             ✅ OpenStreetMap (L.tileLayer)
├── VNPayRedirectModal.tsx         ⚠️ VNPay (UI simulation)
├── mockData.ts                    ✅ Unsplash URLs (50+)
├── HeroCarousel.tsx               ✅ Unsplash URLs
├── BlogPage.tsx                   ✅ Unsplash URLs
└── [Others]                       ❌ No API calls
```

---

## 8. DATA FLOW EXAMPLE: Property Listing

```
1. HomePage Component
   ↓
2. useProperties() hook → PropertiesContext
   ↓
3. Return mockRentalProperties from mockData.ts
   ↓
4. PropertyCard Component
   ↓
5. Display images from Unsplash URLs (async load)
   ↓
6. RentalMapView Component
   ↓
7. Load OpenStreetMap tiles via L.tileLayer()
```

---

## 9. ROUTING STRUCTURE

```
/                          → HomePage
/map                       → MapPage (OSM tiles)
/room/:id                  → RoomDetailPage (OSM tiles)
/compare                   → ComparePage
/pricing                   → PricingPage
/checkout                  → CheckoutPage (VNPay simulation)
/payment-success           → PaymentSuccessPage
/payment-failure           → PaymentFailurePage
/register                  → RegisterPage (local auth)
/post-room                 → PostRoomPage (local state)
/blog                      → BlogPage (mock data)
/policy                    → PolicyPage
/contact                   → ContactPage
/login                     → LoginPage (local auth)
/admin/dashboard           → AdminPage (contexts)
/landlord/dashboard        → LandlordDashboardV2 (contexts)
/user/dashboard            → UserDashboard (contexts)
```

---

## 10. RECOMMENDATIONS FOR BACKEND INTEGRATION

### Priority 1 (Critical):

1. **Authentication Service**
   - Replace AuthContext local validation with JWT-based API
   - Implement `/api/auth/login`, `/api/auth/register`

2. **Properties API**
   - Implement CRUD endpoints for properties
   - Add search and filtering
   - Property queries in all listings

3. **Payment Processing**
   - Replace VNPay mock with actual payment flow
   - Implement order creation and status tracking

### Priority 2 (High):

4. **Verification/Inspection Service**
   - Replace VerificationContext with backend API
   - Admin inspection workflow

5. **User Profiles & Data**
   - User dashboard data from backend
   - Subscription management

6. **File Upload**
   - Replace Unsplash URLs with actual upload service
   - Property image uploads

### Priority 3 (Medium):

7. **Search & Filtering**
   - Server-side search with indexing
   - Advanced filtering options

8. **Notifications**
   - Real-time booking confirmations
   - Inspection updates

9. **Analytics**
   - Property view tracking
   - User behavior analytics

---

## 11. ENVIRONMENT VARIABLES NEEDED

```env
# Map Configuration
REACT_APP_OPENSTREETMAP_URL=https://tile.openstreetmap.org

# Payment Gateway
REACT_APP_VNPAY_URL=https://sandbox.vnpayment.vn/paygate/pay
REACT_APP_VNPAY_MERCHANT_CODE=xxxxx
REACT_APP_VNPAY_SECRET_KEY=xxxxx

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_TIMEOUT=30000

# Image Upload
REACT_APP_UPLOAD_MAX_SIZE=5242880
REACT_APP_ALLOWED_IMAGE_TYPES=image/jpeg,image/png,image/webp

# Features
REACT_APP_ENABLE_SOCIAL_LOGIN=false
REACT_APP_ENABLE_REAL_PAYMENTS=false
```

---

## 12. SUMMARY STATISTICS

| Category                   | Count | Status                    |
| -------------------------- | ----- | ------------------------- |
| Pages                      | 16    | ❌ No Backend             |
| Components                 | 25+   | ❌ No Backend             |
| Contexts                   | 4     | ❌ No Backend             |
| External APIs              | 2     | ✅ Active (OSM, Unsplash) |
| Mock Data Objects          | 12+   | -                         |
| localStorage Keys          | 3     | -                         |
| Routes                     | 17    | ✅ All Setup              |
| Image URLs                 | 50+   | ✅ Unsplash               |
| Expected Backend Endpoints | 50+   | ❌ Not Implemented        |

---

## 13. CONCLUSION

The frontend is a **fully functional UI prototype** with:

- ✅ Complete user interface
- ✅ Navigation and routing
- ✅ Client-side state management (React Contexts)
- ✅ External map/image services
- ✅ Mock payment flow
- ❌ **NO backend API integration**
- ❌ **NO real data persistence**
- ❌ **NO real authentication**
- ❌ **NO real payment processing**

**To make this production-ready:** All 50+ expected backend endpoints need to be implemented and integrated.

---

_Report Generated on March 20, 2026_
