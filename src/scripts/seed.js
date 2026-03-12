require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Room = require("../models/Room");

const sampleRooms = [
  {
    title: "Phòng trọ tiện nghi gần Hồ Hoàn Kiếm",
    price: 3200000,
    address: "Quận Hoàn Kiếm, Hà Nội",
    description: "Phòng sạch sẽ, đầy đủ nội thất, gần trung tâm.",
    area: 20,
    images: ["https://via.placeholder.com/600x400?text=Room+1"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washer: false,
      kitchen: false,
      fridge: true,
      ac: true,
    },
    phone: "0912345678",
    available: true,
    location: { type: "Point", coordinates: [105.8525, 21.0285] },
  },
  {
    title: "Phòng nhỏ xinh gần Đại học Bách Khoa",
    price: 2200000,
    address: "Quận Hai Bà Trưng, Hà Nội",
    description: "Phù hợp sinh viên, an ninh tốt.",
    area: 15,
    images: ["https://via.placeholder.com/600x400?text=Room+2"],
    amenities: {
      wifi: true,
      furniture: false,
      tv: false,
      washer: false,
      kitchen: true,
      fridge: false,
      ac: false,
    },
    phone: "0987654321",
    available: true,
    location: { type: "Point", coordinates: [105.846, 21.0068] },
  },
  {
    title: "Căn hộ mini full nội thất",
    price: 4500000,
    address: "Quận Đống Đa, Hà Nội",
    description: "Ban công, đầy đủ tiện nghi.",
    area: 28,
    images: ["https://via.placeholder.com/600x400?text=Room+3"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washer: true,
      kitchen: true,
      fridge: true,
      ac: true,
    },
    phone: "0934567890",
    available: true,
    location: { type: "Point", coordinates: [105.8231, 21.0161] },
  },
  {
    title: "Phòng gần Ga Hà Nội",
    price: 2800000,
    address: "Quận Hai Bà Trưng, Hà Nội",
    description: "Gần các tuyến xe buýt, giao thông tiện lợi.",
    area: 18,
    images: ["https://via.placeholder.com/600x400?text=Room+4"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: false,
      washer: false,
      kitchen: true,
      fridge: false,
      ac: true,
    },
    phone: "0945123456",
    available: true,
    location: { type: "Point", coordinates: [105.8422, 21.0115] },
  },
  {
    title: "Phòng trọ yên tĩnh gần Lotte",
    price: 5000000,
    address: "Quận Hà Đông, Hà Nội",
    description: "Khu vực mới, an toàn, nhiều tiện ích.",
    area: 30,
    images: ["https://via.placeholder.com/600x400?text=Room+5"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washer: true,
      kitchen: true,
      fridge: true,
      ac: true,
    },
    phone: "0909876543",
    available: true,
    location: { type: "Point", coordinates: [105.7784, 20.9875] },
  },
  {
    title: "Phòng nhỏ trung tâm giá rẻ",
    price: 2200000,
    address: "Quận Hoàn Kiếm, Hà Nội",
    description: "Tiện di chuyển, phù hợp ở độc thân.",
    area: 14,
    images: ["https://via.placeholder.com/600x400?text=Room+6"],
    amenities: {
      wifi: true,
      furniture: false,
      tv: false,
      washer: false,
      kitchen: false,
      fridge: false,
      ac: false,
    },
    phone: "0978234567",
    available: true,
    location: { type: "Point", coordinates: [105.839, 21.027] },
  },
  {
    title: "Studio cao cấp gần công viên",
    price: 4800000,
    address: "Quận Cầu Giấy, Hà Nội",
    description: "Thiết kế hiện đại, bảo vệ 24/7.",
    area: 26,
    images: ["https://via.placeholder.com/600x400?text=Room+7"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washer: true,
      kitchen: true,
      fridge: true,
      ac: true,
    },
    phone: "0923456789",
    available: true,
    location: { type: "Point", coordinates: [105.7925, 21.028] },
  },
  {
    title: "Phòng trọ giá rẻ cho sinh viên",
    price: 2000000,
    address: "Quận Hà Đông, Hà Nội",
    description: "Gần trường, phù hợp nhóm sinh viên.",
    area: 16,
    images: ["https://via.placeholder.com/600x400?text=Room+8"],
    amenities: {
      wifi: true,
      furniture: false,
      tv: false,
      washer: false,
      kitchen: false,
      fridge: false,
      ac: false,
    },
    phone: "0956789012",
    available: true,
    location: { type: "Point", coordinates: [105.782, 20.98] },
  },
  {
    title: "Căn hộ mini gần trung tâm thương mại",
    price: 4100000,
    address: "Quận Thanh Xuân, Hà Nội",
    description: "Tiện nghi, đầy đủ đồ dùng sinh hoạt.",
    area: 24,
    images: ["https://via.placeholder.com/600x400?text=Room+9"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washer: true,
      kitchen: true,
      fridge: true,
      ac: true,
    },
    phone: "0918123456",
    available: true,
    location: { type: "Point", coordinates: [105.816, 21.0] },
  },
  {
    title: "Phòng trọ view thoáng mát",
    price: 3500000,
    address: "Quận Tây Hồ, Hà Nội",
    description: "Gần hồ, không gian yên tĩnh.",
    area: 22,
    images: ["https://via.placeholder.com/600x400?text=Room+10"],
    amenities: {
      wifi: true,
      furniture: true,
      tv: true,
      washer: false,
      kitchen: true,
      fridge: true,
      ac: true,
    },
    phone: "0918345678",
    available: true,
    location: { type: "Point", coordinates: [105.8265, 21.05] },
  },
];

async function seed() {
  await connectDB();
  console.log("Connected to DB for seeding");

  // create two landlords if not exist
  const landlords = [
    {
      name: "Chị Lan",
      email: "lan@example.com",
      phone: "0912345678",
      password: "123456",
      role: "landlord",
    },
    {
      name: "Anh Tuấn",
      email: "tuan@example.com",
      phone: "0987654321",
      password: "123456",
      role: "landlord",
    },
  ];

  const createdLandlords = [];
  for (const l of landlords) {
    let user = await User.findOne({ email: l.email });
    if (!user) {
      user = await User.create(l);
    }
    createdLandlords.push(user);
  }

  // Clear existing rooms (optional) - comment out if you don't want to delete
  // await Room.deleteMany({})

  for (let i = 0; i < sampleRooms.length; i++) {
    const r = sampleRooms[i];
    const owner = createdLandlords[i % createdLandlords.length];
    const exists = await Room.findOne({ title: r.title, address: r.address });
    if (exists) continue;
    await Room.create({
      ...r,
      owner: owner._id,
      status: "approved",
      verification: { level: 2 },
    });
  }

  console.log("Seeding finished");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
