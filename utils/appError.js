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
    this.isOperation = true;


    // when a new object is created and the constructor function is called, then that function call is not going to appear in the stack trace and will not pollute it. 
    Error.captureStackTrace(this, this.constructor)
  }
}
module.exports = AppError;