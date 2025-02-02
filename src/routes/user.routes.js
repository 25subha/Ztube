import { Router } from "express";
import { ragisterUser, loginUser, logOutUser, refreshAccessToken } from "../controllers/user.controller.js";
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


export default router;