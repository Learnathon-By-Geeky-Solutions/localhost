import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const register = async (req,res)=>{
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        return res.json({
            success:false,
            message: "Missing required info"
        })
    }

    try {

        // const existingUser = await userModel.findOne({email}); ///undo when database is ready
        const existingUser = false; /// remove this line when database is ready


        if(existingUser){
            return res.json({
                success:false,
                message: "user already exist"
            });
        }

        const hashedPass = await bcrypt.hash(password,10);  //10, encryption level, bigger number stronger but takes time, 10 is default ok


        /* -----------------UNDO COMMENTS WHEN DATABASE IS READY

        const user = new userModel({name,email,password:hashedPass});
        await user.save(); //this object is saved in the database

        --------------------------------------------------------------------------*/ 
        const user = { _id: "12345", name, email, password: hashedPass }; //DELETE WHEN DATABASE IS READY


        const token = jwt.sign({id: user._id,}, process.env.JWT_SECRET, {expiresIn:'1d'});


        res.cookie('token',token,{
            httpOnly:true,
            secure: process.env.NODE_ENV==='production', //true if in production,else false
            sameSite: process.env.NODE_ENV=== 'production' ?  'none': 'strict',
            maxAge: 7*24*60*60*1000 ,  // 7 days, in miliseconds



        });

        
        //adding return, not in original way of doing this
        return res.json({
            success: true,
            message: "User registered successfully"
        });
        
    } catch (error) {
        return res.json({  // added return, not part of original method
            success:false,
            message: error.message
        })
    }
}