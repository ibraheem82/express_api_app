/* eslint-disable prettier/prettier */
module.exports = (err, req, res, next) => {
  // show us where the error happended
  // console.log(err.stack);
  // * mongoose error or it statusCode code error message.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
