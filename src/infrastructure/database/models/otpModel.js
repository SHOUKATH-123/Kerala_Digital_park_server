import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: {
    type: Date,
    default: Date.now,
    expires: 60, // ⏱️ TTL in seconds (1 minute = 60 seconds)
  },
    
}, { timestamps: true });

// Encrypt OTP before saving
otpSchema.pre('save', async function (next) {
    if (!this.isModified('otp')) return next();
    this.otp = await bcrypt.hash(this.otp, 10);
    next();
});

// Compare function for OTP
otpSchema.methods.compareOtp = function (enteredOtp) {
    return bcrypt.compare(enteredOtp, this.otp);
};


const Otp = mongoose.model('Otp', otpSchema);

export default Otp;