import { Router } from 'express'
import { uploadImageController } from '../controllers/medias.controllers'
import { wrapAsync } from '~/utils/handler'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'

const mediasRouter = Router()

mediasRouter.post('/upload-image', accessTokenValidator, verifiedUserValidator, wrapAsync(uploadImageController))

export default mediasRouter
