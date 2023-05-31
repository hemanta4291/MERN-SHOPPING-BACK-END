
const {generateToken} = require('../config/jsonWebToken')
const User = require('../model/userModal')
const Otp = require('../model/otpModel')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const { generateRefreshToken } = require('../config/refreshToken')
const { find } = require('../model/itemModel')
const nodemailer = require('nodemailer')
const { transporter } = require('../config/emailConfig')
const validateMongoDbId = require('../utils/validateMongoDbId')





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
        const {_id,name,role,email,password:bcryptPassword} = findUser || {}
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
                    role
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


// get all users by admin
const getAllUsers =  asyncHandler(async (req,res)=>{
    try {
        const {email} = req.user
        const getUsers = await User.find({ email: { $ne: email } }).select({password:0})
        res.status(200).json({
            message:'Users got successfully',
            data:getUsers,
            status:'Ok',
            total:getUsers.length
        })
    } catch (error) {
        res.status(422).json({
            message:'Not Found !',
            status:'Not Found'
        })
    }

})


const getSingleUser =  asyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const getUser = await User.findById(id).select({password:0})

        res.status(200).json({
            message:'User got successfully',
            data:getUser,
            status:'Ok',
        })
    } catch (error) {
        res.status(422).json({
            message:'Not Found !',
            status:'Not Found'
        })
    }

})

// update user by admin

const updateSingleUser =  asyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    const {name,role} = req.body || {}
    try {
        const updateUser = await User.findByIdAndUpdate(id,{name,role},{ new:true})
        res.status(200).json({
            message:'User Update successfully',
            data:updateUser,
            status:'Ok',
        })
    } catch (error) {
        res.status(422).json({
            message:'User not Update !',
            status:'Not Found'
        })
    }

})



// delete user

const getDeleteUser =  asyncHandler(async (req,res)=>{
    const {id} = req.params
    validateMongoDbId(id)
    try {
        const delteUser = await User.findByIdAndDelete(id)
        res.status(200).json({
            message:'User Delete successfully',
            data:delteUser,
            status:'Ok',
        })
    } catch (error) {
        res.status(422).json({
            message:'User not Delete !',
            status:'Not Found'
        })
    }

})



const emailSend =  asyncHandler(async (req,res)=>{
    const findUser = await User.findOne({email:req.body.email},{password:0})
    if(findUser){

        let code = Math.floor((Math.random()*10000)+1)
        let expireIn = new Date().getTime() + 300*1000

        const otpData = await Otp.create({
            email:req.body.email,
            code,
            expireIn
        })

        if(otpData){
            console.log(process.env.AUTH_PASSWORD)
            const mailOptions = {
                from:process.env.AUTH_EMAIL,
                to:req.body.email,
                subject:'Sendig Forgot password',
                text:`Otp ${code}`
            }

            transporter.sendMail(mailOptions,(error,info)=>{
                // console.log(error)
                if(error){
                    res.status(401).json({
                        message:'Email Not Send',
                        status:'Unauthorized'
                    })
                }else{
                    res.status(200).json({
                        message:'Email Send Successfully',
                        status:'Ok'
                    })
                }
            })
        }
    }else{
        res.status(422).json({
            message:'Email id not Exit !',
            status:'Not Found'
        })
    }
})

const changePassword =  asyncHandler(async (req,res)=>{
    const findOpt = await Otp.findOne({email:req.body.email,code:req.body.code})
    console.log(findOpt)
    if(findOpt){
        let currentTime = new Date().getTime()
        let diff = findOpt.expireIn - currentTime

        console.log(diff)

        if(diff < 0){
          
            res.status(422).json({
                message:'code expired !',
                status:'Not Found'
            })
        }else{
            const bcryptPassword = await bcrypt.hash(req.body.password,10)
            const findUser = await User.findOne({email:req.body.email})
            const updateUser = await User.findByIdAndUpdate(findUser._id,{password:bcryptPassword},{new:true})
            res.status(200).json({
                message:'success !',
                data:updateUser,
                status:'Ok'
            })
        }

    }else{
        res.status(422).json({
            message:'not Found!',
            status:'Not Found'
        })
    }
})



module.exports = {
    createUser,
    loginUser,
    emailSend,
    changePassword,
    getAllUsers,
    getSingleUser,
    updateSingleUser,
    getDeleteUser
}