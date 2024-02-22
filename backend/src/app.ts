// This is the server File . The server starts from this file



import express from "express";

import cors from "cors";
import "dotenv/config";

const app = express()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))
app.use(cors())


// --> Routes import 

import UserRoutes from './routes/userRoutes'

app.use('/api/users',UserRoutes)




export {app}