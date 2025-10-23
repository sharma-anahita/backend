import {Router} from 'express'
import { registerUser } from '../controllers/user.controller.js'

const router = Router()

router.route('/register').post(registerUser)
//this url will be like "https:localhost:800/api/v1/users/register"
//router.route('/login').post(loginUser)

export default router