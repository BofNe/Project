import { Router } from 'express'
import { loginController, registerController, logoutController } from '../controllers/users.controllers'
import { registerValidator, loginValidator } from '../middlewares/users.middlewares'
import { accessTokenValidator, refreshTokenValidator } from '../middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handler'
import { emailVerifyTokenValidator } from '../middlewares/users.middlewares'
import { verifyEmailController } from '../controllers/users.controllers'
import { resendEmailVerifyController } from '../controllers/users.controllers'
import { forgotPasswordValidator } from '../middlewares/users.middlewares'
import { forgotPasswordController, resetPasswordController } from '../controllers/users.controllers'
import { verifyForgotPasswordTokenValidator } from '../middlewares/users.middlewares'
import { verifyForgotPasswordTokenController } from '../controllers/users.controllers'
import { resetPasswordValidator } from '../middlewares/users.middlewares'
import { getMeController } from '../controllers/users.controllers'
import { verifiedUserValidator } from '../middlewares/users.middlewares'
import { updateMeController } from '../controllers/users.controllers'
import { updateMeValidator, unfollowValidator } from '../middlewares/users.middlewares'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/requests/User.request'
import { getProfileController, unfollowController } from '../controllers/users.controllers'
import { followValidator, changePasswordValidator } from '../middlewares/users.middlewares'
import { followController, changePasswordController, refreshTokenController } from '../controllers/users.controllers'
import { oAuthController } from '../controllers/users.controllers'

const userRouter = Router()

/*
des: đăng nhập
path: /users/login
method: POST
body: {email, password}
*/
userRouter.post('/login', loginValidator, wrapAsync(loginController))

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
/*
des: reset password
path: '/reset-password'
method: POST
Header: không cần, vì  ngta quên mật khẩu rồi, thì sao mà đăng nhập để có authen đc
body: {forgot_password_token: string, password: string, confirm_password: string}
*/
userRouter.post(
  '/reset-password',
  resetPasswordValidator,
  verifyForgotPasswordTokenValidator,
  wrapAsync(resetPasswordController)
)

/*
des: get profile của user
path: '/me'
method: get
Header: {Authorization: Bearer <access_token>}
body: {}
*/
userRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))

userRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

/*
des: get profile của user khác `bằng` username
path: '/:username'
method: get
không cần header vì, chưa đăng nhập cũng có thể xem
*/
userRouter.get('/:username', wrapAsync(getProfileController))
//chưa có controller getProfileController, nên bây giờ ta làm

/*
des: Follow someone
path: '/follow'
method: post
headers: {Authorization: Bearer <access_token>}
body: {followed_user_id: string}
*/
userRouter.post('/follow', accessTokenValidator, verifiedUserValidator, followValidator, wrapAsync(followController))

//accessTokenValidator dùng dể kiểm tra xem ngta có đăng nhập hay chưa, và có đc user_id của người dùng từ req.decoded_authorization
//verifiedUserValidator dùng để kiễm tra xem ngta đã verify email hay chưa, rồi thì mới cho follow người khác
//trong req.body có followed_user_id  là mã của người mà ngta muốn follow
//followValidator: kiểm tra followed_user_id truyền lên có đúng định dạng objectId hay không
//  account đó có tồn tại hay không
//followController: tiến hành thao tác tạo document vào collection followers
/**
 * user654b59016b93aac20d647ebe 40
 * user654b5aa05d99b6140ab0115f 44
 */

/*
    des: unfollow someone
    path: '/follow/:user_id'
    method: delete
    headers: {Authorization: Bearer <access_token>}
  g}
    */
userRouter.delete(
  '/unfollow/:user_id',
  accessTokenValidator,
  verifiedUserValidator,
  unfollowValidator,
  wrapAsync(unfollowController)
)

//change password
/**
 * des: change password
 * path: /change-password
 * method: put
 * header: {Authorization: Bearer <access_token>}
 * body: {old_password: string, new_password: string, confirm_password: string}
 * */
userRouter.put(
  '/change-password',
  accessTokenValidator,
  verifiedUserValidator,
  changePasswordValidator,
  wrapAsync(changePasswordController)
)

/*
  des: refreshtoken
  path: '/refresh-token'
  method: POST
  Body: {refresh_token: string}
g}
  */
userRouter.post('/refresh-token', refreshTokenValidator, wrapAsync(refreshTokenController))
//khỏi kiểm tra accesstoken, tại nó hết hạn rồi mà
//refreshController chưa làm
userRouter.get('/oauth/google', wrapAsync(oAuthController))

export default userRouter
