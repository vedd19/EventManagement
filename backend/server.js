
const express = require('express')
const dotenv = require("dotenv")
const connectToDB = require('./db/db')
dotenv.config();
const app = express()
connectToDB();

const PORT = process.env.PORT || 5000



app.get('/', (req, res) => {
    res.send("hello from the server")
})


app.listen(PORT, () => {
    console.log('server is running at PORT ', PORT)
})