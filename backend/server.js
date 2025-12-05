
const express = require('express')
const dotenv = require("dotenv")
const cors = require('cors')

const connectToDB = require('./db/db')
const eventRoutes = require('./routes/event.route')
const profileRoutes = require('./routes/profile.route')
dotenv.config();
const app = express()
connectToDB();

app.use(cors({
    origin: "*"
}))
app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/profile', profileRoutes);
app.use('/api/event', eventRoutes);

app.get('/', (req, res) => {
    res.send("hello from the server")
})

app.listen(PORT, () => {
    console.log('server is running at PORT ', PORT)
})