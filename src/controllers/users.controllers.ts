import { Request, Response } from 'express'
import usersService from '../services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '../models/requests/User.request'
export const loginController = async (req: Request, res: Response) => {
  //lấy user_id tùe user của req
  const { user }: any = req
  const user_id = user._id
  // dùng user id tạo access token và refresh token
  const result = await usersService.login(user_id.toString())
  //res về access token và refresh token cho client
  res.json({
    message: 'login successfully',
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.json({
    message: 'register successfully',
    result
  })
}
