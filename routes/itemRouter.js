const express =require('express')
const {createItem,allItem, updateItem, deleteItem,allItemByLoginUser} = require('../controller/itemController')
const { authMiddleWare } = require('../middlewares/authMiddleware')
const { InputFeildValidation } = require('../middlewares/validationMiddleware')
const validationSchema = require('../middlewares/validationSchema')
const router = express.Router()


router.post('/create',InputFeildValidation(validationSchema.item),authMiddleWare,createItem)
router.get('/single-all',authMiddleWare,allItemByLoginUser)
router.get('/all',allItem)
router.put('/update/:id',InputFeildValidation(validationSchema.item),authMiddleWare,updateItem)
router.delete('/delete/:id',authMiddleWare,deleteItem)


module.exports = router