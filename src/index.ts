import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
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

app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`sever run in port:${PORT}.....`)
})
