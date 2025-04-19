import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator"; // ✅ Importing validator
import transporter from "../services/nodemailer.service.js";

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

//send password reset otp
export const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Please provide email" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({
      success: true,
      message: `OTP sent to ${user.email}`,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//reset password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Please provide all fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.resetOtp === "" || user.resetOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOtpExpireAt < Date.now) {
      return res.json({ success: false, message: "OTP expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
