const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../util/errorResponse");
const geocoder = require('../util/geocoder');

exports.getBootcamps = async (req, res, next) => {
  try 
  {
    let query;
    let parsedQuery;
    const reqQuery = {...req.query};
    const fieldsToRemove = ['select','sort','limit','page'];

    fieldsToRemove.forEach(param => delete reqQuery[param]);
     
    query = JSON.stringify(reqQuery).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    parsedQuery=  Bootcamp.find(JSON.parse(query));

    if (req.query.select) 
    {
      const fields = req.query.select.split(',').join(' ');
      parsedQuery = parsedQuery.select(fields);
    }
    if (req.query.sort) 
    {
      const sortBy = req.query.sort.split(',').join(' ');
      parsedQuery = parsedQuery.sort(sortBy);
    }
    else
    {
      parsedQuery = parsedQuery.sort('-createdAt');
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 1;
    const startIndex = (page-1)*limit;
    const endIndex = page*limit;

    const pageTot = await Bootcamp.countDocuments();

    parsedQuery = parsedQuery.skip(startIndex).limit(limit);

    const bootcamps = await parsedQuery;

    const pagination ={};

    if(endIndex < pageTot)
    {
      pagination.next = 
      {
        page: page +1,
        limit
      }
    }

    if(startIndex > 0)
    {
      pagination.prev = 
      {
        page: page - 1,
        limit
      }
    }



    res.status(200).json({ success: true, count:bootcamps.length, pagination:pagination, data: bootcamps });
  } 
  catch (error) 
  {
    next(error);
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(new ErrorResponse(`Bootcamp not found`, 400));
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const updateBootcamp = await Bootcamp.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updateBootcamp) {
      return res
        .status(404)
        .json({ success: false, message: "bootcamp not found" });
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, message: "deleted" });
  } catch (error) {
    next(error);
  }
};

// get bootcamps within a certain radius
exports.GetbootcampsInRadius = async (req, res, next) => {

  try 
  {
    const {zipcode,distance} = req.params;
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    const radius = distance/3963;

    const bootcamps = await Bootcamp.find({
      location: {$geoWithin: {$centerSphere: [[lng,lat],radius]}}
    });

    res.status(200).json(
      {
        success:true,
        counter:bootcamps.length,
        data:bootcamps
      }
    );

  } 
  catch (error) 
  {
    console.log(error);
  }

  
};
