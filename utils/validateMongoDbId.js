const ObjectId = require('mongoose').Types.ObjectId;

const validateMongoDbId = (id) =>{
    
    if(!ObjectId.isValid(id)) throw new Error("Id not found !")
}


module.exports = validateMongoDbId