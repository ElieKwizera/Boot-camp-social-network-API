const express = require("express");

const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    uploadBootcampPhoto,
    GetbootcampsInRadius
} = require("../controllers/bootcamps");

const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/results');

const courseRoutes = require('./courses');
const router = express.Router();

router.use('/:bootcampID/courses', courseRoutes);

router.route("/")
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(createBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(updateBootcamp)
    .delete(deleteBootcamp);

router
    .route('/radius/:zipcode/:distance')
    .get(GetbootcampsInRadius);

router.route('/:id/photo').put(uploadBootcampPhoto);


module.exports = router;
