const Bootcamp = require("../models/Bootcamp");
exports.getBootcamps = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: "show all bootcamps", data: req.hello });
};

exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `show bootcamp ${req.params.id}` });
};
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "error while creating a bootcamp" });
  }
};

exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Update bootcamp ${req.params.id}` });
};
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, message: `Delete bootcamp ${req.params.id}` });
};
