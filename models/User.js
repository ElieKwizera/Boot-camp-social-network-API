const crypto = require('crypto');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');


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
                enum:['user','publisher'],
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

UserSchema.pre('save', async function (next)
    {
        if (!this.isModified('password'))
        {
            next();
        }
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }

);

UserSchema.methods.getWebToken = function()
{
    return JWT.sign({id:this._id},process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE
        });
};
UserSchema.methods.matchPasswords = async function(userPassword)
{
  //  console.log(this.password);
    return await bcrypt.compare(userPassword,this.password);
};

UserSchema.methods.getResetPasswordToken = function()
{
  const resetToken =crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
  this.resetPasswordDate=Date.now() + 10*60*1000;
  return resetToken;

};

module.exports = mongoose.model('User',UserSchema);