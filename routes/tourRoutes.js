/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
/* eslint-disable no-undef */
const express = require('express');
const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // If the id is greater than the tours length.
  // if (id > tours.length) {

  // if the particular tour you are looking for is not found.
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID❌',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  // get the last one, add 1 to the last one.
  const newId = tours[tours.length - 1].id + 1;
  // merge the existing objects together
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // adding to the json file.
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
  res.send('Done ');
};

const updateTour = (req, res) => {
  const queryString = req.params.id;
  // if (req.params.id * 1 > tours.length) {
  if (queryString * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID❌',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: `ID ${queryString} was updated`,
    },
  });
};

const deleteTour = (req, res) => {
  const queryString = req.params.id;
  // if (req.params.id * 1 > tours.length) {
  if (queryString * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID❌',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
const router = express.Router();

router.route('/').get(getAllTours).post(createTour);

// * Route that has ID's.

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
