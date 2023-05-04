const express =require('express')
const {createUser,loginUser} = require('../controller/userController')
const router = express.Router()
const {authMiddleWare,isAdmin} = require('../middlewares/authMiddleware')
const { InputFeildValidation } = require('../middlewares/validationMiddleware')
const validationSchema = require('../middlewares/validationSchema')

router.post('/register',InputFeildValidation(validationSchema.registration),createUser)
router.post('/login',InputFeildValidation(validationSchema.login),loginUser)

module.exports = router