const jwt = require('jsonwebtoken');
const User  = require('../models/User');
const errorHandler = require('./error');

exports.protect = async (req,res,next)=>
{
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))
    {
        token = req.headers.authorization.split(' ')[1];
    }
    else if(req.cookies.token)
    {
        token = req.cookies.token;
    }
    else
    {
        return res.status(401).json(
            {
                success:false,
                message: 'not authorized'
            }
        );
    }
    if (!token)
    {
        return res.status(401).json(
            {
                success:false,
                message: 'not authorized'
            }
        );
    }

    try
    {
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    }
    catch (error)
    {
        errorHandler(error);
    }
};

exports.authorize = (...roles)=>
{
    return(req,res,next)=>
    {
        if (!roles.includes(req.user.role))
        {
            return res.status(403).json(
                {
                    success:false,
                    message: "anauthorized to perform this action"
                }
            );
        }
        next();
    }
};