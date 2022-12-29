/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
const dotenv = require('dotenv');
// ** DOTENV in use
// will be read and saved to the node js environment variable
dotenv.config({ path: './config.env' });
const app = require('./app');
// getting the environment variables.

// ** IN express
// console.log(app.get('env'));

// ** In node -> js
// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
