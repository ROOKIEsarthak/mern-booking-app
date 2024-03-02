
import multer  from 'multer';
import { asyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { Request,Response } from "express";
import bcrypt from "bcryptjs"
import cloudinary from "cloudinary"
import { Hotel} from '../models/hotel.model';
import { HotelType } from '../shared/types';
import { upload } from '../middlewares/multer.middleware';







const addMyHotels = asyncHandler(async(req:Request,res:Response)=>{

    try {
        const imageFiles = req.files as Express.Multer.File[]
        const newHotel: HotelType = req.body;

        // 1-: upload images on cloudinary  

        const imageUrls = await uploadImages(imageFiles);


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

const updateMyHotels = asyncHandler(async(req:Request,res:Response)=>{

    const id = req.params.id.toString()

    try {

        const hotel = await Hotel.findOne({
            _id: id,
            userId: req.userId
        })

        res.json(hotel)


    } catch (error) {
        res.status(500).json({messsage:" Error Fetching Hotels !! "})    
    }


})

const updateHotelImages = asyncHandler(async(req:Request,res:Response)=>{

    try {

        const updatedHotel : HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate({
            _id: req.params.hotelId,
            userId: req.userId,

        }, 
        updatedHotel,
        { new:true })

        if(!hotel){
            return res.status(404).json({message:"Hotel not Found !!"})
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || []),]

        await hotel.save();

        res.status(201).json(hotel)

        

    } catch (error) {
        res.status(500).json({message:"Something Went Wrong!!"})
    }
    
})




async function uploadImages(imageFiles: Express.Multer.File[]) {
    const uploadPromises = imageFiles.map(async (image) => {
        const b64 = Buffer.from(image.buffer).toString("base64");
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        console.log(res.url);
        return res.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
}



export {
    addMyHotels,
    getMyHotels,
    updateMyHotels,
    updateHotelImages
}