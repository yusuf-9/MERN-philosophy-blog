const mongoose = require("mongoose")

const googleUser = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    role:{
        type: String,
        default: "user"
    }
})

module.exports = mongoose.model("googleUser", googleUser)