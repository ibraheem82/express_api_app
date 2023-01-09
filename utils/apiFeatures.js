/* eslint-disable prettier/prettier */



class APIFeatures {
  // [query] -> mongoose query, we want it to be reusable but not bound to the class.
  // [queryStr] -> the query that we get from express
  constructor(query, queryString) {
    // [this.query] -> is the query that we want to execute.
    this.query = query; // query that we get as an object.
    this.queryString = queryString;
  }

  // *** Method for each of the functionality.
  filter() {
    const queryObj = { ...this.queryString };

    // ! fields that we want to exclude in the object
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // ! deleting all the objects that was passed which we dont want in the query sting.
    excludedFields.forEach((el) => delete queryObj[el]);

    // **  (1B)  ADVANCED FILTERING
    let queryStr = JSON.stringify(queryObj);
    // added the mongoose query symbol by replacing where it all match [$]
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

   this.query = this.query.find(JSON.parse(queryStr));

    // returning the entire objects
    // in order to return the entire objects that have access to order methods in the class
    return this;
  }

  sort() {
    // ** (2) Sorting
    if (this.queryString.sort) {
      // in order to be able to add multiple queries in the params while sorting from the database.
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);

      this.query = this.query.sort(sortBy);
    } else {
      // if the user does not specify how to sort the results.
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');

      this.query = this.query.select(fields);
    } else {
      // ('-__v) will not be included in the response not including
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
       const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit; // 3 - 1 * 10
    // page=2&limit=10
    // ! [skip] -> the amount of results  that should be skipped before actually queriying the data
    // ! [limit] -> the amount of results that we want in the query.
    // skip 10 results before we actually start querying.
    // 1-10 -> [page 1], 11-20 -> [page 2], 21-30 -> [page 3]
    // query = query.skip(2).limit(10)
    this.query = this.query.skip(skip).limit(limit);

    
    return this;

  }
} 

module.exports = APIFeatures;