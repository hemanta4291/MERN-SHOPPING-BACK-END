const {default:mongoose} = require('mongoose')


const dbConnect = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        console.log('database connect successfully')
    } catch (error) {
        console.log('database connect error')
    }
}

module.exports = dbConnect