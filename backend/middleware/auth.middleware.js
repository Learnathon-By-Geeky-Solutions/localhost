import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const protectRoute = async(req,res,next)=>{

    try {
        const token = req.cookies.jwt;  //jwt was the name in utils

        if(!token){
            return res.status(401).json({message:"Unauthorized- no token provided"}); 
        }

        const decodeToken = jwt.verify(token,process.env.JWT_SECRET);

        if(!decodeToken) res.status(401).json({message:"Unauthorized- invalid token"}); 

        const user = await User.findById(decodeToken.userId).select("-password");
        //while creating token, this was the name: userId in the parameter
        //copying that user except password, so "-password";

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        req.user = user; 
        // req didn't have user property, its creating req.user for this specific one

        next();


    } catch (error) {
        console.log("error in protect route middleware: ",error.message);
        res.status(500).json({message:"Internal server error"});        
    }

}