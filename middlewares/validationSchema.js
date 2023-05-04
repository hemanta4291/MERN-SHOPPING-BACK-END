const Joi = require("joi")


const validationSchema = {
    registration : Joi.object({
        name:Joi.string().min(6).max(31).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(31).required(),
        confirmPassword:Joi.ref("password")
    }),
    login : Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(31).required(),
    }),
    item : Joi.object({
        name:Joi.string().required()
    })

}

module.exports = validationSchema