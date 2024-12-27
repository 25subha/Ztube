import { Router } from "express";
import { ragisterUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/ragister").post( upload.fields([
    {Name: "avatar",
    maxCount:1
    },
    {Name: "coverImage",
        maxCount:1
    }
]), ragisterUser)

export default router;