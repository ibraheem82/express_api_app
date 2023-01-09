/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const express = require('express');
// all the route handlers was imported here, and all there methods are now avaliable here.
// You may also use the desctructuring.
const tourController = require('../controllers/tourControllers');

const router = express.Router();
// params middlewares
// the checkID function will always where where it suppose to work to validate our data.
// router.param('id', tourController.checkID);

// ** Mounting another middleware on the tourController
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

// * Route that has ID's.

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
