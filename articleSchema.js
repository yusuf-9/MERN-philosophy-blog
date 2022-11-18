const mongoose = require("mongoose")

const Article = new mongoose.Schema({
    heading: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type: String,
        unique: true,
        required: true,
    },
    first_half:{
        type: String,
        required: true
    },
    second_half:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true,
    },
    category:{
        type: String,
        required: true
    },
    timeToRead:{
        type: Number,
        required: true
    },
    date_created:{
        type: String,
        default: `${Date().split(" ")[2]}th ${Date().split(" ")[1]}, ${Date().split(" ")[3]}`
    },
    last_updated:{
        type: Date,
        default: Date.now()
    },
    written_by:{
        type: String,
        default: "Yusuf Ahmed"
    },
    views:{
        type: Number,
        default: 0,
    },
    likes:[{
        email: {
            type: String,
            unique: true
        },
        name:{
            type: String
        },
        time:{
            type: Date,
            default: Date.now()
    }}],
    comments:[{
        email: {
            type: String,
            unique: true
        },
        name:{
            type: String
        },
        time:{
            type: Date,
            default: Date.now()
        },
        comment: {
            type: String,
            required: true
        }
    }]




})

module.exports = mongoose.model("Article", Article)