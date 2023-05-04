const Joi = require("joi")

const InputFeildValidation = (schema)=>{
    return (req,res,next)=>{
        const {error} = schema.validate(req.body,{
            // abortEarly:false,
            errors:{
                wrap:{
                    label:''
                }
            }
        })
        if(error){
            // console.log(error)
            // const errorList = error?.details?.length > 0 && error.details.map(err=>err.message)
            res.status(422).json({
                message:error?.details[0].message,
                status:'Unprocessable Entity'
            })
        }else{
            next()
        }
    
       
    }
    
}

module.exports = {InputFeildValidation}