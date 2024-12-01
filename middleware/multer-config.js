// multer-config.js
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

const upload = multer({ storage: storage }).single("image");

const convertToWebP = (req, res, next) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const outputFileName = `${req.file.filename.split(".")[0]}.webp`;
  const outputPath = path.join("images", outputFileName);

  sharp(inputPath)
    .webp({ quality: 50 })
    .toFile(outputPath)
    .then(() => {
      fs.unlinkSync(inputPath);
      req.file.filename = outputFileName;
      req.file.path = outputPath;
      next();
    })
    .catch((err) => {
      console.error("Erreur de conversion en WebP :", err);
      res.status(500).json({ error: "Erreur de conversion d'image" });
    });
};

module.exports = { upload, convertToWebP };