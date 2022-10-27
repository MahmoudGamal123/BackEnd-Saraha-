
import { Schema, model } from 'mongoose'
const userSchema = new Schema({
    fName: String,
    lName: String,
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmEmail: { type: Boolean, default: false },
    age: Number,
    phone: String,
    profileImg: String,
    coverPics: Array,
    gender: { type: String, default: 'Male', enum: ["Male", 'Female'] },
    online: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    code: String
}, {
    timestamps: true
})


export const userModel = model('User', userSchema)