const Token = require('../schema/token');




const saveToken = async (req, res) => {

    const { token, name, email } = req.body;

    if (!token || !name || !email) {
        res.status(400).json({ error: "token/email/name not found" });
    }
    const mod = {
        token: token,
        name: name,
        email: email

    }

    try {

        const savedToken = await Token.create(mod);
        return res.status(201).json({ success: true, data: savedToken });
    } catch (error) {
        return res.status(500).json({ failure: error.message });
    }

}

module.exports = { saveToken }