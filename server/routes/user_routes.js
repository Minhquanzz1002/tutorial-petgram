const express = require('express');
const router = express.Router();
const UserModel = require('../models/user');

// Get by all Pets
router.get('/getAll', async (req, res) => {
    try {
        const data = await UserModel.find();
        res.json(data);
        console.log(new Date().toLocaleString() + ": Get all documents user successfully!");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get by Pet ID
router.get('/getOne/:user_id', async (req, res) => {
    let user_id = req.params.user_id;
    try {
        const data = await UserModel.findOneAndUpdate({user_id: user_id}, {user_id: user_id}, {upsert: true, new: true, setDefaultOnInsert: true});
        res.json(data);
        console.log(new Date().toLocaleString() + ": Get document user successfully!");
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 
router.patch('/update/:user_id', async (req, res) => {
    let user_id = req.params.user_id;
    let gender =  req.body.gender;
    let bio = req.body.bio;
    let facebook = req.body.facebook;
    let instagram = req.body.instagram;
    let fullname = req.body.fullname;

    try {
        const result = await UserModel.updateOne({user_id: user_id}, {gender: gender, bio: bio, facebook: facebook, instagram: instagram, fullname: fullname});
        if (result.modifiedCount == 0) {
            console.log(new Date().toLocaleString() +": Update user failed");
            res.status(400).json({message: new Date().toLocaleString() + ': Update user failed'});
        } else {
            console.log(new Date().toLocaleString() + ": Update user successfully");
            res.status(200).json({message: 'Update user successfully'});
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/create', async (req, res) => {
    let user_id = req.body.user_id;
    const data = new UserModel({user_id: user_id})
    try{
        const dataToSave = data.save();
        console.log(new Date().toLocaleString() + ": Insert user successfully")
        res.status(200).json({message: new Date().toLocaleString() + ": Insert user successfully"})
    } catch(err) {
        res.status(400).json({message: new Date().toLocaleString() + " : Insert user failed"})
    }
});


module.exports = router;
