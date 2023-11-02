import { RequestHandler, Request, Response, NextFunction } from 'express'

export const wrapAsync = <p>(func: RequestHandler<p>) => {
  return async (req: Request<p>, res: Response, next: NextFunction) => {
    //tao cấu trúc try catch
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
