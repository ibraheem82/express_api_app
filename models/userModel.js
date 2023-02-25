const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
     required: [true, 'Please tell use your name.']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique:true,
    lowercase: true,
    // custom validation
    validate:[validator.isEmail, 'Please provide a valid email']
  },
  photo:String,
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 7
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password']
  }
})

// ['User'] -> is the name of the model that we are creating.
const User = mongoose.model('User', userSchema);
module.exports = User;