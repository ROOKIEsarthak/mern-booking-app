// This is the server File . The server starts from this file



import express ,{Request,Response} from "express";

import cors from "cors";
import "dotenv/config";
import cookieParser from 'cookie-parser'
import path from "path";

import {v2 as cloudinary} from "cloudinary"


cloudinary.config({  

    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 

})



const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}))
app.use(cookieParser())

// bundle frontend to backend
app.use(express.static(path.join(__dirname,"../../frontend/dist")))


// --> Routes import 

import userRoutes from './routes/userRoutes'
import myHotelRoutes from './routes/myHotelRoutes'

app.use('/api/users',userRoutes)   // ---> user routes
app.use('/api/my-hotels',myHotelRoutes) // --> my hotel routes

app.get("*",(req:Request,res:Response)=>{
    res.sendFile(path.join(__dirname,"../../frontend/dist/index.html"))
})



export {app}