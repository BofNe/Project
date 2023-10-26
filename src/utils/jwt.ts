import jwt from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.request'

import { config } from 'dotenv'
config()

export const signToken = ({
  payload,
  privatekey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privatekey?: string
  options?: jwt.SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privatekey, options, (error, token) => {
      if (error) throw reject(error)
      resolve(token as string)
    })
  })
}

//hàm kiểm tra token có phải của mìh tạo ra ko
//nếu có thì trả ra payload
export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (error, decoded) => {
      if (error) throw reject(error)
      resolve(decoded as TokenPayload)
    })
  })
}
