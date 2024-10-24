const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');

const router = express();

const tokenController = require('../controller/tokenController');

dotenv.config();



mongoose.connect('mongodb+srv://21ee01037:KyL293koQ9w0kgXC@cluster0.lyoti.mongodb.net/')
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('Error connecting to MongoDB:', error));


router.post("/saveToken", tokenController.saveToken);



module.exports = router;
