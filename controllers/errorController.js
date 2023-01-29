/* eslint-disable prettier/prettier */
module.exports = (err, req, res, next) => {
  // show us where the error happended
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
}