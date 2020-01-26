const express = require('express');
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');

const Bootcamp = require('../models/Bootcamp');

const advancedResults = require('../middleware/advancedResults');

const courseRouter = require('./courses');

const router = express.Router();

const {
    protect
} = require('../middleware/auth');

//Re route into other resources
router.use('/:bootcampId/courses', courseRouter);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router.route('/').get(advancedResults(Bootcamp, 'courses'), getBootcamps).post(protect, createBootcamp);

router.route('/:id').get(getBootcamp).put(protect, updateBootcamp).delete(protect, deleteBootcamp);


module.exports = router;