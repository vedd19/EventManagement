const mongoose = require('mongoose')

const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'eventmanagement'
        })
        console.log('connected to mongodb')
    }
    catch (err) {
        console.log('error while connecting to mongodb', err)
    }
}

module.exports = connectToDB