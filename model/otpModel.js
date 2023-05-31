const mongoose = require('mongoose'); // Erase if already required

var otpSchema = new mongoose.Schema({
        email:{
            type:String,
        },
        code:{
            type:String,
        },
        expireIn:{
            type:Number,
        },
        
    },
    {
        timestamps:true
    }
);



//Export the model
module.exports = mongoose.model('Otp', otpSchema);