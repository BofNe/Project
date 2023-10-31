import { Router } from 'express'
import { loginController, registerController, logoutController } from '../controllers/users.controllers'
import { registerValidator, loginValidator } from '../middlewares/users.middlewares'
import { accessTokenValidator, refreshTokenValidator } from '../middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import { emailVerifyTokenValidator } from '../middlewares/users.middlewares'
import { verifyEmailController } from '../controllers/users.controllers'
import { resendEmailVerifyController } from '../controllers/users.controllers'
import { forgotPasswordValidator } from '../middlewares/users.middlewares'
import { forgotPasswordController } from '../controllers/users.controllers'
import { verifyForgotPasswordTokenValidator } from '../middlewares/users.middlewares'
import { verifyForgotPasswordTokenController } from '../controllers/users.controllers'

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
path: /users/verify-email
method: POST
body: {email_verify_token: string}
 */

userRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(verifyEmailController))
/*
des: resend email verify token 
khi mail thất lạc hoặc  email_verify_token hết hạn hoặc người dùng có nhu cầu resend email_verify_token


method: POST
path: /users/resend-verify-email
header: {Authorization: 'Bearer <access_token>'} // đăng nhập mới được resend
body{}
 */
userRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))

//khi ngừoi dùng quên mật khẩu, họ gửi email xin mình tạo cho họ forgot-password-token
/**
 path: /users/forgot-password
 method: POST
 body: {email}
 */
userRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

/**
 khi người dùng nhấp vào link trong email để đổi mật khẩu
 họ sẽ gửi 1 req kèm theo forgot_password_token lên sever
 sever kiểm tra forgot_password_token co h.Xr hay k?
 sau đó chuyển hướng ngừoi dùng đến trang reset password
 */
userRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

export default userRouter
