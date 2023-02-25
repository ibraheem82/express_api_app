/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
class AppError extends Error {
  constructor(message, statusCode){
    // calling the parent constructor
    // the parent class is error and whatever we pass into it is going to be the message property.
    // we already set our message property to our incoming message.
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // all the errors that we create will basically be operational errors.
    // using the operational TO SEND DOWN message to the client at least in production.
    this.isOperational = true;


    // when a new object is created and the constructor function is called, then that function call is not going to appear in the stack trace and will not pollute it. 
    // ** captureStackTrace returns a string that represents the location of that particular error in the call. It gives us a stack that helps us to find the location of that error in the code at which new Error() was Called
    Error.captureStackTrace(this, this.constructor)
  }
}
module.exports = AppError;