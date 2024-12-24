import {asyncHandler} from "../utils/asyncHandler.js";

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
    console.log(userName)

    res.status(200).json({
        message: "ok"
    })
})

export {ragisterUser}