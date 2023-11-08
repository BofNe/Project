import { Request, Response, Router } from 'express'
import { severImageController } from '../controllers/medias.controllers'
const staticRouter = Router()

staticRouter.get('/image/:namefile', severImageController)

export default staticRouter
