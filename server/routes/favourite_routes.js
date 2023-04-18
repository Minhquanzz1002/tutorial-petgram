const express = require('express');
const router = express.Router();
const PetModel = require('../models/pet');


// 
router.patch('update/favourite', async (req, res) => {
    const user_id = req.body.user_id;
    console.log(user_id)
    let pet_id = req.body.pet_id;
    try {
        const data = await PetModel.findOne({pet_id: pet_id});
        data.favourites.push(user_id);
        await data.save();
        console.log("Updated favorite successfully");
        res.status(200).json({message: 'inserted'})
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.patch('update/unfavourite', async (req, res) => {
    const user_id = req.body.user_id;
    console.log(user_id)
    let pet_id = req.body.pet_id;
    try {
        const data = await PetModel.findOne({pet_id: pet_id});
        data.favourites.push(user_id);
        await data.save();
        console.log("Updated favorite successfully");
        res.status(200).json({message: 'inserted'})
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = favourite_router;
