import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import cloudniary from "../lib/cloudinary.js";


export const signup = async(req,res)=>{
    const {fullName, email,password} = req.body;
    try {
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({message: "password must be at least 6 char"});
        }

        const user = await User.findOne({email}); //searching if exists...returns that object

            
        if(user) return res.status(400).json({message: "Email already exists"});

        const salt = await bcrypt.genSalt(10); //????? 10 is convension

        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User({
            fullName : fullName,
            email : email,
            password: hashedPassword, 

        });

        if(newUser){
            generateToken(newUser._id, res); //
            await newUser.save(); //await because its in cloud  , SAVE TO MONGO

            res.status(201).json({
                _id : newUser._id,
                fullName: newUser.fullName,
                email : newUser.email,
                profilePic: newUser.profilePic,
            });

        }
        else{
            return res.status(400).json({message: "Invalid User Data"});
        }


        
    } catch (error) {

        console.log("error in sign up controller:",error.message);
        res.status(500).json({message: "internal server error"});
        
    }
};

export const login = async(req,res)=>{
    const {email,password} = req.body;
    try {
        const user  = await User.findOne({email});

        if(!user) return res.status(400).json({message: "invalid credential"});



        // const salt = await bcrypt.genSalt(10); 

        // const hashedPassword = await bcrypt.hash(password,salt);

        // if(hashedPassword !== user.password) return res.status(400).json({message: "invalid credential"});

        //or do it like this:

        const isValidPass= await bcrypt.compare(password,user.password);

        if(!isValidPass){
            return res.status(400).json({message: "invalid credential"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullName: user.fullName,
            email : user.email,
            profilePic: user.profilePic,
        });

        
    } catch (error) {
        console.log("error in login controller:",error.message);
        res.status(500).json({message: "internal server error"});
    }

};

export const logout = (req,res)=>{
    try {
        res.cookie("jwt", "", {maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {

        console.log("error in logout controller:",error.message);
        res.status(500).json({message: "internal server error"});
    }
};

export const updateProfile = async (req,res)=>{
    
    return res.json({
        message:"under production"
    })
    // try {
    //     const {profilePic} = req.body;
    //     const userId = req.user._id ;

    //     if(!profilePic){
    //         return res.status(400).json({message:"Profile picture is required"});
    //     }

    //     const uploadResponse = await cloudniary.uploader.upload(profilePic);
    //     const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url}, {new:true});
    //     res.status(200).json(updatedUser);
    
    // } catch (error) {

    //     console.log("error in updating profile picture:",error);
    //     res.status(500).json({message:"Internal server error"});  
    // }
};
    

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller:",error);
        res.status(500).json({message:"Internal server error"});
        
    }
}



// exporting so it can be imported from somewhere else...