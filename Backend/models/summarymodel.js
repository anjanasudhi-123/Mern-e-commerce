const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        // required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
        // required: true
    },
    pin: {
        type: Number,
        // required: true
    },
    phone: {
        type: Number,
        // required: true
    },
    payment: {
        type: Number,
        // required: true
    },
    status: {
        type: String,
        // required: true,
        default: 'processing'
    }
})

const Order = mongoose.model('order', orderSchema)
module.exports = Order