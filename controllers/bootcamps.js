const path = require('path');
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../util/errorResponse");
const geocoder = require('../util/geocoder');

exports.getBootcamps = async (req, res, next) =>
{
    try
    {
        res.status(200).json(res.advancedResults);
    } catch (error)
    {
        next(error);
    }
};

exports.getBootcamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp)
        {
            return next(new ErrorResponse(`Bootcamp not found`, 400));
        }
        res.status(200).json({success: true, data: bootcamp});
    } catch (error)
    {
        next(error);
    }
};
exports.createBootcamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({
            success: true,
            data: bootcamp,
        });
    } catch (error)
    {
        next(error);
    }
};

exports.updateBootcamp = async (req, res, next) =>
{
    try
    {
        const updateBootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        if (!updateBootcamp)
        {
            return res
                .status(404)
                .json({success: false, message: "bootcamp not found"});
        }
    } catch (error)
    {
        next(error);
    }
};

exports.deleteBootcamp = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.findById(req.params.id);
        if (!bootcamp)
        {
            res.status(400).json({success: false});
        }

        bootcamp.remove();

        res.status(200).json({success: true, message: "deleted"});
    } catch (error)
    {
        next(error);
    }
};

exports.uploadBootcampPhoto = async (req, res, next) =>
{
    try
    {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp)
        {
            res.status(404).json(
                {
                    success: false,
                    message: 'Bootcamp not found'
                }
            );
        }
        if (!req.files)
        {
            res.status(404).json(
                {
                    success: false,
                    message: 'No file to upload'
                }
            );
        }
        const photo = req.files.file;

        if (!photo.mimetype.startsWith('image'))
        {
            res.status(404).json(
                {
                    success: false,
                    message: 'No image file detected'
                }
            );
        }

        if (photo.size > 100000)
        {
            res.status(404).json(
                {
                    success: false,
                    message: 'very large file'
                }
            );
        }

        photo.name = `photo_${bootcamp._id}${path.parse(photo.name).ext}`;
        photo.mv(`${process.env.FILE_UPLOAD_PATH}/${photo.name}`, async error =>
        {
            if (error)
            {
                res.status(404).json(
                    {
                        success: false,
                        message: 'problem while uploading'
                    }
                );

            }
            else
            {
                res.status(404).json(
                    {
                        success: true,
                        message: 'File uploaded'
                    }
                );
            }
        });

    } catch (error)
    {
        console.log(error);
    }

}

// get bootcamps within a certain radius
exports.GetbootcampsInRadius = async (req, res, next) =>
{

    try
    {
        const {zipcode, distance} = req.params;
        const loc = await geocoder.geocode(zipcode);
        const lat = loc[0].latitude;
        const lng = loc[0].longitude;

        const radius = distance / 3963;

        const bootcamps = await Bootcamp.find({
            location: {$geoWithin: {$centerSphere: [[lng, lat], radius]}}
        });

        res.status(200).json(
            {
                success: true,
                counter: bootcamps.length,
                data: bootcamps
            }
        );

    } catch (error)
    {
        console.log(error);
    }


};
