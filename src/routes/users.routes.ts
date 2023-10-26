import { Router } from 'express'
import { loginValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'
import { registerValidator } from '../middlewares/users.middlewares'
import { accessTokenValidator, refreshTokenValidator } from '../middlewares/users.middlewares'
import { logoutController } from '../controllers/users.controllers'
import { wrapAsync } from '~/utils/handler'
const userRouter = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
userRouter.get('/login', loginValidator, wrapAsync(loginController))

userRouter.post('/register', registerValidator, wrapAsync(registerController))

/*
des: dang xuất
path: /users/logout
method: POST
Header :{Authorization: 'Bearer <token>'}
body: {refresh_token: string}
*/
userRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))
export default userRouter
