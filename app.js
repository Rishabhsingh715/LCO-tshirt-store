const express = require('express');
require("dotenv").config();
const app = express();

const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

app.set('view engine', 'ejs');

//using morgan middleware
app.use(morgan("tiny"));

//regular middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//using parser middlewares
app.use(cookieParser());
app.use(fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);



//import all routes here
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');


app.use('/api/v1', home);
app.use('/api/v1', user);
app.use('/api/v1',product);

app.get('/signuptest', (req, res)=>{
    console.log("i ran");
    res.render("signuptest");
})


module.exports = app;