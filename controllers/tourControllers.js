/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// const fs = require('fs');
const Tour = require("../models/tourModel");

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   console.log(`Tour ID is: ${val}`);

//   const queryString = req.params.id;
//   if (queryString * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID❌',
//     });
//   }
//   next();
// };

// will check the body of the request you are making.
// used mostly when creating tours.
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };
exports.getAllTours = async(req, res) => {
  // console.log(req.requestTime);

  try {
    // Get all tours from the database
  const tours = await Tour.find();
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
    
  } catch (err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
    
  }
  
};

exports.getTour = async (req, res) => {
  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  try {
    const tour = await Tour.findById(req.params.id);
     res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
 
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
  res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    
  } catch (err){
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator:true
    })
    res.status(200).json({
    status: 'success',
    data: {
      tour
    },
  });
  } catch (err) {
   res.status(400).json({
      status: 'fail',
      message: err
    });
  }
  
};

exports.deleteTour = async(req, res) => {
  // if (req.params.id * 1 > tours.length) {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
    status: 'success',
    data: null,
  });
  } catch (err) {
     res.status(400).json({
      status: 'fail',
      message: err
    });
  }

  
};
