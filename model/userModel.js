const mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: email,
        required: true
    }
})

mongoose.model("users",userSchema)