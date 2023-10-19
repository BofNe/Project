//giả xử anh đang làm route '/login'
// thì người dùng sẽ truyền email và password
// tạo 1 req có body là email và password
// làm 1 middleware kiểm tra email và password có đc chuyền lên ko

import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '../utils/validation'
import userService from '../services/users.services'
export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({
      error: 'Missing email or password'
    })
  }
  next()
}
//khi register thì
//ta sẽ cps 1 req.body gồm
//{
//name:string
// email:string
// password:string
//confirm_password:string,
//date_of_birth:ISO8601
//}
export const registerValidator = validate(
  checkSchema({
    name: {
      notEmpty: true,
      isString: true,
      trim: true,
      isLength: {
        options: { min: 1, max: 100 }
      }
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      custom: {
        options: async (value, { req }) => {
          const isExistEmail = await userService.checkEmailExist(value)
          if (isExistEmail) {
            throw new Error('Email already exists')
          }
          return true
        }
      }
    },
    password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 8, max: 50 }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: true //chấm điểm đối với password
        }
      },
      errorMessage: 'Password is not strong enough'
    },
    confirm_password: {
      notEmpty: true,
      isString: true,
      isLength: {
        options: { min: 8, max: 50 }
      },
      isStrongPassword: {
        options: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: true //chấm điểm đối với password
        }
      },
      errorMessage: 'confirm_Password is not strong enough',
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('confirm_Password does not match')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: {
        options: { strict: true, strictSeparator: true }
      }
    }
  })
)
