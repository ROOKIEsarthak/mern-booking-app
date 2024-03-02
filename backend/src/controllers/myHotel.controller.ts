
import multer  from 'multer';
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Request,Response } from "express";
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary"
import { HotelType ,Hotel} from '../models/hotel.model';
import { waitForDebugger } from 'inspector';






const addMyHotels = asyncHandler(async(req:Request,res:Response)=>{

    try {
        const imageFiles = req.files as Express.Multer.File[]
        const newHotel: HotelType = req.body;

        // 1-: upload images on cloudinary  

        const uploadPromises = imageFiles.map(async(image)=>{
            const b64 = Buffer.from(image.buffer).toString("base64")
            let dataURI = "data:" + image.mimetype + ";base64,"+ b64
            const res = await cloudinary.v2.uploader.upload(dataURI)
            console.log(res.url);
            return res.url
        })

        const imageUrls = await Promise.all(uploadPromises)

        

        // 2-: if upload successfull , add the URLs to the new hotel


        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId;




        // 3-: save the new hotel in our database

        const hotel = new Hotel(newHotel);

        // 4-: return a 201 status

        await hotel.save();
        res.status(201).send(hotel);
        
    } catch (error) {
        console.log(" Error creating hotel: ",error);

        throw new ApiError(500,"Error in hotel API !!")
        
    }
})

const getMyHotels = asyncHandler(async(req:Request,res:Response)=>{

    try {

        const hotels = await Hotel.find({userId: req.userId})
        res.json(hotels);

    } catch (error) {
        res.status(500).json({message:"Error fetching Hotels"})
        
    }


})

export {
    addMyHotels,
    getMyHotels,
}