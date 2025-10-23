import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js'
import { upload } from '../middleware/multer.middleware.js'

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

export default router