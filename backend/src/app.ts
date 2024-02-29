// This is the server File . The server starts from this file



import express from "express";

import cors from "cors";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import path from "path";

const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"../../frontend/dist")))


// --> Routes import 

import userRoutes from './routes/userRoutes'
import myHotelRoutes from './routes/myHotelRoutes'

app.use('/api/users',userRoutes)   // ---> user routes
app.use('api/my-hotels',myHotelRoutes) // --> my hotel routes




export {app}