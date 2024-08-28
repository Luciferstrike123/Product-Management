const mongoose = require('mongoose')

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Successfully connected")
    } catch (error) {
        this.log("Connection Error!")
    }
}
