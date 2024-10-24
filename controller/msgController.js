
const Token = require('../schema/token');
// Replace with your Firebase service account file path
const admin = require('firebase-admin');
// Initialize Firebase Admin SDK
// const serviceAccount = require('../credentials.json');
const serviceAccount = require('/app/credentials.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});


const sendMessage = async (req, res) => {
    const { token, title, body, data } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ success: false, message: 'Token, title, and body are required.' });
    }


    const message = {
        notification: {
            title: title,
            body: body,
        },
        android: {
            notification: {
                sound: 'default',
                priority: 'high',
            },
        },
        data: data || {},
        token: token,
    };

    try {
        const response = await admin.messaging().send(message);
        return res.status(200).json({ success: true, messageId: response });
    } catch (error) {
        console.error('Error sending notification:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}
const sendMessageToAllUsers = async (req, res) => {
    const { title, body, data } = req.body;

    if (!title || !body) {
        return res.status(400).json({ success: false, message: 'Title and body are required.' });
    }

    try {
        // Fetch all tokens from MongoDB
        const tokens = await Token.find().select('token');

        if (tokens.length === 0) {
            return res.status(404).json({ success: false, message: 'No tokens found.' });
        }

        // Extract the tokens from the result
        const tokenList = tokens.map(tokenDoc => tokenDoc.token);

        // Create a message for each token
        const message = {
            notification: {
                title: title,
                body: body,
            },
            android: {
                notification: {
                    sound: 'default',
                    priority: 'high',
                },
            },
            data: data || {},
            tokens: tokenList, // Multiple tokens
        };

        // Send messages to all tokens
        const response = await admin.messaging().sendEachForMulticast(message);

        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(tokenList[idx]);
                }
            });
            console.log('Failed tokens:', failedTokens);
        }

        return res.status(200).json({ success: true, successCount: response.successCount, failureCount: response.failureCount });
    } catch (error) {
        console.error('Error sending notifications to all users:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { sendMessage, sendMessageToAllUsers }