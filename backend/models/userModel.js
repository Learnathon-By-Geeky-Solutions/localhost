import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true},
    verifyOtp : { type: String, default: '' },
    verifyOtpExpireAt : { type: Number, default: 0 },
    isVerified : { type: Boolean, default: false },
    resetOtp : { type: string, default: '' },
    resetOtpExpireAt : { type: Number, default: 0 },
})

const User = mongoose.models.user || mongoose.model('User', userSchema); // if the model is already defined, use that or else create a new model

export default User;