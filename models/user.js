const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: [true, "please enter a name"],
        maxlength: [40, 'too long, enter not more than 40 chars']
    },
    email: {
        type: String,
        required: [true, "please enter an email"],
        validate: [validator.isEmail, "please enter correct email format"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "please enter a name"],
        minlength: [6, "enter 6 or more digits"],
        select: false
    },
    role: {
        type: String,
        default: "user"
    },
    photo: {
        id: {
            type: String,
            required:true
            
        },
        secure_url: {
            type: String,
            required:true
            
        }
    },
    forgotPasswordtoken: String,
    forgotPasswordExpiry: String,
    createdAt: {
        type: Date,
        default: Date.now
    }

});

//encrypt password before saving -- HOOKS
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 10);
});

//validate the password with user passed password

userSchema.methods.idValidatedPassword = async function(password){

    return await bcrypt.compare(password, this.password);
}

//create and return jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRY
    });
}

//generate forgot password token(String)
userSchema.methods.getForgotPasswordToken = function(){
    //generate a long and random string
    const forgotToken = crypto.randomBytes(20).toString('hex');

    //getting a hash-- make sure to get the hash on the backend
    this.forgotPasswordtoken = crypto
        .createHash("sha256")
        .update(forgotToken)
        .digest("hex");

        this.forgotPasswordExpiry = Date.now()+ 20*60*1000
        return forgotToken;
}

module.exports = mongoose.model('User', userSchema);