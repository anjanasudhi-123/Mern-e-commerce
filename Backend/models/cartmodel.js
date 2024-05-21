const mongoose = require('mongoose');

const combinedSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cart: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', 
            required: true
        },
        quantity: {
            type: Number,
            required:true
        },
        price:{
            type:Number,
            required:true
        }
    }],
    likes: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

const CombinedModel = mongoose.model("CombinedModel", combinedSchema);
module.exports = CombinedModel;