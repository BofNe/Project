import { Router } from 'express'
import { loginValidator } from '../middlewares/users.middlewares'
import { loginController, registerController } from '../controllers/users.controllers'
import { registerValidator } from '../middlewares/users.middlewares'
const userRouter = Router()

userRouter.get('/login', loginValidator, loginController)

userRouter.post('/register', registerValidator, registerController)

export default userRouter
