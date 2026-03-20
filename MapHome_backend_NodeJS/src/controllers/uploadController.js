const path = require("path");

const uploadSingleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    const urlPath = `/uploads/${path.basename(req.file.path)}`;
    res.status(201).json({
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: urlPath,
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

    const data = files.map((file) => ({
      fileName: file.filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${path.basename(file.path)}`,
    }));
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { uploadSingleImage, uploadMultipleImages };
