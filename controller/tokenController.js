const Token = require('../schema/token');

const saveToken = async (req, res) => {
    const { token, name, email } = req.body;

    if (!token || !name || !email) {
        return res.status(400).json({ error: "token/email/name not found" });
    }

    const mod = {
        token: token,
        name: name,
        email: email
    }

    try {
        // Check if the token already exists for the user
        const existingToken = await Token.findOne({ token: token, email: email });

        if (existingToken) {
            // Token already exists, but no error, just acknowledge success
            return res.status(200).json({ success: true, message: "Token already exists, no need to store again" });
        }

        // Save new token if it's unique for this email
        const savedToken = await Token.create(mod);
        return res.status(201).json({ success: true, data: savedToken });
    } catch (error) {
        return res.status(500).json({ failure: error.message });
    }
}

module.exports = { saveToken };
