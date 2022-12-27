/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-object-spread */
/* eslint-disable prettier/prettier */
/* eslint-disable import/newline-after-import */
const fs = require('fs');
const express = require('express');
const app = express();

// * Middleware
// it will help in modifying the incoming request data.
app.use(express.json());

// * Creating Route
// app.get('/', (req, res) => {
//     res.status(200).send('<h1>Good Evening.</h1>')
// })

// * Using JSON()
// app.get('/', (req, res) => {
//     res.status(200).json({message: 'Hello from the server side!', app: 'Natours'})
// })

// * Post () method
// app.post('/', (req, res) => {
//     res.send( 'You can post to this endpoint...')
// });

// * Reading data that will be sent
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// * Route Handler
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  // console.log(req.body);

  // get the last one, add 1 to the last one.
  const newId = tours[tours.length - 1].id + 1;
  // merge the existing objects together
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  // adding to the json file.
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tours: newTour,
        },
      });
    }
  );
  res.send('Done ');
});

// * 🖨 SERVER REALATED STUFF's
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});
