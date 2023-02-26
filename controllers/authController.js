const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign(
    { id }, process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}


exports.signup = catchAsync(async (req, res, next) => {
  // To create a new user
  // const newUser = await User.create(req.body)
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
  });
  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  // created variables from the body object using destructing
  const { email, password } = req.body;
// * 1) Check if email and password.
  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400))
  }

  // * 2) Check if user exists && password is correct.
  const user = await User.findOne({ email }).select('+password');
  // [password] -> candidate password.
  // [user.password] -> correct user password.
  // const correct = await user.correctPassword(password, user.password);
  // console.log(user);


  // if the user does not exist it will not run the next code which is the -> await user.correctPassword
  if (!user || !(await user.correctPassword(password, user.password))) {
    // [401] -> unathourised
    return next(new AppError('Incorrect email or password', 401))
  }
// * 3) If everything ok, send token to client
  // token will be generated and send back to the user.
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // * 1) Getting the token and check if it there.
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }


  if (!token) {
    return next(new AppError('You are not logged in! please log in to get access.', 401));
  }
  // * 2) Validate token -> (verification token)
  // the decoded payload or data from the json web token.
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded)
  
  // * 3) Check if the user that is trying to access the route still exists.

  // * 4) Check if the user changed the password after the JWT(token) was issued.


  next();
});