/* eslint-disable prettier/prettier */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
// const fs = require('fs');
const Tour = require('../models/tourModel');

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

// * will get the first 5 cheap tours
// will prefilled the query obeject before getAllTours()
// we are prefilling the query object for the users
exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

class APIFeatures {
  // [query] -> mongoose query, we want it to be reusable but not bound to the class.
  // [queryStr] -> the query that we get from express
  constructor(query, queryString) {
    // [this.query] -> is the query that we want to execute.
    this.query = query; // query that we get as an object.
    this.queryString = queryString;
  }

  // *** Method for each of the functionality.
  filter() {
    const queryObj = { ...this.queryString };

    // ! fields that we want to exclude in the object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // ! deleting all the objects that was passed which we dont want in the query sting.
    excludedFields.forEach((el) => delete queryObj[el]);

    // **  (1B)  ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // added the mongoose query symbol by replacing where it all match [$]
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    // returning the entire objects
    // in order to return the entire objects that have access to order methods in the class
    return this;
  }

  sort() {
    // ** (2) Sorting
    if (this.queryString.sort) {
      // in order to be able to add multiple queries in the params while sorting from the database.
      const sortBy = this.queryString.sort.split(',').join('');
      console.log(sortBy);

      this.query = this.query.sort(sortBy);
    } else {
      // if the user does not specify how to sort the results.
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }
}

exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  // will give us objects from the query strings.
  // console.log(req.query);

  try {
    console.log(req.query);

    // *  (1A) BUILD QUERY
    // will take all the fields out of the object
    // const queryObj = { ...req.query };

    // ! fields that we want to exclude in the object
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // ! deleting all the objects that was passed which we dont want in the query sting.
    // excludedFields.forEach((el) => delete queryObj[el]);

    // console.log(req.query, queryObj);

    // Get all tours from the database
    // const tours = await Tour.find();

    // **  (1B)  ADVANCED FILTERING
    // let queryStr = JSON.stringify(queryObj);
    // added the mongoose query symbol by replacing where it all match [$]
    // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));

    // make queries in the query string.
    // filtering the queries.
    // const tours = await Tour.find(req.query);
    // const query = Tour.find(queryObj);
    // will return a query
    // let query = Tour.find(JSON.parse(queryStr));

    // ** (2) Sorting
    // if (req.query.sort) {
    //   in order to be able to add multiple queries in the params while sorting from the database.
    //   const sortBy = req.query.sort.split(',').join('');
    //   console.log(sortBy);
    //   query = query.sort(req.query.sort)
    //   query = query.sort(sortBy);
    // } else {
    //   if the user does not specify how to sort the results.
    //   query = query.sort('-createdAt');
    // }

    // ** (3) FIELD LIMITING
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join('');
      query = query.select(fields);
    } else {
      // ('-__v) will not be included in the response not including
      query = query.select('-__v');
    }

    // ** (4)  PAGINATION
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit; // 3 - 1 * 10
    // page=2&limit=10
    // ! [skip] -> the amount of results  that should be skipped before actually queriying the data
    // ! [limit] -> the amount of results that we want in the query.
    // skip 10 results before we actually start querying.
    // 1-10 -> [page 1], 11-20 -> [page 2], 21-30 -> [page 3]
    // query = query.skip(2).limit(10)
    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      // [countDocuments] will return the numbers of documnets.
      const numberOfTours = await Tour.countDocuments();
      if (skip >= numberOfTours) throw new Error('This page does not exist ❌');
    }

    // * EXECUTE QUERY
    // will have access to the method that we are going to define in the class defination.
    // [find()] -> is the query object.
    const features = new APIFeatures(Tour.find(), req.query).filter().sort();
    // const tours = await query;
    // the query will be stored here.
    const tours = await features.query;

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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
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
      message: err,
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
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
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
      message: err,
    });
  }
};
