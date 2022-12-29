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
router.param('id', (req, res, next, val) => {
  console.log(`Tour ID is: ${val}`);
  next();
});
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
