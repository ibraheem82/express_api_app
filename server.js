/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { MongoError } = require('mongodb');
// ** DOTENV in use
// getting the environment variables.
// will be read and saved to the node js environment variable
dotenv.config({ path: './config.env' });


process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION 💥💥💥! Server shutting down...')
    console.log(err.name, err.message)
    process.exit(1);
});


const app = require('./app');


const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);



// * calling the connect method on mongoose.
// ** When using the hosted DATABASE
mongoose.set("strictQuery", false);
mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
}
).then(con => {
  // console.log(con.connections);
  console.log('DB connection was successfull');
}).catch((err) => {
  if (err instanceof MongoError && err.code === 8000) {
    console.log('Authentication failed. Please check your credentials.');
  } else if (err.codeName === 'AtlasError') {
    console.log('An error occurred with Atlas:', err);
  } else {
    console.log('Failed to connect to MongoDB server:', err);
  }
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});





// process.on('unhandledRejection', (err) => {
//   if (err instanceof MongoError && err.code === 8000) {
//     console.error('Authentication failed. Please check your credentials.');
//     process.exit(1);
//   }
// });


process.on('unhandledRejection', err => {
  console.log('UNCAUGHT EXCEPTION 💥💥💥💥💥! Server shutting down...')
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  })
});

console.log(y);


// ** When using the local DATABASE
// mongoose.set("strictQuery", false);
// mongoose.connect(process.env.DATABASE_LOCAL, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
  
// }
// ).then(() => console.log('DB connection was successfull'));





// ** IN express
// console.log(app.get('env'));

// ** In node -> js
// console.log(processs.env);



// client.connect(err => {
//   if (err) {
//     if (err.name === 'MongoError' && err.code === 18) {
//       console.log('Authentication failed. Please check your credentials.');
//     } else {
//       console.log('Failed to connect to MongoDB server: ', err);
//     }
//     return;
//   }
//   console.log('Connected successfully to MongoDB server');

//   // continue with your MongoDB operations here
//   // ...

//   client.close();

// });
// In this code, we're using the MongoClient class from the mongodb driver to connect to the MongoDB server. We're also checking for the "MongoError: bad auth : authentication failed" error using the err.name and err.code properties to determine whether the error is an authentication failure or some other error.
// If the error is an authentication failure, we log a message to the console. Otherwise, we log the full error message. In both cases, we return from the connect() callback to prevent any further execution of the code.

// You can customize this code as needed for your specific use case.

