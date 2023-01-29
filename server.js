/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// ** DOTENV in use
// getting the environment variables.
// will be read and saved to the node js environment variable
dotenv.config({ path: './config.env' });
const app = require('./app');



// const DB = process.env.DATABASE.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );



// * calling the connect method on mongoose.
// ** When using the hosted DATABASE
// mongoose.connect(DB, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify:false
// }
// ).then(con => {
//   console.log(con.connections);
//   console.log('DB connection was successfull');
// })

// ** When using the local DATABASE
mongoose.connect(process.env.DATABASE_LOCAL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify:false
}
).then(() => console.log('DB connection was successfull'));





// ** IN express
// console.log(app.get('env'));

// ** In node -> js
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
