const express = require('express')
const Razorpay = require('razorpay')
const cors = require('cors')
const connectDBS = require('./confi/db')
const adminroutes = require('./routes/adminroutes')
const userroutes = require('./routes/userroutes')


const app = express()
const PORT = 4400;

app.use(express.json())
app.use(cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}))
connectDBS()

app.use('/api/admin', adminroutes)
app.use('/api/user', userroutes)



app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})