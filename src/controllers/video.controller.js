// import { ApiError } from "../utils/ApiError.js";
// import asyncHandler from "../utils/asyncHandler.js";
// import { uplonOnCloudinary } from "../utils/cloudinary.js";
// import { Video } from "../models/video.model.js";




// //video uplod
// // video gets
// //video updated
// // video deleet


// //
// const createVideo = asyncHandler(async(req, res) => {
//     const {title, description, duration, owner} = req.body

//     const videoArray = [title, description, duration, owner]
//     if (videoArray.some((filds) => {
//         filds?.trim() === ""
//     })) {
//         throw new ApiError(400, "all video filds are required")
//     }

//     const videoFilePath = req.files?.videoFile[0]?.path

//     if (!videoFilePath) {
//         throw new ApiError(400, "video File path is required")
//     }

//     const videoFile = await uplonOnCloudinary(videoFilePath)
//     if (!videoFile) {
//         throw new ApiError(400, "video file is required ");  
//     }
    
//     const thubmnalFilePath = req.files?.thubmnal[0]?.path

//     if(!thubmnalFilePath) {
//         throw new ApiError(400, "thubmnal file path is required")
//     }

//     const thubmnal = await uplonOnCloudinary(thubmnal)

//     if (!thubmnal) {
//         throw new ApiError(400, "thubmnal file is required")
//     }
//     const video = await Video.create({
//         title,
//         description,
//         duration,
//         owner,
//         videoFile : videoFile.url ,
//         thubmnal: thubmnal.url
//     })
// })