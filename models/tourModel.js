/* eslint-disable prettier/prettier */
const mongoose = require('mongoose');

// ** Describing the schema definition.
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name.'],
    unique: true,
    trim:true
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
    required: [true, 'A tour must have a difficulty']
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },

  ratingsQuantity: {
    type: Number,
    default: 0
  },

  price: {
    type: Number,
    required: [true, 'A tour must have a price.'],
  },

  priceDiscount: Number,

  summary: {
    type: String,
    trim:true
  },

  description: {
    type: String,
    required: [true, 'A tour must have a description'],
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

  startDates: [Date]
 
}, {
  toJSON: {virtuals: true},
  toObject: { virtuals: true}
});

// Virtual propertise
// [.get()] -> will be created each time we get data from the database
// will not be presisted to the database.
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
})

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
