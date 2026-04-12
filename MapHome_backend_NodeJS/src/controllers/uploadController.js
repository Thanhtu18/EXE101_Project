const { uploadToCloudinary } = require("../services/cloudinaryService");

const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    res.status(201).json({
      fileName: result.public_id,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: result.secure_url,
      cloudinaryId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadMultipleImages = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length)
      return res.status(400).json({ message: "No files uploaded" });

    // Upload all files to Cloudinary in parallel
    const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer));
    const results = await Promise.all(uploadPromises);

    const data = results.map((result, index) => ({
      fileName: result.public_id,
      originalName: files[index].originalname,
      mimeType: files[index].mimetype,
      size: files[index].size,
      url: result.secure_url,
      cloudinaryId: result.public_id,
    }));

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadSingleImage, uploadMultipleImages };
