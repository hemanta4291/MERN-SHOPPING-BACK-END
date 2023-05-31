const express =require('express')
const {createUser,loginUser, emailSend, changePassword, getAllUsers, getSingleUser, updateSingleUser, getDeleteUser} = require('../controller/userController')
const router = express.Router()
const {authMiddleWare,isAdmin} = require('../middlewares/authMiddleware')
const { InputFeildValidation } = require('../middlewares/validationMiddleware')
const validationSchema = require('../middlewares/validationSchema')

router.post('/register',InputFeildValidation(validationSchema.registration),createUser)
router.post('/login',InputFeildValidation(validationSchema.login),loginUser)
router.get('/get-users',authMiddleWare,isAdmin,getAllUsers)
router.get('/single/:id',authMiddleWare,isAdmin,getSingleUser)
router.put('/update/:id',authMiddleWare,isAdmin,updateSingleUser)
router.delete('/delete/:id',authMiddleWare,isAdmin,getDeleteUser)
router.post('/send-email',emailSend)
router.post('/change-password',changePassword)

module.exports = router