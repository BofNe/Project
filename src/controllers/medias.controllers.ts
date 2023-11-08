import { Request, Response, NextFunction } from 'express'
import MediasService from '../services/medias.services'
import { USERS_MESSAGES } from '~/constants/messages'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
import { error } from 'console'

// console.log(__dirname) //log thử để xem
// console.log(path.resolve()) //D:\toturalReact2022\nodejs-backend\ch04-tweetProject
// console.log(path.resolve('uploads')) //D:\toturalReact2022\nodejs-backend\ch04-tweetProject\uploads

export const uploadImageController = async (req: Request, res: Response) => {
  const url = await MediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_MEDIA_SUCCESS,
    result: url
  })
}

export const severImageController = async (req: Request, res: Response) => {
  const { namefile } = req.params
  res.sendFile(path.resolve(UPLOAD_DIR, namefile), (error) => {
    if (error) {
      res.status((error as any).status).send('Not found image')
    }
  })
}
