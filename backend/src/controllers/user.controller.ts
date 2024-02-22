//import { cors } from 'cors';
import bcrypt from 'bcryptjs';

import {Request,Response } from "express";
import {User} from "../models/user.model";
import jwt from 'jsonwebtoken'
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/AsyncHandler";




// --> test user controller
const testUser = asyncHandler(async(req:Request,res:Response)=>{
    res.json({message:`Hello from express endpoint port : ${process.env.PORT} !!`})
})

// --> register user controller
const registerUser = asyncHandler(async(req:Request , res:Response) =>{
    
    try {

        // --> check if user present or not  

        const {firstName, username ,lastName , email , password } = req.body

        let existedUser = await User.findOne({
            email:req.body.email,
        });

        if(existedUser){
            throw new ApiError(409," User with same email or username already exists")
        }

        // --> create new user if user not present

        const newUser = await User.create({
            email,
            username,
            firstName,
            lastName,
            password
        })

        const createdUser = await User.findById(newUser._id).select(
            "-password"
        )

        console.log("Created User -: ",createdUser);

        if(!createdUser)
        {
            throw new ApiError(
                500,
                "Something went wrong while registering the user"
            )
        }


        // ---> creating  a jwt token and cookie for authentication

        const token = jwt.sign(
            { newUserId: newUser.id },
            process.env.JWT_SECRET_KEY as string,{
                expiresIn:"1d"
            }
        );

        res.cookie("auth_token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000
        })

        return res.status(201).json(
            new ApiResponse(200, createdUser ," User Registered Successfully")
        );

        
    } catch (error) {
        console.log(error);
        
        res.status(500).send({message:"Something went wrong !!"})
        
    }
})


const loginUser = asyncHandler(async(req:Request,res:Response)=>{

    
    const {email,username,password} = req.body;

    try {

        // --> check if user present or not in the database

        if(!(username || email))
        {
            throw new ApiError(400, " Username or Email is required")
        }

        const user = await User.findOne({
            $or:[{email},{username}]
        })

        if(!user){
            throw new ApiError(404,"Invalid Credentials")
        }

        // --> check password authentication
        const isMatch =  await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
            throw new ApiError(404,"Invalid Credentials")
        }

        const token = jwt.sign(
            {userID: user._id},
            process.env.JWT_SECRET_KEY as string,{
                expiresIn:"1d"
            }
        );

        res.cookie("auth_token",token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production" ,
            maxAge: 86400000,
        })
        
        res
        .status(200)
        .json(
            new ApiResponse(200, {userId:user._id}," User Logged in Successfully")
        )


    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Something went wrong"})
    }
    
})


export {
    testUser,
    registerUser,
    loginUser
}