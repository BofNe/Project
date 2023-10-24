import { Router } from 'express'
import { loginValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'
import { registerValidator } from '../middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
const userRouter = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
userRouter.post('/login', loginValidator, loginController)

userRouter.post('/register', registerValidator, wrapAsync(registerController))

export default userRouter
