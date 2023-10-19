import express from 'express'
import userRouter from './routes/users.routes'
import databaseService from './services/database.services'
const app = express()
app.use(express.json())
const PORT = 3000
databaseService.connect()

//rout măc định
app.get('/', (req, res) => {
  res.send('Hello Ní!')
})

app.listen(PORT, () => {
  console.log(`sever đang mở trên port:${PORT}`)
})

app.use('/users', userRouter)
//localhost:3000/users/tweets
