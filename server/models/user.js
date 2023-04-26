const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_id: {
        required: true,
        type: String,
    },
    avatar: {type: String, default: "https://raw.githubusercontent.com/Minhquanzz1002/tutorial-petgram/8dbc5eaf96cdc068acf98e82fd81c9f040b12301/src/images/avatar.png"},
    bio: {type: String, default: "Unknown"},
    facebook: {type: String, default: "https://www.facebook.com/"},
    instagram: {type: String, default: "https://www.instagram.com/"},
    gender: {type: Boolean},
    fullname: {type: String, default: "Unnamed"}
})

module.exports = mongoose.model('users', UserSchema)
