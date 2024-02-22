import {User} from "../models/user.model";

import { loginUser, registerUser, testUser } from "../controllers/user.controller";
import { Router ,Request,Response, NextFunction} from "express";

import  { check,validationResult } from "express-validator"

const router = Router()


// --> test user route
router.route('/test').post(testUser)

// --> register user route with check middleware 

router.post('/register',[
    check("firstName"," First Name is required").isString(),
    check("lastName","Last Name is required").isString(),
    check("email","Email is required").isEmail(),
    check("password","Password with 6 or more characters required").isLength({min:6})
],(req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
},registerUser);


// --> login user route 

router.post('/login',[
    check("email","email is required").isEmail(),
    check("password","Password with 6 or more characters required").isLength({min:6})
],(req:Request,res:Response,next:NextFunction)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next()
},
loginUser)

export default router

