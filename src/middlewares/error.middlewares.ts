import { Request, Response, NextFunction } from 'express'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { omit } from 'lodash'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  //loi tu cac noi se don ve
  //nếu lôi nhận dc thuộc dạng ErrorWithStatus thì trả về status và message
  if (err instanceof ErrorWithStatus) {
    return res.status(err.status).json(omit(err, [`status`]))
  }
  //còn nếu lọt xuôngs đây thì error là lõi mặc định
  //err{mess, stack, name}
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  })
  //ném lỗi nó cho người dùng
  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, [`status`])
  })
}
