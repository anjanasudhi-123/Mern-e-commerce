const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   
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
    },
    cart:{
        type:Array,
        ref:'Product'

    },
    likes:{
          type:Array,
          ref:'product'
    },
    isBanned:{
        type:Boolean,
        default:false
        
    }
})
const User = mongoose.model('user',userSchema)
module.exports = User