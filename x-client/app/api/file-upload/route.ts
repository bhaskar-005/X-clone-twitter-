import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.formData();
    const file = data.get('file') as unknown as File;

    if (!file) {
        return NextResponse.json({
            message: 'File not found in request',
            success: false
        });
    }
    const buffer = await file.arrayBuffer();
    const bytes = Buffer.from(buffer);
    try {
        const uploadResponse:any = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder:'x-clone'
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            ).end(bytes)
        });

        if (!uploadResponse) {
            return NextResponse.json({
                success: false,
                message: 'Not able to upload to Cloudinary'
            });
        }

        return NextResponse.json({
            success: true,
            url: uploadResponse.secure_url
        });
    } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        return NextResponse.json({
            success: false,
            message: 'Error uploading file to Cloudinary: ' 
        });
    }
}
