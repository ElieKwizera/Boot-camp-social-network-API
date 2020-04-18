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
const {protect,authorize} = require('../middleware/auth');
const Bootcamp = require('../models/Bootcamp');
const advancedResults = require('../middleware/results');

const courseRoutes = require('./courses');
const reviewRoutes = require('./reviews');
const router = express.Router();

router.use('/:bootcampID/courses', courseRoutes);
router.use('/:bootcampID/reviews', reviewRoutes);

router.route("/")
    .get(advancedResults(Bootcamp,'courses'),getBootcamps)
    .post(protect,authorize('publisher','admin'),createBootcamp);

router
    .route("/:id")
    .get(getBootcamp)
    .put(protect,authorize('publisher','admin'),updateBootcamp)
    .delete(protect,authorize('publisher','admin'),deleteBootcamp);

router
    .route('/radius/:zipcode/:distance')
    .get(GetbootcampsInRadius);

router.route('/:id/photo').put(protect,authorize('publisher','admin'),uploadBootcampPhoto);


module.exports = router;
