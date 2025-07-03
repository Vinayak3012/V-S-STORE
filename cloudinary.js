require("dotenv").config();

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "V-S_DEV",  //Cannot include special characters like &, @, ?, #, =, spaces, etc.
    allowedFormats: ["png", "jpeg", "jpg"],
  },
});

module.exports = {
  cloudinary,
  storage,
};
