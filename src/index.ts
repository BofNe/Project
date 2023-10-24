import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { Request, Response, NextFunction } from 'express'
import { defaultErrorHandler } from './middlewares/error.middlewares'
const app = express()
app.use(express.json())
const PORT = 3000
databaseService.connect()

//rout măc định
app.get('/', (req, res) => {
  res.send('Hello Ní!')
})

app.use('/users', userRouter)
//localhost:3000/users/tweets

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(`error handler tong ne`)
  res.status(err.status).json({ message: err.message })
})

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`sever đang mở trên port:${PORT}`)
})
