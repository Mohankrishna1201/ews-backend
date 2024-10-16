const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./credentials.json'); // Replace with your Firebase service account file path

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json()); // To parse JSON request bodies

// Endpoint to send notification to Android device
app.post('/send-notification', async (req, res) => {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ success: false, message: 'Token, title, and body are required.' });
    }

    // Create the message with Android-specific options
    const message = {
        notification: {
            title: title,
            body: body,
        },
        android: {
            notification: {
                sound: 'default', // Optional: Customize sound
                priority: 'high', // Optional: Ensures immediate delivery
            },
        },
        data: data || {}, // Optional custom data payload
        token: token, // The FCM token of the target device
    };

    try {
        const response = await admin.messaging().send(message);
        return res.status(200).json({ success: true, messageId: response });
    } catch (error) {
        console.error('Error sending notification:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
