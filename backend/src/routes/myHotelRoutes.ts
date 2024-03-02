
// this is the hotel route for user to seach and navigate through his hotels


import { Router ,Request,Response, NextFunction} from "express";

import { 
    addMyHotels,
    getMyHotels,
} from '../controllers/myHotel.controller';

import { upload } from '../middlewares/multer.middleware';
import verifyToken from '../middlewares/auth.middleware';
import { body } from 'express-validator';

const router = Router()

// api/my-hotels --> endpoint  #This is the endpoint for user to register his hotel on the website
router.route("/").post(verifyToken,[

    body("name").notEmpty().withMessage("Name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("type").notEmpty().withMessage("Type is required"),
    body("pricePerNight").notEmpty().isNumeric().withMessage("Price per night is required and must be a number"),
    body("facility").notEmpty().isArray().withMessage("Facilities is required"),


],upload.array("imageFiles",6),addMyHotels)

// # This is the endpoint for the user to get and edit his hotels on the website

router.route("/").get(verifyToken,getMyHotels)

export default router