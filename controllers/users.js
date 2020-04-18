const path = require('path');
const User = require("../models/User");
const ErrorResponse = require("../util/errorResponse");
const advancedResults = require('../middleware/results');
const crypto = require('crypto');



 exports.getUsers = (req,res,next)=>
{
    res.status(200).json(res.advancedResults);
};

exports.getUser = async (req,res,next)=>
{
    const user = await User.findById(req.params.id);
    res.status(200).json(
        {
            success:true,
            data:user
        }
    );
};

exports.createUser = async (req,res,next)=>
{
    const {name,email,password,role} = req.body;

    const user = await  User.create({name,email,password,role});

    res.status(200).json(
        {
            success:true,
            data:user
        }
    );
};

exports.updateUser = async (req,res,next)=>
{
    const updateUser = await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json(
        {
            success:true,
            data:updateUser
        }
    );
};

exports.deleteUser = async (req,res,next)=>
{
    await User.findByIdAndRemove(req.params.id);
    res.status(200).json(
        {
            success:true,
            message:'deleted'
        }
    );
};