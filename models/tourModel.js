/* eslint-disable prettier/prettier */
/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');
const slugify = require('slugify');

// ** Describing the schema definition.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name.'],
    unique: true,
    trim: true,
    maxlength: [40, 'A tour must have less or equal than 40 characters.'],
    minlength: [ 9, 'A tour must have more or less than 9 characters.']
  },
  slug: {
   type: String
  },
  duration:{
  type: Number,
    required: [true, 'A tour must have a duration.']
    
},
  maxGroupSize:{
  type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'Difficulty is either: easy, medium, difficult'
    }
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
    // the {min} and {max} can also work date.
    min: [1, 'Rating must be above 1.0'],
    max:[5, 'Rating must be below 5.0'],

  },

  ratingsQuantity: {
    type: Number,
    default: 0
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },
  priceDiscount: {
    type: Number,
    // * custom data validator.
    // it returns if the priceDiscount is less than the Tour price.
    validate: {
      validator: function (val) {
        // (this) -> only points to the current document on New document creation.
        return val < this.price; //
      },
      // ({VALUE}) -> WILL GET ACCESS TO THE value that was passed in the parameter.
      message: 'Discount price ({VALUE})  should be below regular price.'
    }
  },


  summary: {
    type: String,
    trim:true
  },

  description: {
    type: String,
    // required: [true, 'A tour must have a description'],
    time: true
  },

  imageCover : {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    // ! will not show in the database.
    select: false
  },

  startDates: [Date],

  secretTour: {
    type: Boolean,
    default: false
  }
 
}, {
  toJSON: {virtuals: true},
  toObject: { virtuals: true}
});

// Virtual propertise
// [.get()] -> will be created each time we get data from the database
// will not be presisted to the database.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});


// * Document Middleware
// * [Hook] -> ('save')
// * Middleware is function that is defined on the tourSchema.pre, document middleware.
// * Pre->save hook or pre->save middleware
// it runs before the .save() and .create() but not on insertMany
tourSchema.pre('save', function(next) {
  console.log(this)
  this.slug = slugify(this.name, { lower: true });
  next();
});

// ** QUERY MIDDLEWARE
// [find] will make it a query
// * will execute for the commands that starts with find.
tourSchema.pre(/^find/, function(next) {
  // query object
  // ? find where the secretTour is not equal to true.
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  // console.log(docs);
  next();
});

// ** AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function(next) {
  // will point to the current aggregation context.
  // console.log(this)
  // remove from the document all the secretTour that is set to true.
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // * pipeline objects

  console.log(this.pipeline());
  next();
})
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
