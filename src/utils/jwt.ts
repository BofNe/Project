import jwt from 'jsonwebtoken'

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
