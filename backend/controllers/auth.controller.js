import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator"; // ✅ Importing validator

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;

    try {
        // ✅ Basic field check
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // ✅ Optional password length check
        // if (password.length < 6) {
        //     return res.status(400).json({ message: "Password must be at least 6 characters" });
        // }

        // ✅ Sanitize and strictly use string for query
        const user = await User.findOne({ email: String(email) });

        if (user) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullName: newUser.fullName,
            });
        } else {
            return res.status(400).json({ message: "Invalid User Data" });
        }

    } catch (error) {
        console.log("error in sign up controller:", error.message);
        res.status(500).json({ message: "internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // ✅ Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email: String(email) });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isValidPass = await bcrypt.compare(password, user.password);

        if (!isValidPass) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });

    } catch (error) {
        console.log("error in login controller:", error.message);
        res.status(500).json({ message: "internal server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("error in logout controller:", error.message);
        res.status(500).json({ message: "internal server error" });
    }
};

export const getAuthUser = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in check auth controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
