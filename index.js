const express = require('express');
const admin = require('firebase-admin');
const { socketHandler } = require("./socketController/SocketFile.js")
// Initialize Firebase Admin SDK
const serviceAccount = require('./credentials');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
const app = express();
app.use(express.json());
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const token = require('./routes/saveToken.js');
app.use(token);
app.get('/', (req, res) => {
    res.send("hello");
})
const sendMsg = require('./routes/sendMsg.js')
app.use(sendMsg);
io.on("connection", socketHandler)

// Start the Express server
const PORT = process.env.PORT || 8080;
server.listen(PORT)
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
