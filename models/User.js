const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema(
    {
        name:
            {
                type: String,
                required: [true, 'please enter the name']
            },
        email:
            {
                type: String,
                match: [
                    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    "Please add a valid email"],
                required: [true, 'please enter the email'],
                unique: [true, 'User already exist with the same email']
            },
        role:
            {
                type: String,
                enum:['user','admin'],
                default: 'user'
            },
        password:
            {
                type:String,
                required:true,
                minLength:6,
                select:false
            },
        resetPasswordToken:String,
        resetPasswordDate: Date,
        createdAt:
            {
                type:Date,
                default: Date.now
            }
    }
);