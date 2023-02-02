/* eslint-disable prettier/prettier */

const sendErrorDev = (err, res) => {
 res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
}


const sendErrorProd = (err, res) => {
  // * Operational error that we can trust, send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
          status: err.status,
          message: err.message,
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
    })
  }
}

module.exports = (err, req, res, next) => {
  // show us where the error happended
  // console.log(err.stack);
  // * mongoose error or it statusCode code error message.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  
  } else if (process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res);
  
  }
  
};
 
