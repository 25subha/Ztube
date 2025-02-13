import { Router } from "express";
import { ragisterUser, loginUser, logOutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updatedUserDetails, updatedUserAvatar, updatedUserCoverImage, getUserChannalProfile, getWatchHistory } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJwt } from "../middlewares/auth.middlewares.js";


const router = Router();

router.route("/ragister").post( upload.fields([
    {
        name: "avatar",
        maxCount:1
    },
    {
        name: "coverImage",
        maxCount:1
    }
]), ragisterUser)

router.route("/login").post(loginUser)
router.route("/logout").post(varifyJwt, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(varifyJwt, changeCurrentPassword ) // i use varyfyJwt because the  user is login so i use veryfyJwt middlwer 
router.route("/current-user").get(varifyJwt, getCurrentUser)
router.route("/update-user").patch(varifyJwt, updatedUserDetails)
router.route("/avatar").patch(varifyJwt, upload.single("avatar"), updatedUserAvatar)
router.route("/coverImage").patch(varifyJwt, upload.single("coverImage"), updatedUserCoverImage)
router.route("/c/:username").get(varifyJwt, getUserChannalProfile)
router.route("watch-history").get(varifyJwt, getWatchHistory)
export default router;