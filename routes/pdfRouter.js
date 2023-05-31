const express = require('express')
const router = express.Router()
const { geteratePdf, getPdf } = require('../controller/pdfController')



// pdf route
router.post('/create',geteratePdf)
router.get('/fetch',getPdf)



module.exports = router