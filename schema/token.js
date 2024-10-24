const mongoose = require('mongoose')


const tokenSchema = mongoose.Schema({
    token: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
        lowercase: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }

})

const Token = mongoose.model('Token', tokenSchema);
module.exports = Token;