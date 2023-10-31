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

/*
des: verify email token
khi người dùng đăng ký hị sẽ nhận dc mail có link dạng 
http://localhost:3000/users/verify-email?token=<token>
nếu mà nhấp vào link thì sẽ tạo ra request gửi lên email_verify_token lên sever 
sever kiểm tra email_verify_token có hợp lệ hay ko
nếu hợp lệ từ decode_email_verify_token lấy used_id
và vào user_id đó để update email_verify_token thành '', verify = 1, update_at
 */

export default userRouter
