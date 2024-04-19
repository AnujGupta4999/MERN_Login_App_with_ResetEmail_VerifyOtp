import {v2 as cloudinary} from 'cloudinary';
import ENV from '../config.js'
import fs from 'fs';
cloudinary.config({ 
  cloud_name:ENV.CLOUDINARY_CLOUD_NAME, 
  api_key: ENV.CLOUDINARY_API_KEY, 
  api_secret: ENV.CLOUDINARY_API_SECRET 
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Check if the file exists before attempting to upload
        if (!fs.existsSync(localFilePath)) {
            throw new Error('Local file does not exist');
        }

        // Upload the file on Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // File has been uploaded on Cloudinary, now delete the local file
        fs.unlinkSync(localFilePath);
        return response;

    } catch (e) {
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}

export { uploadOnCloudinary };