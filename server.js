/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
/* eslint-disable no-undef */
const app = require('./app');
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
