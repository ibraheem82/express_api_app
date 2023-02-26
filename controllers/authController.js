const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async (req, res, next) => {
  // To create a new user
  const newUser = await User.create(req.body)
  res.status(201).json({
    status: 'success',
    data: {
      user: newUser
    }
  });
});