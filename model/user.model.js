const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: "Required"
    },
    password: {
        type: String
    },
    email: {
        type: String
    }
})

module.exports = mongoose.model("users",userSchema)