import { Request, Response } from 'express'
import usersService from '../services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterReqBody } from '../models/requests/User.request'
export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'lehodiep.1999@gmail.com' && password === '123123123') {
    return res.json({
      data: [
        { fname: 'Điệp', yob: 1999 },
        { fname: 'Hùng', yob: 2003 },
        { fname: 'Được', yob: 1994 }
      ]
    })
  } else {
    return res.status(400).json({
      error: 'login failed'
    })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await usersService.register(req.body)
    console.log(result)
    return res.status(400).json({
      message: 'Register success',
      result: result
    })
  } catch (error) {
    res.status(400).json({
      message: 'register fail',
      error
    })
  }
}
