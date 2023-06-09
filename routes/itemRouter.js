const express =require('express')
const {createItem,allItem, updateItem, deleteItem,allItemByLoginUser, getAllFetchItemByPagi} = require('../controller/itemController')
const { authMiddleWare } = require('../middlewares/authMiddleware')
const { InputFeildValidation } = require('../middlewares/validationMiddleware')
const validationSchema = require('../middlewares/validationSchema')
const { geteratePdf } = require('../controller/pdfController')
const router = express.Router()


router.post('/create',InputFeildValidation(validationSchema.item),authMiddleWare,createItem)
router.get('/single-all',authMiddleWare,allItemByLoginUser)
router.get('/all',allItem)
router.get('/all-fetch',getAllFetchItemByPagi)
router.put('/update/:id',InputFeildValidation(validationSchema.item),authMiddleWare,updateItem)
router.delete('/delete/:id',authMiddleWare,deleteItem)

// pdf route
router.post('/pdf',geteratePdf)


module.exports = router