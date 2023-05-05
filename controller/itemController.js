const Item = require('../model/itemModel')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongoDbId')

const createItem =  asyncHandler(async (req,res)=>{
    try {
        const {_id} = req.user
        const {name} = req.body
        const newItem = await Item.create({
            name,
            createdBy :_id
        })
        res.status(201).json({
            message:'Item created successfully',
            data:newItem,
            status:'Created'
        })
    } catch (error) {
        res.status(500).json({
            message:"Something went wrong",
            status:'Internal server error'
        })
    }
})

const allItemByLoginUser =  asyncHandler(async (req,res)=>{
    
    try {
        const {search} = req.query
        const {_id} = req.user
        
        const getItems = await Item.find({"createdBy":_id})
        const searchProduct = await Item.find({"createdBy":_id,"name":{$regex: ".*" + search + ".*",$options: 'i'  }})
        
        if(search || searchProduct.length > 0){
            res.status(200).json({
                message:'Item got successfully',
                data:searchProduct,
                status:'Ok',
                total:searchProduct.length
            })
        }else{
            res.status(200).json({
                message:'Item got successfully',
                data:getItems,
                status:'Ok',
                total:getItems.length
            })
        }

        
        
    } catch (error) {
        res.status(401).json({
            message:"Not Authrized fff",
            status:'Unauthorized'
        })
    }
})

const allItem =  asyncHandler(async (req,res)=>{
    try {
        // console.log(req)
        const {search} = req.query
        const getitems = await Item.find()
        const searchProduct = await Item.find({"name":{$regex: ".*" + search + ".*",$options: 'i'  }})
        
        if(search && searchProduct.length>0){
            res.status(200).json({
                message:'Item got successfully',
                data:searchProduct,
                status:'Ok',
                total:searchProduct.length
            })
        }else{
            res.status(200).json({
                message:'Item got successfully',
                data:getitems,
                status:'Ok',
                total:getitems.length
            })
        }

        
    } catch (error) {
        res.status(401).json({
            message:"Not Authrized",
            status:'Unauthorized'
        })
    }
})


const updateItem =  asyncHandler(async (req,res)=>{
    try{
        const {id} = req.params
        validateMongoDbId(id)
        const {_id} = req.user
        const finduser = await Item.findOne({_id:id})
        const {createdBy} = finduser
        if(createdBy.toString() === _id.toString()){
            try {
                const {name} = req.body || {}
                const updateItem = await Item.findByIdAndUpdate(id,{name},{new:true})
                console.log(updateItem)
                res.status(200).json({
                    message:'Item updated successfully',
                    data:updateItem,
                    status:'Ok',
                })
            } catch (error) {
                res.status(500).json({
                    message:"Something went wrong",
                    status:'Internal server error'
                })
            }

        }else{
            res.status(401).json({
                message:"User not valid",
                status:'Unauthorized'
            })
        }
        
    } catch (error) {
        res.status(404).json({
            message:"This id is not valid or has not been found!",
            status:'Not Found'
        })
    }
})

const deleteItem =  asyncHandler(async (req,res)=>{
    try{
        const {id} = req.params
        validateMongoDbId(id)
        const {_id} = req.user
        const finduser = await Item.findOne({_id:id})
        const {createdBy} = finduser
        if(createdBy.toString() === _id.toString()){
            try {
                const delteItem = await Item.findByIdAndDelete(id)
                console.log(deleteItem)
                res.status(202).json({
                    message:'Item deleted successfully',
                    data:delteItem,
                    status:'Accepted',
                })
            } catch (error) {
                res.status(500).json({
                    message:"Something went wrong",
                    status:'Internal server error'
                })
            }
        }else{
            res.status(401).json({
                message:"User not valid",
                status:'Unauthorized'
            })
        }
    } catch(error) {
        res.status(404).json({
            message:"This id is not valid or has not been found!",
            status:'Not Found'
        })
    }
    

})


module.exports = {createItem,allItem,updateItem,deleteItem,allItemByLoginUser}