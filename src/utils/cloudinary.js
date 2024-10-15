import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

/* 
    1. We are taking file from user 
    2. Upload it on local server
    3. Upload file from local to cloudinary or any remote server
    4. Unlink file from directory / Removing file
 */

// Configuration of Cloudinary Setup
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Write a function to handle uploading file
const uploadOnCloudinary = async (localFilePath, folder) => {
  try {
    if (!localFilePath) return null;

    // Upload file on cloudinary now
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder
    });
    // Unlink file from directory structure make space available for overriding files
    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    // Removing file from local server if it return any error
    fs.unlinkSync(localFilePath);
    return null;
  }
};

export { uploadOnCloudinary };
