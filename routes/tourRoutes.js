/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const express = require('express');

const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

// * Route that has ID's.

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
