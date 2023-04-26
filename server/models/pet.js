const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
    pet_id: {
        required: true,
        type: String,
        unique: true,
    },
    created: {type: String},
    favourites: [
        {type: String}
    ],
    comments: [
        {
            user_id: String,
            comment: String,
        }
    ]
})

module.exports = mongoose.model('pets', PetSchema)
