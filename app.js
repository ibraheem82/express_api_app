/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
/* eslint-disable import/newline-after-import */
const fs = require('fs');
const express = require('express');
const app = express();
// ! morgan is now deprecated.
// const morgan = require('morgan');
// can be use to get the actual request that you are on.
// get the query of the request using morgan.
// get every about the request.
const morgan = require('morgan');

// ** (1) MIDDLEWARES
// ** Creating a custom middleware in express
// instead app.use(morgan('dev'));
// app.use(morgan('tiny'));
app.use(morgan('combined')); // * <- use
app.use(express.json());

app.use((req, res, next) => {
  console.log('Middleware calling');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// * Middleware
// it will help in modifying the incoming request data.

// * Creating Route
app.get('/', (req, res) => {
  res.status(200).send('<h1>Good Evening.</h1>');
});

// * Using JSON()
// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Hello from the server side!', app: 'Natours'})
// })

// * Post () method
// app.post('/', (req, res) => {
//     res.send( 'You can post to this endpoint...')
// });

// * Reading data that will be sent
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
// ** (2) ROUTE HANDLERS
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
// * Route Handlers
// ! [Getting all tours]
app.get('/api/v1/tours', getAllTours);

// [:id] is the parameter
// [?] optional parameter.
// ! [Getting single tour]
// * similar to the one below, meaning chaining.
// app.get('/api/v1/tours/:id', getTour);

// app.post('/api/v1/tours', createTour);

// will send only the updated data.
// * Patch method
// app.patch('/api/v1/tours/:id', updateTour);

// * Delete method
// app.delete('/api/v1/tours/:id', deleteTour);

// * Better way of defining a route that does'nt have id's.
// ** (3) ROUTES
app.route('/api/v1/tours').get(getAllTours).post(createTour);

// * Route that has ID's.
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// ** (4) START SERVER

// * 🖨 SERVER REALATED STUFF's
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
