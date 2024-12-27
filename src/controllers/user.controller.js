import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uplonOnCloudinary } from "../utils/cloudinary.js";
import { ApiRespose } from "../utils/ApiResponse.js";
const ragisterUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty 
    // check if user already exists: userName, email
    // check for images, check for avatar.
    // upload them to cloudinary, avatar check
    // create user object - create entry in db
    // removed password or refresh token fild from response
    // check for user creation (if user null  response or user created sucessfull)
    // return response

    const { userName, email, fullName, password } = req.body
    // console.log(userName, email)
    const userArray = [userName, email, fullName, password]
    if (userArray.some((filds) => 
            filds?.trim() === ""
    )) {
        throw new ApiError(400, "All filds are required");
    }

    const existingUser =await User.findOne({ 
        $or: [{userName}, {email}]
    })
    if (existingUser) {
        throw new ApiError(408, "email or userName alrady exist")
    }

    const avatarLocalpath = req.files?.avatar[0]?.path
    // console.log(req.files)
    const coverImageLocalpath = req.files?.coverImage[0]?.path

    if (!avatarLocalpath) {
        throw new ApiError(400, "Avatar file is required ");
    }
    const avatar =await uplonOnCloudinary(avatarLocalpath)
    const coverImage =await uplonOnCloudinary(coverImageLocalpath)
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required ");  
    }
    
    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        avater: avatar.url,
        coverImage: coverImage?.url || "",
        password
    });
    //user are create or not chack
    const creatUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!creatUser) {
        throw new ApiError(500, "something went wrong while registring the user")
    }

    return res.status(201).json(
        new ApiRespose(200, creatUser, "user registered sucessfully")
    )
})

export {ragisterUser}