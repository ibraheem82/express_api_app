/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
/* eslint-disable import/newline-after-import */
const express = require('express');

// ! morgan is now deprecated.
// const morgan = require('morgan');
// can be use to get the actual request that you are on.
// get the query of the request using morgan.
// get every about the request.
const morgan = require('morgan');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


const app = express();


// ** (1) MIDDLEWARES
// ** Creating a custom middleware in express
// instead app.use(morgan('dev'));
// app.use(morgan('tiny'));
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('combined')); // * <- use
}
app.use(express.json());

// * Serving static files.
app.use(express.static(`${__dirname}/public/`));


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


// [app.all] -> will run for all the handlers.
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: "fail",
  //   message: `Can't find ${req.originalUrl} on this server`
  // });

  // ! Creating an error
  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;

  // * when the next() is reached it will assume that all other requests are errors and they will all be skipped, and will send the error to the global error handling middleware which will be executed.
  // * it will skip other middlewares in the stack and goes straight to the error handling middleware.
  // next(err);
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

// * Middleware handlers
app.use(globalErrorHandler)




// ** (4) START SERVER
// * 🖨 SERVER REALATED STUFF's
module.exports = app;
