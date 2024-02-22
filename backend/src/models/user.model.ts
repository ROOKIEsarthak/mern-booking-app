import mongoose from 'mongoose'
import { Request,Response } from 'express';

import bcrypt from 'bcryptjs'

export type UserType = {
    _id: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
};

// generating access and refresh token for login and logout functionality

// const generateAccessAndRefreshTokens=async(userId : string)=>{

//     try {
//         const
        
//     } catch (error) {
        
//     }



// }

// --> creating a user Schema layout

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true,
    },
    firstName:{
        type:String,
        required: true,
    },
    password:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required: true,
    }

},{timestamps:true})


// ---> encrypting the password just before creating the userSchema

userSchema.pre("save" ,async function (next){

    if (!this.isModified("password"))
    {
        return next()
    }

    this.password = await bcrypt.hash(this.password,10)
    next()

})





// ---->  creating a new user Schema 

export const User = mongoose.model<UserType>("User",userSchema);



