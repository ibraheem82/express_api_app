/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
/* eslint-disable import/newline-after-import */
const express = require('express');

const app = express();

// ! morgan is now deprecated.
// const morgan = require('morgan');
// can be use to get the actual request that you are on.
// get the query of the request using morgan.
// get every about the request.
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

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

// * Better way of defining a route that does'nt have id's.
// ** (3) ROUTES

// Mounting routers on routes
// MIDDLEWARES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ** (4) START SERVER

// * 🖨 SERVER REALATED STUFF's
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
