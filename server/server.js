import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import userRouter from "./routes/userRoutes.js"
import imageRouter from "./routes/imageRoute.js"

//App Config
const app = express()
const PORT = process.env.PORT || 4000
connectDB()

//middlewares
app.use(express.json())
app.use(cors())

//Api endpoints
app.use('/api/user', userRouter)
app.use('/api/image', imageRouter)
app.get('/', (req,res)=> res.send("API Working"))

app.listen(PORT, ()=> console.log('Server running on port : ' + PORT ))

