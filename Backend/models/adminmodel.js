const mongoose = require("mongoose")

const adminSchema = new mongoose.Schema({
   
    email:{
      type: String,
      required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})
const Admin = mongoose.model('admin',adminSchema)
module.exports = Admin