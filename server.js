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
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

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
app.use(passUserToView);
app.set("view engine", "ejs");  
app.set("views", "views");

// ROUTES **********************************
app.get('/', (req, res) => {
    res.render('index.ejs', { currentPage: 'landing', user: req.session.user || null });
});

app.get('/account/home', isSignedIn, (req, res) => {
    res.render('account/home.ejs', { currentPage: 'dashboard', user: req.session.user });
});

app.get("/account/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/auth/sign-in"); // Redirect if not logged in
    }
    res.render("account/dashboard", { 
        currentPage: "dashboard", // Add this!
        user: req.session.user 
    });
});


app.listen(port, () => {
    console.log(`The express app is ready on port ${port}!`);
});
