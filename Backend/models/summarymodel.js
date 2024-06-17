const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    deliveryaddress: {
        name: {
            type: String,
            // required: true
        },
        address: {
            type: String,
            // required: true
        },
        area: {
            type: String,
            // required: true
        },
        city: {
            type: String,
            // required: true
        },
        pin: {
            type: String,
            // required: true
        },
        phone: {
            type: String,
            // required: true
        }
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
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
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
