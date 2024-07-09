const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  area: {
    type: String,
    required: true
  },
  pin: {
    type: Number,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: Number,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  cart: {
    type: Array,
    ref: 'Product'
  },
  likes: {
    type: Array,
    ref: 'product'
  },
  orders:{
    type:Array,
    default:[]
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  addresses: [addressSchema] 
});

const User = mongoose.model('User', userSchema);

module.exports = {
  User,
  Address: mongoose.model('Address', addressSchema)
};
