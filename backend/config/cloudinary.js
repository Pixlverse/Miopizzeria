const cloudinary = require("cloudinary").v2;

const cloudName = process.env.CLOUDINARY_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

// Uploads are refused (rather than failing cryptically) when the keys are missing.
const isConfigured = () => Boolean(cloudName && apiKey && apiSecret);

module.exports = { cloudinary, isConfigured, cloudName, apiKey };
