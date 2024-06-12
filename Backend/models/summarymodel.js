const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    deliveryaddress: {
        name: String,
        address: String,
        area: String,
        city: String,
        pin: String,
        phone: String
    },
    payable: {
        type: Number,
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number,
            price: Number
        }
    ],
    date: {
        type: Date,
        // default: Date.now
    },
    status: {
        type: String,
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        default: 'Unpaid'
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
