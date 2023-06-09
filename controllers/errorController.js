/* eslint-disable prettier/prettier */

/* eslint-disable prettier/prettier */
const mongoose = require('mongoose')
const AppError = require("../utils/appError");

const handleCastErrorDB = err => {
  // returning our own app error.
  const message = `Invalid  ${err.path} was passed in: ${err.value}.`;
  // doing this with the help of operational error.
  return new AppError(message, 400);
};

const handleDuplicateFieldNameErrorDb = err => {
  
  // returning our own app error.
  // const checkValue = err.keyValue.name.match(/(["'])(\\?.)*?\1/);
  const message = ` Duplicate fieldvalue: "${err.keyValue.name}" please use another value.`;
  
  // doing this with the help of operational error.
  return new AppError(message, 400);
};

// const handleValidationErrorDB = err => {
//   // const errors  = Object.values(err.errors).map(el = el.statusCode)
//   // const message = `Invalid input data. ${errors.join('. ')}`;
//   const message = `Invalid input value ❌❌. ${Object.values(err.errors)}`;
//   return new AppError(message, 400);
// }

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(error => error.message);
  const message = `Invalid input value ❌❌. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleJWTError = err => { 
  const message = `${err.name}`
 
  return new AppError(message, 401);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
  
};


const sendErrorProd = (err, res) => {
  // * Operational error that we can trust, send message to the client
  // using the operational error to send down message to the client.
  if (err.isOperational) {
    res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            // stack: err.stack
     });

    // Programming Error, : Or other unknown error that we dont want to leak the details  out.
  } else {
    // ** Procedures on error
    // 1) Log error
    console.error("Error❌", err)
  



    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
}

module.exports = (err, req, res, next) => {
  // show us where the error happended

  // * mongoose error or it statusCode code error message.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';


  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    
    let error = {...err};
  
    //[handleCastErrorDB(err)] ->  passing the error that mongoose created into the function, will also return a new error created with our (AppError) class and that error will be marked as an operational error, beacuse all our AppError have the isOperational property set to true automatically.
    if (error.kind === 'ObjectId') error = handleCastErrorDB(error);
      // if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldNameErrorDb(error);
    if (error instanceof mongoose.Error.ValidationError) error = handleValidationErrorDB(error);
      if (error.name === 'JsonWebTokenError') error = handleJWTError(error);
    // will be sent to the client
    // handleCastErrorDB -> will be sent to the client.
    sendErrorProd(error, res);
  }
};
 
