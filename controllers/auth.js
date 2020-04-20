const path = require('path');
const User = require("../models/User");
const ErrorResponse = require("../util/errorResponse");
const sendMail = require('../util/sendEmail');
const crypto = require('crypto');





exports.register = async (req,res,next)=>
{
    try
    {
        const {name,email,password,role} = req.body;

        const user = await  User.create({name,email,password,role});

        sendToken(user,200,res);

    }
    catch (error)
    {
        res.status(404).json(
            {
                success:false,
                message:'something went wrong',
                error
            }
        );
    }

};

exports.login = async (req,res,next)=>

{
    try
    {
        const {email,password} = req.body;
        if (!email || !password)
        {
            return next('please provide email and password');
        }
        const user = await User.findOne({email}).select('+password');

        if (!user)
        {
            return next('User not found');
        }

        const ismatch = await user.matchPasswords(password);
        if (!ismatch)
        {
            return next('passwords do not match');
        }
        sendToken(user,200,res);
    }
    catch (error)
    {
        next(error);
    }

};

exports.logout = (req,res,next)=>
{
    res.cookie('token','none',
        {
            expires: new Date(Date.now()+10*1000),
            httpOnly: true
        });
    res.status(200).json({
        success:true
    });

};

const sendToken = (user,statusCode,res)=>
{
    const token = user.getWebToken();
    const options =
        {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE*24*60*60*1000),
            httpOnly:true
        };
    if (process.env.NODE_ENV === 'production')
    {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token',token,options)
        .json(
            {
                success:true,
                token
            }
        );

};

exports.getMe = async (req,res,next)=>
{
  try
  {
      const user = await User.findById(req.user);
      res.status(200).json(
          {
              success:true,
              data:user
          }
      );
  }
  catch (error)
  {
      next(error);
  }
};
exports.updateDetails = async (req,res,next)=>
{

    try
    {
        const fieldsToUpdate = {
            name:req.body.name,
            email:req.body.email
        };
        const user = await User.findByIdAndUpdate(req.user.id,fieldsToUpdate,
            {
                new:true,
                runValidators:true
            });
        res
            .status(200)
            .json(
                {
                    success:true,
                    data:user
                }
            );
    }
    catch (error)
    {
        next(error);
    }

};

exports.updatePasswords = async (req,res,next)=>
{
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPasswords(req.body.currentPassword)))
    {
        return next("incorrect password");
    }

    user.password = req.body.newPassword;
    sendToken(user,200,res);

};



exports.forgotPassword = async (req,res,next)=>
{
   const user  = await User.findOne({email:req.body.email});
   if (!user)
   {
       return res.status(404).json({
           success:false,
           message: `user with this email ${req.body.email} not found`
       });
   }

   const resetToken = user.getResetPasswordToken();
   await user.save({validateBeforeSave:false});

   const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/resetPassword/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try
    {
        await sendMail({
            email: user.email,
            subject: 'Password reset',
            message
        });
        res.status(200).json({
            success:true,
            message: `message sent`
        });
    }
   catch (error)
   {
       console.log(error);
       res.status(404).json({
           success:false,
           message: `email not sent`
       });
   }

};

exports.resetPassword =async (req,res,next) =>
{
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken:hashedToken

    });


    if (!user)
    {
        return res.status(404).json({
            success:false,
            message:'Invalid token'
        });
    }

    user.password = req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordDate=undefined;

    await user.save({validateBeforeSave:false});
    sendToken(user,200,res);

};



