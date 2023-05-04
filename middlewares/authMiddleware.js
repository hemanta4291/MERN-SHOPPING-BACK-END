const express = require('express')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../model/userModal')


const authMiddleWare =  asyncHandler(async (req,res,next)=>{
    const {id} = req.params
    
       let token;
       if(req?.headers?.authorization?.startsWith("Bearer")){
            
            try {
                token = req?.headers?.authorization?.split(' ')[1]
                if(token){
                    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
                    const user = await User.findById(decode.id)
                    if(user){
                        req.user = user
                        next()
                    }else{
                        res.status(404).json({
                            message:"This user is not valid or has not been found!",
                            status:'Not Found'
                        })
                    }
                    
                }
            } catch (error) {
                res.status(401).json({
                    message:"Not Authrized",
                    status:'Unauthorized'
                })
                
            }
       }else{
        res.status(401).json({
            message:"There is no token attached to header",
            status:'Unauthorized'
        })
       }

})


const isAdmin =  asyncHandler(async (req,res,next)=>{
    const {email} = req.user
    const adminUser = await User.findOne({email})

    if(adminUser.role === 'admin'){
        next()
    }else{
        // throw new Error("you are not admin")
        next.error('you are not admin')
    }
})


module.exports = {authMiddleWare,isAdmin}