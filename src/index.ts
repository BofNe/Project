import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import mediasRouter from './routes/medias.routes'
import { initFolder } from './utils/file'
import staticRouter from './routes/statics.routes'

const app = express()
app.use(express.json())
const PORT = process.env.PORT || 4000
initFolder()
databaseService.connect()

//rout măc định
app.get('/', (req, res) => {
  res.send('Hello Ní!')
})
//////////////////
app.use('/users', userRouter)
app.use('/medias', mediasRouter)
// app.use('static/', express.static(UPLOAD_DIR))
app.use('/static', staticRouter)

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`sever run in port:${PORT}.....`)
})
