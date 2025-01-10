import {v2 as cloudinary} from "cloudinary";
import fs from "fs"

//   Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,  
    });
    

    const uplonOnCloudinary =  async (localFilePath) => {
        try {
            if (!localFilePath) return null
            // uplod the file on cloudinary
            const response = await cloudinary.uploader.upload(localFilePath, {
                resource_type: "auto"
            })
            //file has been uploded sucess fully 
            // console.log("file is uploded on cloudinery ", response.url)
            fs.unlinkSync(localFilePath)
            // console.log(response)
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload oparation got failed
            return null
        }
    }


    export {uplonOnCloudinary};

