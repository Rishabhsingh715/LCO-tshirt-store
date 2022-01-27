const Product = require('../models/product');
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require('../utils/customError');
const cloudinary = require('cloudinary');

exports.addProduct = BigPromise(async(req,res,next) =>{
    //images
    let imageArray = [];

    if(!req.files){
        return next(new CustomError("need photos of the product", 401));
    }

    if(req.files){
        for (let index = 0; index < req.files.photos.length; index++) {
            
            let result= await cloudinary.v2.uploader.upload(
                req.files.photos[index].tempFilePath,{
                    folder: "products"
                }
            );
            imageArray.push({
                id: result.public_id,
                secure_url: result.secure_url
            });
        }

    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product 
    });
    
});