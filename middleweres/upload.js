// upload.js
const multer = require("multer");

const storage = multer.memoryStorage(); // for cloudinary stream upload
const upload = multer({ storage });

module.exports = upload;
