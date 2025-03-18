const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');


const port = process.env.PORT ? process.env.PORT : '3000';
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// CONTROLLERS******************************


// MIDDLEWARE IMPORTS******************************


// MIDDLEWARE *****************************


// ROUTES **********************************
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
