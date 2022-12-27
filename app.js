const express = require('express');


const app  = express();

// * Creating Route
// app.get('/', (req, res) => {
//     res.status(200).send('<h1>Good Evening.</h1>')
// })

// * Using JSON()
app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello from the server side!', app: 'Natours'})
})

// * Post () method
app.post('/', (req, res) => {
    res.send( 'You can post to this endpoint...')
});

const port = 9000
app.listen(port, () => {
    console.log(`App is running on port ${port}...`)
})