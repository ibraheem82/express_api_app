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
    validate:[validator.isEmail]
  },
})