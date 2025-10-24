import {Router} from 'express'
import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'
import { verifyJWT } from '../middleware/auth.middleware.js'

const router = Router()

router.route('/register').post(
    upload.fields([
        {
            name:"avatar", //name of feild on front-end
            maxCount:1 //will only accept one feild in this
        },{
            name:"coverImage",
            maxCount:1
        }
    ]),
    registerUser)
//this url will be like "https:localhost:800/api/v1/users/register"
//router.route('/login').post(loginUser)

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT,logoutUser);

router.route("/refresh-token").post(refreshAccessToken)
export default router