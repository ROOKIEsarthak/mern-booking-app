// This is the server File . The server starts from this file



import express from "express";

import cors from "cors";
import "dotenv/config";
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}))
app.use(cookieParser())


// --> Routes import 

import UserRoutes from './routes/userRoutes'

app.use('/api/users',UserRoutes)




export {app}