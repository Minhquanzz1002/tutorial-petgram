const express = require('express');
const router = express.Router();
const PetModel = require('../models/pet');

// Get by Pet ID
router.get('/getAll', async (req, res) => {
    try {
        const data = await PetModel.find();
        res.json(data);
        console.log("Get all documents successfully!");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get by Pet ID
router.get('/getOne/:pet_id', async (req, res) => {
    try {
        const data = await PetModel.findOne({pet_id: req.params.pet_id});
        res.json(data);
        console.log("Get document successfully!");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 
router.patch('/update/favourite/:pet_id', async (req, res) => {
    let user_id = req.body.user_id;
    let pet_id = req.params.pet_id;
    try {
        const result = await PetModel.updateOne({pet_id: pet_id}, {$addToSet: {favourites: user_id}});
        if (result.modifiedCount == 0) {
            console.log("User ID exists in arry of favorites");
            res.status(500).json({message: 'User ID exists in arry of favorites'});
        } else {
            console.log("Updated favorite successfully");
            res.status(200).json({message: 'Updated favorite successfully'});
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/update/unfavourite/:pet_id', async (req, res) => {
    let user_id = req.body.user_id;
    let pet_id = req.params.pet_id;
    try {
        const result = await PetModel.updateOne({pet_id: pet_id}, {$pull: {favourites: user_id}});
        console.log("Updated unfavorite successfully");
        res.status(200).json({message: 'Updated unfavorite successfully'})
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;
