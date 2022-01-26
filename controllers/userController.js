const User = require('../models/user');
const BigPromise = require("../middlewares/bigPromise");
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const cloudinary = require('cloudinary');
const mailHelper = require('../utils/mailHelper');
const crypto  = require('crypto');
const user = require('../models/user');

exports.signup = BigPromise(async(req, res, next)=>{

    if(!req.files){
        return next(new CustomError("photo is required for sign-up", 400));
    }

    const {name, email, password} = req.body;

    if(!email || !name || !password){
        return next(new CustomError('Email, name and password all are required', 400)
        );
    }
    let file = req.files.photo;

    
    console.log("yeah i am working");
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
        folder: "users",
        width: 150,
        crop: "scale"
    })
    
    
   
    console.log("yeah i am working2");

    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url
        }
    });

    cookieToken(user, res);

   
});

exports.login = BigPromise(async(req,res,next)=>{

    const {email, password} = req.body;

    if(!email || !password){
        return next(new CustomError('provide email and password', '404'));
    }

    //get user from the db
    const user = await User.findOne({email: email}).select("+password");

    //if user doesn't exists
    if(!user){
        return next(new CustomError('User does not exists in database', '404'));
    }

    //check if password is correct
    const isPasswordCorrect = await user.idValidatedPassword(password);

    if(!isPasswordCorrect){
        return next(new CustomError('Password does not matches', '404'));
    }
    //if user is validated, we send the token
    cookieToken(user, res);

})


exports.logout = BigPromise(async(req,res,next)=>{

   res.cookie('token', null, {
       expires: new Date(Date.now()),
       httpOnly: true
   });

   res.status(200).json({
       success: true,
       message: "Logout Success"
   });

});

exports.forgotPassword = BigPromise(async(req,res,next)=>{

   const {email} = req.body;

   const user = await User.findOne({email});

   if(!user){
       return next(new CustomError('email not registered', 400));
   }

   const forgotToken = user.getForgotPasswordToken();

   await user.save({validateBeforeSave: false}); 

   //we will send this url alongwith message to user-mail, this is full url to your app
   const url = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`

   const message = `Copy paste this url into your browser and hit enter \n\n ${url}`


   try {
       await mailHelper({
           email: user.email,
           subject: "T-shirt store password reset email",
           message
       });

       res.status(200).json({
           success: true,
           message: "Password reset email sent successfully"
       })
       
   } catch (error) {
       user.forgotPasswordtoken = undefined;
       user.forgotPasswordExpiry = undefined;
       await user.save({validateBeforeSave: false});    

       return next(new CustomError(error.message, 500));
       
   }
 
 })


exports.passwordReset = BigPromise(async(req,res,next)=>{

    const token = req.params.token;
    const encryToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex")

    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    });

    if(!user){
        return next(new CustomError("Token is expired or invalid"));
    }
    
    if(req.body.password !== req.body.confirmPassword){
        return next(new CustomError("Password and confirm password does not match"));
     }

     user.password = req.body.password;
     user.forgotPasswordtoken = undefined;
     user.forgotPasswordExpiry = undefined;

     await user.save();

     //now send a json response or send a token back
     cookieToken( user, res );
})

exports.getLoggedInUserDetails = BigPromise(async(req,res,next)=>{

     const user = await User.findById(req.user.id);

     res.status(200).json({
         success: true,
         user
     })
  
  });

  exports.changePassword = BigPromise(async(req,res,next)=>{
    console.log("i ran bro");
   const userId = req.user.id
   const user = await User.findById(userId).select("+password");

   const isCorrectOldPassword = await user.idValidatedPassword(req.body.oldPassword);
   if(!isCorrectOldPassword){
       return next(new CustomError("old password is incorrect",400))
   }

   user.password = req.body.password;
   await user.save();

   cookieToken(user, res);
 
 });

 exports.updateUser = BigPromise(async(req,res,next)=>{

    if(!req.body.email || !req.body.name){
        return next(new CustomError("name and email both should be present to update", 400));
    }

    const newData = {
        name: req.body.name,
        email: req.body.email
    }

    if(req.files){
        const user = await User.findById(req.user.id);

        const imageId = user.photo.id;

        //delete photo on cloudinary
        const resp = await cloudinary.v2.uploader.destroy(imageId);

        //upload the new photo
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }; 

    const user = await User.findByIdAndUpdate(req.user.id, newData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });


 });


 exports.adminUpdateOneUserDetails = BigPromise(async(req,res,next)=>{

    if(!req.body.email || !req.body.name){
        return next(new CustomError("name and email both should be present to update", 400));
    }

    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    if(req.files){
        const user = await User.findById(req.user.id);

        const imageId = user.photo.id;

        //delete photo on cloudinary
        const resp = await cloudinary.v2.uploader.destroy(imageId);

        //upload the new photo
        const result = await cloudinary.v2.uploader.upload(req.files.photo.tempFilePath, {
            folder: "users",
            width: 150,
            crop: "scale"
        });

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url
        }
    }; 

    const user = await User.findByIdAndUpdate(req.params.id, newData,{
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true
    });


 });

 exports.adminAllUsers = BigPromise(async(req,res,next)=>{

    const user = await User.find();

    res.status(200).json({
        success: true,
        user
    });
 });

 exports.adminGetSingleUser = BigPromise(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new CustomError("user doesn't exists",401));
    }

    res.status(200).json({
        success: true,
        user
    })
 });

 exports.adminDeleteOneUser = BigPromise(async(req,res,next)=>{
     const user = await User.findById(req.params.id);

     if(!user){
         return next(new 
            CustomError('user does not exists', 400));
     }

     await cloudinary.v2.uploader.destroy(user.photo.id);

     await user.remove();
     res.status(200).json({
         success: true

     })
 })



 exports.managerAllUsers = BigPromise(async(req,res,next)=>{

    const users = await User.find({role: 'user'});
    const data = [];

    for( us of users){
        data.push({
            name: us.name,
            email: us.email
        });
    }
    

console.log(data);
    res.status(200).json({
        success: true,
        data
    });
 });
