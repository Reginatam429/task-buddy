const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const session = require('express-session');


const port = process.env.PORT ? process.env.PORT : '3000';
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// CONTROLLERS******************************
const authController = require('./controllers/auth.js');

// MIDDLEWARE IMPORTS******************************


// MIDDLEWARE *****************************
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
    })
);
app.use('/auth', authController);

// ROUTES **********************************
app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
