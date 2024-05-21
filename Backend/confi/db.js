const mongoose = require("mongoose")

const connectDBS = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/myprod')
        .then(()=>{

            console.log('db connected')
        })

    }
    catch (err) {
        console.log(err)
        process.exit(1)
    }
}


module.exports = connectDBS