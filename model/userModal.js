const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true,
            index:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            default:'user'
        },
        createdBy:{
            type:String,
            default:null,
        },
        refreshToken:{
            type:String
        }
    },
    {
        timestamps:true
    }
);




// userSchema.pre("save", async function(next){
//     const salt = await bcrypt.genSaltSync(20);
//     this.password = await bcrypt.hash(this.password,salt)
// })

// userSchema.methods.isPasswordMatched = async function(enterpassword){
//     return await bcrypt.compare(enterpassword,this.password)
// }

//Export the model
module.exports = mongoose.model('User', userSchema);