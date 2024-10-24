const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');

const router = express();

const tokenController = require('../controller/tokenController');

dotenv.config();



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((error) => console.log('Error connecting to MongoDB:', error));


router.post("/saveToken", tokenController.saveToken);



module.exports = router;