const express = require('express');
const router = express.Router();
const PetModel = require('../models/pet');

// Get by all Pets
router.get('/getAll', async (req, res) => {
    try {
        const data = await PetModel.find();
        res.json(data);
        console.log(new Date().toLocaleString() + ": Get all documents pet successfully!");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get by Pet ID
router.get('/getOne/:pet_id', async (req, res) => {
    let pet_id = req.params.pet_id;
    try {
        const data = await PetModel.findOneAndUpdate({pet_id: pet_id}, {pet_id: pet_id}, {upsert: true, new: true, setDefaultOnInsert: true});
        res.json(data);
        console.log(new Date().toLocaleString() + ": Get document pet successfully!");
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
            console.log(new Date().toLocaleString() + ": Updated favorite successfully");
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
        if (result.modifiedCount == 0) {
            console.log(new Date().toLocaleString() + ": User ID not exists in arry of favorites");
            console.log(user_id);
            res.status(500).json({message: 'User ID not exists in arry of favorites'})
        }else{
            console.log(new Date().toLocaleString() + ": Updated unfavorite successfully");
            res.status(200).json({message: 'Updated unfavorite successfully'})
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.delete('/delete/:pet_id', async (req, res) => {
    let pet_id = req.params.pet_id;
    try {
        const result = await PetModel.deleteOne({pet_id: pet_id});
        if (result.modifiedCount == 0) {
            console.log(new Date().toLocaleString() + ": Pet ID not exists.");
            res.status(500).json({message: 'Pet ID not exists.'})
        }else{
            console.log(new Date().toLocaleString() + ": Delete Pet successfully");
            res.status(200).json({message: 'Delete Pet successfully'})
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.post('/create', async (req, res) => {
    let pet_id = req.body.pet_id;
    let created = req.body.created;
    const data = new PetModel({pet_id: pet_id, created: created})
    try{
        const dataToSave = data.save();
        console.log(new Date().toLocaleString() + ": Insert pet successfully")
        res.status(200).json({message: new Date().toLocaleString() + ": Insert pet successfully"})
    } catch(err) {
        res.status(400).json({message: new Date().toLocaleString() + " : Insert pet failed"})
    }
});

router.patch('/insert/comment/:pet_id', async (req, res) => {
    let user_id = req.body.user_id;
    let comment = req.body.comment;
    let pet_id = req.params.pet_id;
    try {
        const result = await PetModel.updateOne({pet_id: pet_id}, {$push: {comments: {user_id: user_id, comment: comment}}});
        if (result.modifiedCount == 0) {
            console.log("\nInsert comment failse");
            res.status(500).json({message: '\nInsert comment failse'});
        } else {
            console.log("\nInsert comment successfully");
            res.status(200).json({message: '\nInsert comment successfully'});
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
