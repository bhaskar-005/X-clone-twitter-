'use server'
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
  });

const uploadCloudinary = async(path:any)=>{
    try {
        if (!path) {
            return null;
        }
        
        const res = await cloudinary.uploader.upload(path);
        if (res) {
           return res.secure_url;
        }
     
    } catch (error) {
        console.log(error);
        
    }
}
export default uploadCloudinary;