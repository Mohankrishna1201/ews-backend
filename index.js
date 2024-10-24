const express = require('express');


const app = express();
app.use(express.json());


const token = require('./routes/saveToken.js');
app.use(token);

const sendMsg = require('./routes/sendMsg.js')
app.use(sendMsg);


// Start the Express server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
