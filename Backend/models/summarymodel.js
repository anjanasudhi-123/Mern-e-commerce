const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    deliveryAddress: {
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        pin: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        }
    },
    payable: {
        type: Number,
        required: true

    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentId: {
        type: String
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            image: {
                type: String,
                required: true
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
