
const {generateToken} = require('../config/jsonWebToken')
const User = require('../model/userModal')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const validateMongoDbId = require('../utils/validateMongoDbId')
const { generateRefreshToken } = require('../config/refreshToken')


const createUser =  asyncHandler(async (req,res)=>{
    const {email,password,name} = req.body
    const bcryptPassword = await bcrypt.hash(password,10)
    const findUser = await User.findOne({email})
    if(!findUser){
        const newUser = await User.create({
            name,
            email,
            createdBy:name,
            password:bcryptPassword
        })
        res.status(201).json({
            message:'Registration done successfully',
            data:newUser,
            status:'Created'
        })

    }else{
        res.status(422).json({
            message:'This email already exists',
            status:'Unprocessable Entity'
        })
        
        } 
})


const loginUser =  asyncHandler(async (req,res)=>{
    const {email:reqEmail,password} = req.body
    const findUser = await User.findOne({email:reqEmail})
    if(findUser){
        const {_id,name,email,password:bcryptPassword} = findUser || {}
        const isValidPassword = await bcrypt.compare(password,bcryptPassword)
        
        if(isValidPassword){
            const refreshToken = await generateRefreshToken(_id)
            const updateUser = await User.findByIdAndUpdate(_id,
                {
                    refreshToken
                },
                {
                    new:true
                }
            )
            res.cookie('refreshToken',refreshToken,
            {
                httpOnly:true,
                maxAge:72*60*60*1000
            })
            res.status(200).json({
                message:'Login done successfully',
                data:{
                    _id,
                    name,
                    email,
                },
                accessToken: generateToken(_id),
                status:'Ok'
            })
            
        }else{
            res.status(401).json({
                message:'Invalid Credentials',
                status:'Unauthorized'
            })
        }
        
    }else{
        res.status(401).json({
            message:'Invalid Credentials',
            status:'Unauthorized'
        })
    }
    
})



module.exports = {createUser,loginUser}