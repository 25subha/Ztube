import asyncHandler from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js";
import { uplonOnCloudinary } from "../utils/cloudinary.js";
import { ApiRespose } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const genarateAccessTokenOrRefeshToken = async (userId) => {
    try {
        const user = await User.findById(userId) // finde user id by user data 
        const accessToken = await user.generateAccessToken() //ganarae accesstoken calld a mathod(generateAccessToken())
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken // refreshToken add in object(how to add value in object)
        await user.save({validateBeforeSave: false}) // and save the value in user  

        return {accessToken, refreshToken} // return value as a objact

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating accessToken or Refresh Token");
        
    }
   
}

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
    // console.log(req.body)
    const { userName, email, fullName, password } = req.body
    // console.log(userName, email)
    const userArray = [userName, email, fullName, password]
    if (userArray.some((filds) => 
            filds?.trim() === ""
    )) {
        throw new ApiError(400, "All filds are required");
    }

    const existingUser = await User.findOne({ 
        $or: [{userName}, {email}]
    });

    // if (existingUser) {
    //     if (existingUser.userName === userName) {
    //         throw new ApiError(408, "this userName alrady exist")
    //     } else if (existingUser.email === email) {
    //         throw new ApiError(408, "this email alrady exist")
    //     }
       
    // }

    if(existingUser) {
        throw new ApiError(409, "User with email or username already exists")   
     }
   
    //console.log(req.files);
    
    const avatarLocalpath = req.files?.avatar[0]?.path

    // console.log(req.files)
    // const coverImageLocalpath = req.files?.coverImage[0]?.path
    // console.log(coverImageLocalpath)

    let coverImageLocalPath ;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if (!avatarLocalpath) {
        throw new ApiError(400, "avatar file is required ");
    }

    const avatar = await uplonOnCloudinary(avatarLocalpath)
    const coverImage = await uplonOnCloudinary(coverImageLocalPath)

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required ");  
    }
    
    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        avatar: avatar.url,
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

const loginUser = asyncHandler(async (req, res) => {
    // get data from req.body  
    // user name or email have or not
    // user have or not find user
    // cheack password is correct or not
    // is password is wright then access token or refersh token genarate or pass the user 
    // send  cookie  refresh or access token

    const { userName, email, password } = req.body
    // console.log("body", req.body)
    // console.log("userName", userName)
    // console.log("email", email)
    // console.log("password", password)
    if ( !userName && !email ) {
        throw new ApiError(400, "userName or email is required")
    } 

    const user = await User.findOne(
        {
            $or: [ {userName}, {email} ]
        }
    )
    
    if (!user) {
        throw new ApiError(404, "user does not exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password) // this way to check password is correct or not this function is define user model.js
    //console.log('Is password valid?', isPasswordValid);  // Log the result

    if (!isPasswordValid) {
        throw new ApiError(401, "user password invalid") // eighter you can pass invalid user credrntials this message
    }

    const { accessToken, refreshToken } = await genarateAccessTokenOrRefeshToken(user._id)

    const loggedInUser = await User.findById(user._id).select( "-password -refreshToken" )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiRespose(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "user loged in sucessfully"
        )
    )

});

const logOutUser = asyncHandler(async (req, res) => {

    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiRespose(200, {}, "user Logged out "))

});

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

   try {
     const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
     
     const user = await User.findById(decodedToken?._id)
 
     if(!user) {
         throw new ApiError(401, "Invalid refersh token")
     }
 
     if (incomingRefreshToken !== user?.refreshToken) {
         throw new ApiError(401, "Refersh token is expired or used")
     }
 
     const {accessToken, newRefreshToken} = await genarateAccessTokenOrRefeshToken(user._id)
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new ApiRespose(200, 
             {accessToken, refreshToken : newRefreshToken, }
         )
     )
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refreshToken")
   }
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {oldPassword, newPassword} = req.body // get deta from req.body

    const user = await User.findById(req.user?._id)  //find the user 

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword) // matching the password between ispasswordcorrect 
    if (!isPasswordCorrect) {
        throw new ApiError(400, "invalid old password")
    }

    user.password = newPassword // reassigen the newpassword of password fild
    await user.save({validateBeforeSave: false}) // save the password

    return res
    .status(200)
    .json( new ApiRespose(200, {}, "user password changed sucessfully"))
})

const getCurrentUser = asyncHandler(async(req, res) => {
    return res
    .status(200)
    .json(
        new ApiRespose(200, req.user, "Current user fetched sucessfully")
    )
});

const updatedUserDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "all filds are required")
    }

    const user = await User.findByIdAndUpdate(req.user?._id,  // find user in the databace
        {
            $set: {
                fullName, // if you want to do {fullName: fullName, email: email}
                email
            }
        },
        {
            new: true
        }
    ).select("-Password")

    return res
    .status(200)
    .json(
        new ApiRespose(200, user, "User details updated sucessfully")
    )
});

const updatedUserAvatar = asyncHandler(async(req, res) => {
    const avatarLocalPath = req.file?.avatar.path
    if (!avatarLocalPath) {
        throw new ApiError(400, "avtar file is messing")
    }
    const avatar = await uplonOnCloudinary(avatarLocalPath)
    if (!avatar.url) {
        throw new ApiError(400, "Error while uploding on avatar");
        
    }
    const user = await User.findByIdAndUpdate(req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiRespose(200, user, "avatar updated sucessfully")
    )
});

const updatedUserCoverImage = asyncHandler(async(req, res) => {
    const coverImageLocalPath = req.file?.path
    if(!coverImageLocalPath) {
        throw new ApiError(400, "cover image file is messing");
        
    }

    const coverImage = await uplonOnCloudinary(coverImageLocalPath)

    if (!coverImage.url) {
        throw new ApiError(400, "Error while uploding on cover Image ");
    }

    const user = await User.findByIdAndUpdate(req.user?._id,
        {$set: {
            coverImage: coverImage.url
        }},
        {new: true}
    ).select("-password")

    return res
    .status(200)
    .json(
        new ApiRespose(200, user, "cover image updated sucessfully")
    )

});

const getUserChannalProfile = asyncHandler(async(req, res) => {
    const {userName} = req.params.body

    if(!userName?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channal = await User.aggregate([
        {
            $match: {
                userName: userName?.toLowerCase() //at first match the user
            }
        }, 
        {
            $lookup: {
                from: "subscriptions",  //how many subscriber found count this subscriber throw the channal
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",// how many subscribe to you found throw the subscriber
                localField: "_id",
                foreignField: "subscriber",
                as: "subescribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers" //subscribe to you,  how many subscriber to you count
                },
                channalSubescribedToCount: {  
                    $size: "$subescribedTo"  // subscriber how many subscriber are there
                },
                isSubescribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]}, // subscribed or not
                        then: true,
                        else: false
                    }
                }
            }
        },
       {
            $project: {
                fullName: 1,
                userName: 1,
                coverImage: 1,
                avatar: 1,
                subscribersCount: 1,
                channalSubescribedToCount: 1,
                isSubescribed: 1,
                email: 1
            }
       }
    ])

    console.log(channal)

    if (!channal?.length) {
        throw new ApiError(400, "channal does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiRespose(200, channal[0], "User channal fatched sucessfully")
    )
});

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        }, 
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        userName: 1,
                                        avatar: 1,

                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "owner"
                }
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiRespose(200, user[0].watchHistory, "wathHistory fetched sucessfully")
    )
})

export {
    ragisterUser,
    loginUser,
    logOutUser,
    refreshAccessToken, 
    changeCurrentPassword,
    getCurrentUser,
    updatedUserDetails,
    updatedUserAvatar,
    updatedUserCoverImage,
    getUserChannalProfile,
    getWatchHistory
}