const app = require('./app');
const connectWithDb = require('./config/db');
require("dotenv").config();
const cloudinary = require('cloudinary');
//connect with databases
connectWithDb();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API ,
    api_secret: process.env.CLOUDINARY_SECRET
});


app.listen(process.env.PORT, ()=>{ 
    console.log(`Server is up and running on port: ${process.env.PORT}`);
});