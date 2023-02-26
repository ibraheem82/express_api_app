const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, 'Please tell use your name.']
  },

  email: {
    type: String,
    required: [true, 'Please provide your email.'],
    unique: true,
    lowercase: true,
    // custom validation
    validate: [validator.isEmail, 'Please provide a valid email']
  },

  photo: String,
  
  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 7,
    select: false
  },

  // check if the passwordConfirm matches the password.
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        // if the passwordConfirm is equal to the current password, -> passwordConfirm === password.
        // * [this] works only on (CREATE) and (CREATE).
        return el === this.password;
      },
      message: 'password are not the same.'
    },
    select: false
  }
});
// the middleware will work the moment the data is received and the moment it is presisted to the database.
// it work between getting the data and saving it to the database.
// * we want to encrypt the password when the password is created.
userSchema.pre('save', async function(next) {
  // [this] -> referring to the current user
  // if the password has not been modified
  if (!this.isModified('password ')) return next();
  // ** Hashing
  // it will hash our current password.
  // we are settiing out current password to the encrypted version
  this.password = await bcrypt.hash(this.password, 12)
  // [passwordConfirm] should not be presisted to the database.
  this.passwordConfirm = undefined;
  next();
});

// ** Instance method
// will be available on all the documents of a certain selection.
// [candidatePassword] -> the password that user passes in the body.
// [candidatePassword] -> is not hashed, it is coming from the user.
// [userPassword] -> it is hashed

// will return true if the two password are the same after comparing it.
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// ['User'] -> is the name of the model that we are creating.
const User = mongoose.model('User', userSchema);
module.exports = User;