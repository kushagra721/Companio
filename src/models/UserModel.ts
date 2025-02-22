import mongoose, { Schema, Document } from 'mongoose';
import { SignupEntity } from '../entities/UserEntity';

const SignupSchema: Schema = new Schema({
    name: { type: String, required: true },
    mobileNo: { type: String, required: true },
    profilePic: { type: String, required: false },
    type: { type: String, enum: ['buyer', 'seller'], required: true },
    fcmToken: { type: String, required: false },
    deviceType: { type: String, required: false },
    cDt: { type: Date, default: Date.now },
    id: { type: String, required: true, unique: true }
});

export const SignupModel = mongoose.model<SignupEntity>('Signup', SignupSchema);