
const Token = require('../schema/token');
// Replace with your Firebase service account file path

const admin = require('../index');
const imageUrl = "https://media.istockphoto.com/id/1152189152/vector/red-alert-icon.jpg?s=612x612&w=0&k=20&c=Kw_-i314F4cxgn2hmakp-88-O45FSx62c6r-OzKYMw4="

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
                sound: 'emergency.mp3',
                priority: 'high',
                channelId: 'sound_channel'
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
                    sound: 'emergency.mp3',
                    priority: 'high',
                    vibrateTimingsMillis: [0, 1000, 1000, 1000],  // Custom vibration pattern
                    visibility: 'public',
                    image: 'https://media.istockphoto.com/id/1152189152/vector/red-alert-icon.jpg?s=612x612&w=0&k=20&c=Kw_-i314F4cxgn2hmakp-88-O45FSx62c6r-OzKYMw4=',
                    channelId: 'sound_channel',


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

const sendMessageToAllAdmins = async (req, res) => {
    const { title, body, data } = req.body;

    if (!title || !body) {
        return res.status(400).json({ success: false, message: 'Title and body are required.' });
    }

    try {
        // Fetch tokens from MongoDB where role is 'admin'
        const tokens = await Token.find({ role: 'admin' }).select('token');

        if (tokens.length === 0) {
            return res.status(404).json({ success: false, message: 'No admin tokens found.' });
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
                    sound: 'emergency.mp3',
                    priority: 'high',
                    vibrateTimingsMillis: [0, 1000, 1000, 1000],  // Custom vibration pattern
                    visibility: 'public',
                    image: 'https://media.istockphoto.com/id/1152189152/vector/red-alert-icon.jpg?s=612x612&w=0&k=20&c=Kw_-i314F4cxgn2hmakp-88-O45FSx62c6r-OzKYMw4=',
                    channelId: 'sound_channel',
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
        console.error('Error sending notifications to admin users:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

const sendSocketMessageToAllAdmins = async () => {



    try {
        // Fetch tokens from MongoDB where role is 'admin'
        const tokens = await Token.find({ role: 'admin' }).select('token');

        if (tokens.length === 0) {
            return res.status(404).json({ success: false, message: 'No admin tokens found.' });
        }

        // Extract the tokens from the result
        const tokenList = tokens.map(tokenDoc => tokenDoc.token);

        // Create a message for each token
        const message = {
            notification: {
                title: 'title',
                body: 'body',
            },
            android: {
                notification: {
                    sound: 'emergency.mp3',
                    priority: 'high',
                    vibrateTimingsMillis: [0, 1000, 1000, 1000],  // Custom vibration pattern
                    visibility: 'public',
                    image: 'https://media.istockphoto.com/id/1152189152/vector/red-alert-icon.jpg?s=612x612&w=0&k=20&c=Kw_-i314F4cxgn2hmakp-88-O45FSx62c6r-OzKYMw4=',
                    channelId: 'sound_channel',
                },
            },
            data: {},
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
        console.error('Error sending notifications to admin users:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
};



module.exports = { sendMessage, sendMessageToAllUsers, sendMessageToAllAdmins, sendSocketMessageToAllAdmins }
