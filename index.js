const express = require('express');
const bodyParser = require('body-parser')
const dbConnect = require('./config/dbConnect');
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const app = express();
const authRouter = require('./routes/authRouter')
const itemRouter = require('./routes/itemRouter')
const pdfRouter = require('./routes/pdfRouter')

dotenv.config()
const PORT = process.env.PORT || 4000


app.use(cookieParser())
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use('/api/user',authRouter)
app.use('/api/item',itemRouter)
app.use('/api/pdf',pdfRouter)


app.listen(PORT,async()=>{
    console.log(`server running..... ${PORT}`)
    await dbConnect()
})