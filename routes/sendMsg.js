const express = require('express');


const router = express();

const messageController = require('../controller/msgController');


router.post('/sendMessage', messageController.sendMessage)
router.post('/sendtoall', messageController.sendMessageToAllUsers);


module.exports = router;