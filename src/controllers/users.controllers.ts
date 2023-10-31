import { Request, Response } from 'express'
import usersService from '../services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { LogoutReqBody, RegisterReqBody } from '../models/requests/User.request'
import User from '../models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '../constants/messages'
import databaseService from '../services/database.services'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'
import { TokenPayload } from '~/models/requests/User.request'
import { UserVerifyStatus } from '~/constants/enums'

export const loginController = async (req: Request, res: Response) => {
  //lấy user_od từ user của req
  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng user_id tạo access_token và refresh_token
  const result = await usersService.login(user_id.toString())
  //res về acccess_token và refresh_token
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, LogoutReqBody>, res: Response) => {
  //lấy refresh_token từ body
  const refresh_token = req.body.refresh_token
  //gọi hàm logout, hàm nhận vào refresh_token tìm và xoá

  const result = await usersService.logout(refresh_token)
  res.json(result)
}

export const verifyEmailController = async (req: Request, res: Response) => {
  //nếu mà code vào dc đây nghĩa là email_verify_token đã hợp lệ và mình đã lấy được
  //decode email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  //dựa vào user_id tìm user và xem thủ đã verify chưa
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INVALID,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  //nếu mà xuống dc đây thì có nghĩa là chưa verify email
  //mình sẽ update lại user đó
  const result = await usersService.verifyEmail(user_id)
  res.json({
    message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
    result
  })
}
