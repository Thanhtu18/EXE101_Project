# MapHome Backend API

Node.js + Express + MongoDB backend for MapHome.

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create `.env`

```dotenv
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?appName=Cluster1
DB_NAME=MapHome
JWT_SECRET=your_secret
PORT=5000
```

3. Run

```bash
npm run dev
```

## Main API Groups

- Auth: `/api/auth`
- Users & Favorites: `/api/users`
- Properties: `/api/properties`
- Landlords: `/api/landlords`
- Verifications: `/api/verifications`
- Bookings: `/api/bookings`
- Payments: `/api/payments`
- Uploads: `/api/uploads`
- Admin stats: `/api/admin`

## Auth Header

Use JWT token for protected endpoints:

```http
Authorization: Bearer <token>
```

## Notable Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/users/me`
- `GET /api/users/me/favorites`
- `POST /api/users/me/favorites/toggle`
- `GET /api/properties`
- `GET /api/properties/nearby?lat=10.77&lng=106.69&radiusKm=5`
- `POST /api/properties/:id/favorite`
- `POST /api/properties/:id/view`
- `GET /api/verifications?landlordId=<id>&status=pending`
- `POST /api/verifications/:id/photos`
- `POST /api/verifications/:id/complete`
- `POST /api/bookings`
- `POST /api/uploads/single` (form-data key: `image`)
- `POST /api/uploads/multiple` (form-data key: `images`)
- `GET /api/admin/stats`

## Notes

- VNPay integration is currently a stub response in `paymentController`.
- Local file uploads are stored under `uploads/` and served at `/uploads/<filename>`.
