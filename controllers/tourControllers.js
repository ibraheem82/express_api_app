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
  // will give us objects from the query strings.
  // console.log(req.query);

  try {

    console.log(req.query);

    // * BUILD QUERY
    // will take all the fields out of the object
    const queryObj = {...req.query}

    // ! fields that we want to exclude in the object
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    // ! deleting all the objects that was passed which we dont want in the query sting.
    excludedFields.forEach(el => delete queryObj[el])

  console.log(req.query, queryObj);


    // Get all tours from the database
    // const tours = await Tour.find();



    // ** ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // added the mongoose query symbol by replacing where it all match [$]
   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(JSON.parse(queryStr));

    // make queries in the query string.
    // filtering the queries.
    // const tours = await Tour.find(req.query);
    // const query = Tour.find(queryObj);
    // will return a query
    let query = Tour.find(JSON.parse(queryStr));


 
    // (3) Sorting
    if (req.query.sort) {
      // in order to be able to add multiple queries in the params while sorting from the database.
      const sortBy = req.query.sort.split(',').join('');
      console.log(sortBy);
      // query = query.sort(req.query.sort)
      query = query.sort(sortBy)
    } else {
      // if the user does not specify how to sort the results.
      query = query.sort('-createdAt');
    }

    
    // * EXECUTE QUERY
  const tours = await(query)



    
       // ** Filtering objects from the database method 2.
    // writing queries in mongoose.
  //   const tours = Tour.find({
  //     duration: 5,
  //     difficulty: 'easy'
  // });
    // * SEND RESPONSE
    // * Special mongoose method.
    // const tours = await Tour.find().where('duration').equals(5).where('difficulty').equals('easy')
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
