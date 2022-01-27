const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide product name"],
        trim: true,
        maxlength: [120, "product name should not be more than 120 characters"] 
    },
    price: {
        type: String,
        required: [true, "please provide product price"],
        maxlength: [6, "product price should not be more than 6 characters"] 
    },
    description: {
        type: String,
        required: [true, "please provide description"]
    },
    photos: [
        {
            id: {
                type: String,
                required: true
            }  ,
            secure_url: {
                type: String,
                required: true
            }   
        }
    ],
    category: {
        type: String,
        required: [true, "please provide category"],
        enum: {
            values: [
                'shortsleeves',
                'longsleeves',
                'sweatshirt',
                'hoodies'
            ],
            message: "please select category from only short-sleeves,long-sleeves,sweat-shirt and hoodies"
        }
    },

    brand: {
        type: String,
        required: [true, "please add a brand for clothing"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    noOfReviews: {
        type: Number,
        default: 0
    },
    reviews:[
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name:{
                type: String,
                required: true  
            },
            rating:{
                type: Number,
                required: true
            },
            comment:{
                type: String,
                required: true  
            },
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: User,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }


});



module.exports = mongoose.model("Product",productSchema);