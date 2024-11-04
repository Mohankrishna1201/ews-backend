const express = require('express');


const router = express();

const messageController = require('../controller/msgController');
const otpController = require('../controller/otpController')

router.post('/sendMessage', messageController.sendMessage)
router.post('/sendtoall', messageController.sendMessageToAllUsers);
router.post('/sendtoadmin', messageController.sendMessageToAllAdmins);
router.post('/sendOtp', otpController.sendOtp);
router.post('/verifyOtp', otpController.verifyOtp);


module.exports = router;