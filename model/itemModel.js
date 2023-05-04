const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    }
    
},
{
    timestamps:true
}
);


//Export the model
module.exports = mongoose.model('Item', itemSchema);