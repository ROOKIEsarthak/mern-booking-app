import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";
import { NextFunction, Request,Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express{
        interface Request {
            userId: string;
        }
    }
}


const verifyToken = asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{

    
    try {

        const token = req.cookies["auth_token"];

        if(!token)
        {
            throw new ApiError(401," Unauthorized Request")
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY as string)
        req.userId = (decodedToken as JwtPayload).userId


        next()
        
    } catch (error) {
        throw new ApiError(401,"Invalid Token !!")
        // console.log("Invalid Token");
        
    }

})

export default verifyToken